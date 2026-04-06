import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(".");
const pages = ["index.html", "about.html", "services.html"];

const activeMap = {
  "index.html": "homeActive",
  "about.html": "aboutActive",
  "services.html": "servicesActive",
};

const headerTemplate = readFileSync(resolve(root, "partials/header.html"), "utf8");
const footerOnly = readFileSync(resolve(root, "partials/footer.html"), "utf8");
const whatsappFloat = `<a href="https://wa.me/919922937307" class="whatsapp-float d-flex align-items-center justify-content-center" target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp" aria-label="Chat on WhatsApp"><i class="bi bi-whatsapp"></i></a>`;
const footerTemplate = `${footerOnly}\n${whatsappFloat}\n`;

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ameya Management Group",
  url: "https://www.ameyagroup.in/",
  logo: "https://www.ameyagroup.in/assets/img/logo.png",
  email: "admin@ameyaidt.com",
  telephone: "+91-9922937307",
  sameAs: [],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Ameya Management Group",
  image: "https://www.ameyagroup.in/assets/img/about.jpg",
  url: "https://www.ameyagroup.in/",
  telephone: "+91-9922937307",
  email: "admin@ameyaidt.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "514, Siddharth Towers – 1, 5th Floor, Late G. A. Kulkarni Road, Kothrud",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411038",
    addressCountry: "IN",
  },
  areaServed: "India",
  priceRange: "$$$",
};

const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  provider: {
    "@type": "Organization",
    name: "Ameya Management Group",
  },
  serviceType: "GST, SEZ, Indirect Tax, Corporate Compliance, and Project Management Consulting",
  areaServed: "India",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Consulting Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "GST Compliance Services" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "GST Refund Services" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEZ / STPI / EOU Advisory" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Indirect Tax Consulting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "ERP Tax Advisory (SAP / Oracle)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Legal and Litigation Support" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Project Management & Engineering Services" } },
    ],
  },
};

function renderHeader(activeKey) {
  const map = {
    homeActive: "",
    aboutActive: "",
    servicesActive: "",
  };
  map[activeKey] = 'class="active"';
  return Object.entries(map).reduce(
    (acc, [key, val]) => acc.replaceAll(`{{${key}}}`, val),
    headerTemplate,
  );
}

function schemaBlock(filename) {
  const base = [
    `<script type="application/ld+json" data-schema="organization">${JSON.stringify(orgSchema)}</script>`,
    `<script type="application/ld+json" data-schema="localbusiness">${JSON.stringify(localBusinessSchema)}</script>`,
  ];
  if (filename === "services.html" || filename === "index.html") {
    base.push(
      `<script type="application/ld+json" data-schema="service">${JSON.stringify(servicesSchema)}</script>`,
    );
  }
  return base.join("\n  ");
}

for (const page of pages) {
  const path = resolve(root, page);
  let html = readFileSync(path, "utf8");

  html = html.replace(/<header id="header"[\s\S]*?<\/header>/, renderHeader(activeMap[page]));
  html = html.replace(
    /<footer id="footer"[\s\S]*?<\/footer>(?:\s*<a[^>]*class="[^"]*whatsapp-float[^"]*"[^>]*>[\s\S]*?<\/a>\s*)*/,
    footerTemplate,
  );
  html = html.replace(/\n?\s*<script type="application\/ld\+json" data-schema="[^"]+">[\s\S]*?<\/script>/g, "");
  html = html.replace("</head>", `  ${schemaBlock(page)}\n</head>`);

  writeFileSync(path, html, "utf8");
}

console.log(`Built ${pages.length} pages with shared header/footer and schema.`);
