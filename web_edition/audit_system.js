/**
 * core/audit_system.js
 * 役割: デジタル署名による監査と、プライバシー保護のための隠蔽
 */

const AuditSystem = {
    // マスターの秘密鍵（シミュレーション用：実際にはもっと複雑なハッシュ）
    _secretKey: "LOGOS_MASTER_KEY_001",

    /**
     * 取引にデジタル署名を刻む
     * これにより、後から「誰が」「いつ」この価値を動かしたかを証明可能にする
     */
    generateSignature: (txData) => {
        const payload = JSON.stringify(txData);
        // 簡易的な署名生成（本来はCrypto APIを使用）
        return `SIG_${btoa(payload).slice(0, 16)}_${Date.now()}`;
    },

    /**
     * 監査ログの記録
     * 沈黙モード（Silence Mode）がONの場合、高度なログは隠蔽される
     */
    log: (message, level = "INFO", isSecret = false) => {
        const isSilence = localStorage.getItem('LVM_SILENCE_MODE') === 'true';
        
        // 秘匿フラグがあり、かつ沈黙モードなら、UIには何も出さない
        if (isSecret && isSilence) {
            console.log("[LVM_SILENCE_ACTIVE]: 秘密ログをインターセプトしました。");
            return;
        }

        if (window.logAudit) {
            window.logAudit(`${level}: ${message}`);
        }
    },

    /**
     * 沈黙モードの切り替え
     */
    toggleSilence: () => {
        const current = localStorage.getItem('LVM_SILENCE_MODE') === 'true';
        localStorage.setItem('LVM_SILENCE_MODE', !current);
        const state = !current ? "ACTIVE" : "INACTIVE";
        AuditSystem.log(`プライバシー保護モード: ${state}`, "SYSTEM");
        return !current;
    }
};

window.AuditSystem = AuditSystem;