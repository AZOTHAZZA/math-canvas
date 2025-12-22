export default async function handler(req, res) {
  // 防壁：POSTメソッドのみを許可
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { message } = req.body;

  // 2. 数理的沈黙への変換（LVMロジック / マスターの選んだ tanh 写像）
  const seed = (message ? message.length : 0) * 0.05; 
  const ratio = (Math.tanh(seed) * 1.618033).toFixed(4);

  // 3. 新型対話型AI（Logos）による応答生成
  const responseText = `意志の写像を確認。生成された比率は ${ratio} です。これが現在の数理的均衡点です。`;

  res.status(200).json({
    ratio: ratio,
    reply: responseText
  });
}
