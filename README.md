# Takunda Chitambira Portfolio

A single-page creative developer portfolio built with React, TypeScript, Tailwind CSS, GSAP ScrollTrigger, and Lenis. It opens in a warm light theme with a charcoal portrait hero and restrained coral accents; visitors can switch to dark mode from the header.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; run Oxlint with `npm run lint`.

## Customize the content

All portfolio copy and content are in [`src/siteData.ts`](src/siteData.ts). Replace the name, role, location, email, social links, client names, services, projects, process steps, experience, awards, and sourced quotations there. Project entries include their title, year, description, services, tools, image URL, alt text, and color note. The React page components consume this object, so most personalisation does not require editing layout code.

Replace `portrait` with my portrait using a direct image URL or a file placed in `public/` (for example `/takunda-portrait.webp`). The current portrait is an editorial placeholder, not a likeness of me. Replace each `image` field with your own optimized project image. Keep descriptive alt text for meaningful images; the experience hover thumbnails are decorative and use empty alt text.

The display and body fonts are loaded in `index.html`; change those font links and the `--display` token near the top of `src/index.css` together if you choose different typefaces. Accent and surface colors are CSS variables in the same file.

## Motion and accessibility

GSAP and Lenis are disabled when `prefers-reduced-motion: reduce` is active. Project photos are lazy-loaded, while the hero portrait is prioritized. The contact form opens a prefilled email in the visitor's mail application; connect a form endpoint if you need server-side submissions.
