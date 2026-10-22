# Polly Jireh Mane: Portfolio

A fast, dark-themed developer portfolio built with plain HTML, CSS and JavaScript. There is no build step, no dependencies and no backend, so it hosts for free.

## Why no framework?
Node.js isn't installed on this machine, and a five-section portfolio doesn't need React. Plain files load fast, are easy to edit, and deploy anywhere. If you later want React/Vite, the content and CSS carry over.

## Structure
```
index.html                  Home: hero, about, featured project, skills, services, process, contact
projects/scam-sense.html    Full Scam Sense case study with screenshot gallery
404.html                    Custom not-found page (GitHub Pages and Netlify use it automatically)
css/style.css               Design system (tokens at the top) and all styles
js/config.js                Contact links (email, GitHub, LinkedIn) and Scam Sense URLs
js/projects.js              Extra project cards: add an entry per new project
js/main.js                  Menu, scroll reveal, hero demo, gallery
assets/img/                 Screenshots (WebP) and the social preview image
```

## Fill in your details
Open `js/config.js`. The email is set to Pollymane11@gmail.com and GitHub to https://github.com/c23-2310-967-ops. Add `linkedin` if you have it. Any value left empty hides its button, so nothing on the site is ever a dead link. When a playable build exists, set `scamSenseDemo` and a "Play demo" button appears.

## Run locally
Double-click `index.html`, or serve the folder (recommended):
```bash
python -m http.server 8000
```
Then open http://localhost:8000.

## Deploy free with GitHub Pages
1. Create a new GitHub repository (for example `portfolio`). Use a different repo from Scam Sense.
2. In this folder run `git init`, `git add .`, `git commit -m "Initial portfolio"`, then add the remote and push.
3. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root → Save**.
4. After a minute the site is live at `https://<username>.github.io/<repo>/`.
   (Name the repo `<username>.github.io` to get the shorter `https://<username>.github.io/`.)
5. Social previews need an absolute image URL. Once you know your address, change `og:image` in the `<head>` of `index.html` and `projects/scam-sense.html` to `https://<your-address>/assets/img/og.jpg`, and add an `og:url` tag.

Netlify and Vercel also work: drag the folder in or connect the repo, with no build command and the root as the publish directory.

## Add a new project
1. Put a screenshot in `assets/img/` (WebP or JPG, about 1280 × 720).
2. Open `js/projects.js` and add an entry:
```js
{
  title: "Project name",
  description: "One or two sentences about what it does and who it's for.",
  tech: ["HTML", "CSS", "JavaScript"],
  role: "What you personally built.",
  image: "assets/img/my-project.webp",
  imageAlt: "Describe the screenshot",
  repo: "https://github.com/...",
  demo: ""   // leave empty to hide the demo link
}
```
The "More projects" section appears automatically once the list has an entry and stays hidden while it's empty. Only list projects you actually built.

## Custom domain
Optional. The free `github.io` address works fine. A domain costs money yearly, so only buy one if you want it.

## Performance and accessibility notes
Images are WebP and lazy-loaded, there are no web fonts or libraries, motion respects `prefers-reduced-motion`, and navigation works by keyboard with visible focus rings and a skip link.
