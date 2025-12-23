/**
 * identities/identity_ui.js
 * 役割: 身分証の「視覚的再現」と動的描画
 */
const LVM_ID_UI = {
    /**
     * ダッシュボード上のIDカードをレンダリング
     */
    render: (targetId) => {
        const container = document.getElementById(targetId);
        if (!container) return;

        container.className = "aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-5 shadow-2xl relative overflow-hidden border border-white/10";
        
        container.innerHTML = `
            <div class="absolute top-[-20%] right-[-10%] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div class="flex justify-between items-start h-full flex-col">
                <div class="flex justify-between w-full">
                    <div class="w-12 h-14 bg-white/5 border border-white/10 rounded-md flex items-center justify-center backdrop-blur-md">
                        <span class="text-[8px] text-blue-400 font-black">LOGOS</span>
                    </div>
                    <div class="text-right">
                        <p class="text-[7px] text-blue-400 font-bold tracking-[0.3em]">REPUBLIC OF LOGOS</p>
                        <p class="text-[10px] text-white font-mono tracking-tighter">DIGITAL IDENTITY</p>
                    </div>
                </div>
                
                <div>
                    <p class="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Holder Identity</p>
                    <p class="text-lg font-mono font-bold text-white tracking-widest">LOGOS_USER_A</p>
                </div>

                <div class="w-full flex justify-between items-end">
                    <div class="text-[8px] font-mono text-slate-400">
                        VALID THRU: 2099/12/31<br>
                        AUTH_SIG: LVM_SOVEREIGN_ROOT
                    </div>
                    <div class="w-10 h-10 bg-white p-1 rounded-sm">
                        <div class="w-full h-full bg-slate-900"></div>
                    </div>
                </div>
            </div>
        `;
    }
};

// 既存のLVM_IDオブジェクトをこれらで統合・更新
window.LVM_ID = {
    ...LVM_ID_CLONE,
    renderClone: () => LVM_ID_UI.render('lvm-id-display')
};