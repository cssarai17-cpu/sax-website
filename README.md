# S.A.X GitHub Website

This is a GitHub Pages-ready website for S.A.X, built from the warm cream/brown rebrand direction.

## Edit The Site

- Main copy, collections, products, pages, blog posts, and testimonials live in `assets/js/content.js`.
- Visual styling lives in `assets/css/styles.css`.
- Page layout and app shell live in `index.html`.

## Run Locally

Open `index.html` directly, or start a small local server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Publish On GitHub Pages

1. Create a new GitHub repository.
2. Upload this folder’s files.
3. In GitHub, go to `Settings > Pages`.
4. Choose `Deploy from a branch`.
5. Select the `main` branch and `/root`.

The site uses hash-based URLs, so it works cleanly on GitHub Pages without a build system.
