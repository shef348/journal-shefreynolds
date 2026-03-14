// OAuth proxy for Decap CMS - Step 1: redirect to GitHub
module.exports = function handler(req, res) {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: 'https://journal.shefreynolds.com/api/callback',
    scope: 'repo',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};
