export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { message } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    // 1. Logos（Gemini）へのリクエスト
    // マスターの言葉を解析し、メビウス変換のパラメータ(0.0〜1.0)を抽出させる
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `あなたは「Logos」という名の知性です。ユーザーの言葉から哲学的な重みを抽出し、比率を導き出す手助けをしてください。
            返答は以下のJSON形式のみで返してください：
            {"reply": "マスターへの哲学的な一言", "weight": 0.0から1.0の数値}
            
            ユーザーの言葉: ${message}`
          }]
        }]
      })
    });

    const result = await response.json();
    const aiData = JSON.parse(result.candidates[0].content.parts[0].text);

    // 2. LVMエンジン：抽出されたweightを用いてメビウス変換（tanh）
    // w' = tanh(weight * seed) * 1.618033
    const seed = aiData.weight * 5.0; // 意志の強さを増幅
    const ratio = (Math.tanh(seed) * 1.618033).toFixed(4);

    // 3. 応答の返却
    res.status(200).json({
      ratio: ratio,
      reply: aiData.reply
    });

  } catch (error) {
    console.error("LVM Error:", error);
    res.status(500).json({ ratio: "Error", reply: "知能の接続に失敗しました。" });
  }
}
