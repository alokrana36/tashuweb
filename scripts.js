export default async function handler(req, res) {
// --- CORS ---
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') return res.status(200).end();


if (req.method !== 'POST') {
return res.status(405).json({ ok: false, error: 'Method not allowed' });
}


try {
const {
filename: rawName,
dataURL, // e.g. "data:image/jpeg;base64,...."
caption = '' // optional; stored in commit message only
} = req.body || {};


if (!dataURL || !/^data:image\//.test(dataURL)) {
return res.status(400).json({ ok: false, error: 'Invalid image dataURL' });
}


// --- config from env ---
const OWNER = process.env.GH_OWNER; // your GitHub username/org
const REPO = process.env.GH_REPO; // your repo name
const BRANCH = process.env.GH_BRANCH || 'main';
const TOKEN = process.env.GH_TOKEN; // classic/pat: repo contents scope
if (!OWNER || !REPO || !TOKEN) {
return res.status(500).json({ ok: false, error: 'Server not configured' });
}


// Sanitize filename and ensure extension
const safe = (s) => (s || 'upload').toLowerCase().replace(/[^a-z0-9._-]/g, '-');
let filename = safe(rawName);
if (!/\.(png|jpe?g|gif|webp|avif)$/i.test(filename)) filename += '.jpg';


// Avoid collisions by prefixing timestamp
const ts = new Date().toISOString().replace(/[:.]/g, '-');
const path = `images/${ts}-${filename}`;


// Extract base64 part
const base64 = dataURL.split(',')[1];


const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;


const resp = await fetch(apiUrl, {
method: 'PUT',
headers: {
'Authorization': `Bearer ${TOKEN}`,
'Accept': 'application/vnd.github+json',
'Content-Type': 'application/json'
},
body: JSON.stringify({
message: `Add image: ${filename}${caption ? ` — ${caption}` : ''}`,
content: base64,
branch: BRANCH
})
});


const json = await resp.json();
if (!resp.ok) {
return res.status(resp.status).json({ ok: false, error: json.message || 'GitHub API error' });
}


const rawUrl = `https://github.com/alokrana36/${OWNER}/${REPO}/${BRANCH}/${path}`;
const htmlUrl = json.content && json.content.html_url; // nice to have


return res.status(200).json({ ok: true, url: rawUrl, htmlUrl });
} catch (e) {
return res.status(500).json({ ok: false, error: e.message });
}
}