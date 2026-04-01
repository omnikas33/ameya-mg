Ameya Management Group website

Static build workflow:

1) Update shared layout partials:
- partials/header.html
- partials/footer.html

2) Update page content in:
- index.html, about.html, services.html, industries.html
- clients.html, blog.html, contact.html, help-desk.html

3) Rebuild all pages to sync shared header/footer and schema:
- node build.mjs

What the build script does:
- injects a shared header/footer into all 8 primary pages
- applies correct active navigation class per page
- adds JSON-LD schema blocks:
  - Organization (all pages)
  - LocalBusiness (all pages)
  - Service (index.html and services.html)
