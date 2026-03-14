// OAuth proxy for Decap CMS GitHub authentication
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    // Step 1: redirect to GitHub OAuth
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: `https://journal.shefreynolds.com/api/auth`,
      scope: 'repo',
    });
    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }

  // Step 2: exchange code for token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    // Send token back to Decap CMS via postMessage
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
    res.status(401).send('Authentication failed');
  }
}
