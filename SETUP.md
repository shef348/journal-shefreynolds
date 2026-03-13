# Setting Up journal.shefreynolds.com

Three steps: GitHub → Vercel → DNS. About 15 minutes total.

---

## Step 1 — Push to GitHub

1. Go to [github.com](https://github.com) and sign in as **shef348**
2. Click **New repository** (+ icon, top right)
3. Name it `journal-shefreynolds`, set it to **Public**, click **Create**
4. Open Terminal on your Mac and run:

```bash
cd ~/Dropbox/journal-shefreynolds
git init
git add .
git commit -m "Initial journal setup"
git branch -M main
git remote add origin https://github.com/shef348/journal-shefreynolds.git
git push -u origin main
```

---

## Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (use your GitHub account)
2. Click **Add New → Project**
3. Import the `journal-shefreynolds` repo from GitHub
4. Vercel will auto-detect Hugo — just click **Deploy**
5. Your site will be live at a temporary `.vercel.app` URL in about 60 seconds

---

## Step 3 — Connect journal.shefreynolds.com

**In Vercel:**
1. Go to your project → **Settings → Domains**
2. Add `journal.shefreynolds.com`
3. Vercel will show you a CNAME value to add (something like `cname.vercel-dns.com`)

**In Squarespace (DNS settings):**
1. Go to your Squarespace account → **Domains → shefreynolds.com → DNS Settings**
2. Click **Add Record**
3. Type: **CNAME**
4. Host: `journal`
5. Value: paste the value from Vercel
6. Save — DNS can take up to 24 hours but usually propagates in minutes

---

## Writing New Posts

1. Write in iA Writer as you normally do
2. When ready to publish, save the file to:
   `~/Dropbox/journal-shefreynolds/content/posts/your-post-title.md`
3. Add this front matter at the top of the file:

```
---
title: "Your Post Title"
date: 2025-03-13
draft: false
---
```

4. Open Terminal and run:

```bash
cd ~/Dropbox/journal-shefreynolds
git add .
git commit -m "New post: your post title"
git push
```

Vercel will automatically rebuild and publish within about 30 seconds.

---

## Tips

- Set `draft: true` in the front matter to save a post without publishing it
- Images can go in `static/images/` and referenced in posts as `![alt](/images/photo.jpg)`
- Ask Claude to help polish a draft before you push it — just drop the file in the conversation
