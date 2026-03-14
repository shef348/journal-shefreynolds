// OAuth proxy for Decap CMS - Step 2: exchange code for token
const https = require('https');

function exchangeCodeForToken(clientId, clientSecret, code) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ client_id: clientId, client_secret: clientSecret, code });
    const options = {
      hostname: 'github.com',
      path: '/login/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (resp) => {
      let data = '';
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Bad response: ' + data)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  const fullUrl = 'https://journal.shefreynolds.com' + req.url;
  const code = new URL(fullUrl).searchParams.get('code');

  console.log('callback handler, code present:', !!code);

  if (!code) {
    res.status(400).send('Missing code parameter');
    return;
  }

  try {
    const data = await exchangeCodeForToken(
      process.env.GITHUB_CLIENT_ID,
      process.env.GITHUB_CLIENT_SECRET,
      code
    );

    console.log('token exchange:', data.access_token ? 'success' : JSON.stringify(data));

    if (data.access_token) {
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <script>
          const token = "${data.access_token}";
          const msg = JSON.stringify({ token, provider: "github" });
          window.opener.postMessage('authorization:github:success:' + msg, '*');
          window.close();
        </script>
      `);
    } else {
      res.status(401).send('Authentication failed: ' + JSON.stringify(data));
    }
  } catch (err) {
    console.error('callback error:', err.message);
    res.status(500).send('Server error: ' + err.message);
  }
};
