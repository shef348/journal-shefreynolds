---
name: publish-journal
description: >
  Publishes a blog post to Shef's journal at journal.shefreynolds.com. Use this skill
  whenever the user says "publish this", "post this to my journal", "add this to the journal",
  "put this on my blog", or drops a markdown file and wants it live. Also trigger when the
  user shares writing and says anything like "this is ready" or "let's publish it". The skill
  handles formatting, front matter, saving to the right folder, and giving the user the exact
  push command to make it live.
---

# Publish Journal Post

Shef writes in iA Writer, stores drafts in Dropbox, and publishes to journal.shefreynolds.com
via Hugo + Vercel + GitHub. Your job is to take whatever they hand you — raw text, a markdown
file, a draft — and get it ready to publish with minimal friction.

## The journal location
Posts live at:
`~/Dropbox/journal-shefreynolds/content/posts/`

On the VM this is:
`/sessions/epic-youthful-wozniak/mnt/Dropbox/journal-shefreynolds/content/posts/`

## Step 1 — Get the content
The post might arrive as:
- Text pasted directly into the conversation
- A file path in Dropbox (e.g. from their iA Writer folder)
- A .md or .txt file attachment

Read it, understand it, don't change the voice. Shef writes in a casual, personal,
gear-curious style — short paragraphs, conversational. Light editing for typos or
clarity is fine, but don't rewrite.

## Step 2 — Build the front matter
Every post needs this at the top:

```
---
title: "The Post Title"
date: YYYY-MM-DD
draft: false
---
```

- If there's already a title in the content (e.g. a `# Header`), use that as the title and
  remove the duplicate header from the body.
- If no date is provided, use today's date.
- Set draft to false unless the user says they're not ready to publish.

## Step 3 — Generate a slug
Convert the title to a URL-friendly filename: lowercase, spaces to hyphens, remove
punctuation. Examples:
- "Boox Palma Review" → `boox-palma-review.md`
- "What I Eat" → `what-i-eat.md`
- "Why I Quit Being a Professional Photographer" → `why-i-quit-being-a-professional-photographer.md`

## Step 4 — Save the file
Write the complete post (front matter + body) to:
`/sessions/epic-youthful-wozniak/mnt/Dropbox/journal-shefreynolds/content/posts/<slug>.md`

## Step 5 — Handle images (if any)
If the post references images that are local files:
- Remind Shef to drop them in `~/Dropbox/journal-shefreynolds/static/images/`
- Reference them in the post as `![alt](/images/filename.ext)`
- If images are already hosted URLs (e.g. Squarespace CDN), embed them directly.

## Step 6 — Give the publish command
The git remote already has the token embedded. Tell the user to run this in Terminal:

```bash
cd ~/Dropbox/journal-shefreynolds
git add .
git commit -m "New post: <title>"
git push
```

Vercel will auto-deploy in ~30 seconds. The post will be live at:
`https://journal.shefreynolds.com/YYYY/MM/<slug>/`

## What good looks like
- Front matter is complete and correct
- Title is clean (no markdown symbols)
- Body reads like Shef wrote it — no over-editing
- File is saved to the right folder
- User gets a ready-to-run Terminal command
- If there are images, the user is reminded what to do with them
