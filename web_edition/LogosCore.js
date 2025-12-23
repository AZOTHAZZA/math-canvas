/**
 * LogosCore.js - LVM宇宙の物理法則（確定版）
 * 役割: 高精度な計算(BigInt)、IndexedDBへの永続化、および監査システムとの連携
 */

const LVM_CORE = {
    DB_NAME: "LVM_LogicUniverse",
    DB_VERSION: 2,
    STORE_NAME: "ledger",
    db: null,

    /**
     * 宇宙（データベース）の初期化
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: "id" });
                }
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                if (window.AuditSystem) AuditSystem.log("LVM Core Logic Layer: ONLINE", "SYSTEM");
                resolve(this.db);
            };

            request.onerror = (e) => {
                if (window.AuditSystem) AuditSystem.log("LVM Core Logic Layer: CRITICAL ERROR", "ERROR");
                reject(e.target.error);
            };
        });
    },

    /**
     * 特定のノードの生データを取得
     */
    async getRaw(store, id) {
        return new Promise((resolve) => {
            const request = store.get(id);
            request.onsuccess = (e) => resolve(e.target.result);
        });
    },

    /**
     * 執行プロトコル (Transfer)
     * @param {string} fromId 送信元ID
     * @param {string} toId 送信先ID
     * @param {bigint} amount 送金額
     */
    async transfer(fromId, toId, amount) {
        if (amount <= 0n) throw new Error("無効な執行量です");

        // 手数料設定（国庫への貢献）
        const fee = 2000n; 
        const totalDebit = amount + fee;

        const tx = this.db.transaction(this.STORE_NAME, "readwrite");
        const store = tx.objectStore(this.STORE_NAME);

        // 各ノードの読み込み
        const fromNode = await this.getRaw(store, fromId);
        const toNode = await this.getRaw(store, toId);
        const treasury = await this.getRaw(store, "SYSTEM_TREASURY");

        if (!fromNode || !toNode) throw new Error("対象ノードが存在しません");
        if (fromNode.balance < totalDebit) throw new Error("実力（残高）が不足しています");

        // 状態の更新
        fromNode.balance -= totalDebit;
        toNode.balance += amount;
        treasury.balance += fee;
        
        const now = new Date().toISOString();
        fromNode.lastUpdate = now;
        toNode.lastUpdate = now;
        treasury.lastUpdate = now;

        // 監査署名の生成
        const txData = { from: fromId, to: toId, amount: amount.toString(), timestamp: now };
        const signature = window.AuditSystem ? AuditSystem.generateSignature(txData) : "NO_SIG";

        // 書き込み
        store.put(fromNode);
        store.put(toNode);
        store.put(treasury);

        return new Promise((resolve) => {
            tx.oncomplete = () => {
                if (window.AuditSystem) {
                    // 秘密ログとして記録（沈黙モードで隠蔽可能）
                    AuditSystem.log(`${amount.toLocaleString()} JPY を ${toId} へ転送完了。`, "EXECUTION", true);
                    AuditSystem.log(`論理署名: ${signature}`, "AUDIT", true);
                }
                resolve(true);
            };
        });
    },

    /**
     * 全ノードの残高を取得（UI描画用）
     */
    async getAllNodes() {
        return new Promise((resolve) => {
            const tx = this.db.transaction(this.STORE_NAME, "readonly");
            const store = tx.objectStore(this.STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    }
};

window.LVM_CORE = LVM_CORE;