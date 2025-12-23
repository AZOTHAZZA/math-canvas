/**
 * LvmComponents.js
 * UI Layer for Logos Logic Engine
 * Custom Web Components for real-time balance and transactions.
 */
import { LogosDecimal } from './LogosDecimal.js';

// 1. 残高表示コンポーネント <lvm-balance-card>
export class LvmBalanceCard extends HTMLElement {
    set data({ userId, currency, balance }) {
        this.innerHTML = `
            <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; background: #f9f9f9;">
                <small>${userId} の資産</small>
                <div style="font-size: 1.2em; font-weight: bold; color: #007bff;">
                    ${balance.toString()} <span style="font-size: 0.8em; color: #666;">${currency}</span>
                </div>
            </div>
        `;
    }
}

// 2. トランザクション・フォーム <lvm-tx-form>
export class LvmTxForm extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div style="padding: 15px; border: 2px solid #000; border-radius: 8px;">
                <h4>💸 執行（送金・交換）</h4>
                <select id="tx-type" style="width: 100%; margin-bottom: 10px;">
                    <option value="transfer">送金 (Transfer)</option>
                    <option value="exchange">交換 (Exchange)</option>
                </select>
                <input type="text" id="target-id" placeholder="宛先ID (送金時のみ)" style="width: 100%; margin-bottom: 10px;">
                <input type="number" id="tx-amount" placeholder="金額" style="width: 100%; margin-bottom: 10px;">
                <select id="tx-currency" style="width: 100%; margin-bottom: 10px;">
                    <option value="USD">USD</option><option value="JPY">JPY</option>
                    <option value="EUR">EUR</option><option value="BTC">BTC</option>
                    <option value="ETH">ETH</option><option value="MATIC">MATIC</option>
                </select>
                <button id="exec-btn" style="width: 100%; background: #000; color: #fff; padding: 10px; cursor: pointer;">
                    ロゴスを執行する
                </button>
            </div>
        `;

        this.querySelector('#exec-btn').onclick = () => {
            const detail = {
                type: this.querySelector('#tx-type').value,
                target: this.querySelector('#target-id').value,
                amount: this.querySelector('#tx-amount').value,
                currency: this.querySelector('#tx-currency').value
            };
            this.dispatchEvent(new CustomEvent('logos-exec', { detail }));
        };
    }
}

customElements.define('lvm-balance-card', LvmBalanceCard);
customElements.define('lvm-tx-form', LvmTxForm);
