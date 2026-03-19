const USDA_KEY = process.env.USDA_KEY || 'ifeGCxmZB0jEsnxd1QLicRvO92NeL8Xg6AumX2Vi';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'No query' });

  try {
    const r = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(q)}&pageSize=15&dataType=SR%20Legacy,Survey%20(FNDDS)&api_key=${USDA_KEY}`
    );
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Search failed' });
  }
}
