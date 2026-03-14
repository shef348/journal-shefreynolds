// OAuth proxy for Decap CMS GitHub authentication
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
  // Parse query string explicitly from the URL
  const fullUrl = 'https://journal.shefreynolds.com' + req.url;
  const parsedUrl = new URL(fullUrl);
  const code = parsedUrl.searchParams.get('code');

  console.log('auth handler called, url:', req.url, 'code present:', !!code);

  if (!code) {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: 'https://journal.shefreynolds.com/api/auth',
      scope: 'repo',
    });
    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }

  try {
    const data = await exchangeCodeForToken(
      process.env.GITHUB_CLIENT_ID,
      process.env.GITHUB_CLIENT_SECRET,
      code
    );

    console.log('token exchange result:', data.access_token ? 'success' : JSON.stringify(data));

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
    console.error('auth error:', err.message);
    res.status(500).send('Server error: ' + err.message);
  }
};
