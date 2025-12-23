/**
 * LogosStorage.js
 * LVM(Logos Logic Engine) Persistence Layer
 * Manages the immutable ledger and state in IndexedDB.
 */
export class LogosStorage {
    constructor(dbName = "LVM_World_State") {
        this.dbName = dbName;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                // 最新の残高状態を保持するストア
                if (!db.objectStoreNames.contains("accounts")) {
                    db.createObjectStore("accounts", { keyPath: "id" });
                }
                // 監査ログ（歴史）を保持するストア
                if (!db.objectStoreNames.contains("audit_logs")) {
                    const logStore = db.createObjectStore("audit_logs", { keyPath: "timestamp" });
                    logStore.createIndex("tx_type", "tx_type", { unique: false });
                }
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };
            request.onerror = (e) => reject("LVM Storage Initialization Failed");
        });
    }

    async getAllAccounts() {
        return new Promise((resolve) => {
            const tx = this.db.transaction("accounts", "readonly");
            const store = tx.objectStore("accounts");
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    }

    async commitTransaction(updatedAccounts, newAuditEntry) {
        const tx = this.db.transaction(["accounts", "audit_logs"], "readwrite");
        const accountStore = tx.objectStore("accounts");
        const logStore = tx.objectStore("audit_logs");

        // アカウント状態の更新
        for (const [id, balances] of Object.entries(updatedAccounts)) {
            // BigIntをシリアライズするために文字列に変換して保存
            const serializedBalances = {};
            for (const [curr, dec] of Object.entries(balances)) {
                serializedBalances[curr] = dec.value.toString();
            }
            accountStore.put({ id, balances: serializedBalances });
        }

        // 監査ログの追記
        logStore.add(newAuditEntry);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject("Failed to commit to LVM Storage");
        });
    }
}
