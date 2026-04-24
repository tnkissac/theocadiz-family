# The Ocadiz Family Website

A personal family website built with plain HTML, CSS, and vanilla JavaScript. No build tools, no frameworks, no install step — just open `index.html` in a browser and it works.

---

## Testing Locally

No server required.

- **Mac:** Double-click `index.html`, or run `open index.html` in Terminal
- **Windows:** Double-click `index.html`, or drag it into Chrome/Edge/Firefox
- **VS Code:** Right-click `index.html` → "Open with Live Server" (requires the Live Server extension)

> Google Fonts (Inter) loads from the internet. If you're offline, the site falls back to your system sans-serif — layout is unaffected.

---

## Adding Your Photos

See [`images/README.md`](images/README.md) for the full list of filenames, recommended sizes, and compression tips.

---

## Deploying to GitHub Pages

Follow these steps to get your site live at `https://[username].github.io/family-site/`.

### Step 1 — Create the GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name the repository `family-site`
3. Set it to **Public**
4. **Do not** initialize with a README (you already have one)
5. Click **Create repository**

### Step 2 — Initialize git and push from your terminal

Open Terminal, navigate to this folder, then run these commands one at a time:

```
git init
git add .
git commit -m "Initial family site"
git branch -M main
git remote add origin https://github.com/[username]/family-site.git
git push -u origin main
```

Replace `[username]` with your actual GitHub username.

### Step 3 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (the gear icon in the top nav)
3. In the left sidebar, scroll down and click **Pages**
4. Under **Source**, choose **Deploy from a branch**
5. Set **Branch** to `main` and **Folder** to `/ (root)`
6. Click **Save**

### Step 4 — Wait about a minute

GitHub will build and deploy automatically. Then visit:

```
https://[username].github.io/family-site/
```

Your family site is live.

---

## Updating the Site Later

Whenever you make changes (new photos, edited text, etc.):

```
git add .
git commit -m "Update photos"
git push
```

GitHub Pages redeploys automatically within about 60 seconds.

---

## File Structure

```
family-site/
├── index.html              Main site (single page)
├── styles.css              All styling
├── script.js               Scroll fade-in animations
├── images/
│   ├── README.md           Photo guide (sizes & filenames)
│   ├── luis.jpg            Add your photos here
│   ├── reyna.jpg
│   ├── abel.jpg
│   ├── baby-a.jpg
│   ├── gallery-1.jpg
│   └── ...gallery-9.jpg
└── README.md               This file
```
