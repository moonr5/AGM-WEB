const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const ENCODING_FIXES = [
  ["Ã‚©", "©"],
  ["Ã¢â‚¬Â©", "©"],
  ["Ã¢â‚¬â„¢", "'"],
  ["Ã¢â‚¬Ëœ", "'"],
  ["Ã¢â‚¬Å“", '"'],
  ["Ã¢â‚¬\u009d", '"'],
  ["Ã¢â‚¬â€œ", "–"],
  ["Ã¢â‚¬â€", "—"],
  ["Ã¢â‚¬Âº", "›"],
  ["Ã¢â‚¬\"", " - "],
  ["Ã¢â‚¬Â", ""],
  ["â€”", "—"],
  ["â€“", "–"],
  ["â€¢", "•"],
  ["â€˜", "'"],
  ["â€™", "'"],
  ["â€œ", '"'],
  ["Â©", "©"],
  ["Âº", "º"],
];

const TEXT_FIXES = [
  ['language: "it"', 'language: "en"'],
  ["/* rimuove la freccina */", "/* hide popup arrow */"],
  ["// mostra solo quella attiva", "// show only the active appbar"],
  ["// rimuove tutte le altre", "// remove duplicate appbars"],
  ["welcome@localhost:8080", "ardi.2772@gmail.com"],
  ["http://localhost:8080", "https://agmaritim.com"],
  ["Gianfranco Cecchi", "AGM Leadership"],
  ["Giuliano Pecchia", "AGM Operations"],
  ["Sede principale Agara Global Maritim", "PT. Agara Global Maritim Headquarters"],
  ["Sede Centrale", "Marunda Shipyard"],
  ["Cantiere", "Shipyard"],
  ["Via Armezzone, 3, Ameglia (SP)", "Marunda, North Jakarta"],
  ["Via Armezzone, 3", "Marunda, North Jakarta"],
  ["Via Luigi Salvatori, 56/58", "Marunda, North Jakarta"],
  ["Viale San Bartolomeo 362", "Marunda, North Jakarta"],
  ["Ameglia, La Spezia", "North Jakarta"],
  ["Viareggio", "North Jakarta"],
  ["La Spezia", "North Jakarta"],
  ['"addressRegion": "SP"', '"addressRegion": "Jakarta"'],
  ['"addressRegion": "LU"', '"addressRegion": "Jakarta"'],
  ['"postalCode": "19031"', '"postalCode": "14130"'],
  ['"postalCode": "55049"', '"postalCode": "14130"'],
  ['"postalCode": "19100"', '"postalCode": "14130"'],
  ['"addressCountry": "Italy"', '"addressCountry": "Indonesia"'],
  ['"address": "Firenze"', '"address": "Jakarta, Indonesia"'],
  ["+39 01876181", "+62 813-5439-6700"],
  ["+39 058438071", "+62 813-5439-6700"],
  ["+39 0187545700", "+62 813-5439-6700"],
  [
    '"description": "Agara Global Maritim builds made to measure Boats since 1958."',
    '"description": "PT. Agara Global Maritim provides vessel charter, FRP shipbuilding, and marine support services in Indonesia."',
  ],
  ['"foundingDate": "1958"', '"foundingDate": "2020"'],
  ["https://it.wikipedia.org/", ""],
  ["https://www.teleborsa.it/", ""],
  ["https://www.wikidata.org/", ""],
  ["office_it", "office"],
];

const SCHEMA = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PT. Agara Global Maritim",
    "description": "Indonesian marine services company specializing in vessel charter, FRP shipbuilding, and marine support.",
    "legalName": "PT. Agara Global Maritim",
    "url": "https://agmaritim.com",
    "logo": "/en/p61.svg",
    "foundingDate": "2020",
    "foundingLocation": {
      "@type": "Place",
      "address": "Jakarta, Indonesia"
    },
    "location": [
      {
        "@type": "Place",
        "name": "Marunda Shipyard",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Marunda, North Jakarta",
          "postalCode": "14130",
          "addressLocality": "North Jakarta",
          "addressRegion": "Jakarta",
          "addressCountry": "Indonesia"
        }
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+62 813-5439-6700",
        "email": "ardi.2772@gmail.com",
        "contactType": "customer service",
        "availableLanguage": "English"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/agaraglobalmaritim/",
      "https://www.instagram.com/agaraglobalmaritim/",
      "https://www.linkedin.com/company/agaraglobalmaritim/",
      "https://www.youtube.com/@agaraglobalmaritim"
    ]
  }
</script>`;

function applyFixes(text) {
  let next = text;
  for (const [from, to] of ENCODING_FIXES) next = next.split(from).join(to);
  for (const [from, to] of TEXT_FIXES) next = next.split(from).join(to);
  next = next.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, SCHEMA);
  next = next.replace(/,\s*,/g, ",").replace(/\[\s*,/g, "[").replace(/,\s*\]/g, "]");
  return next;
}

const targets = [
  "index.html",
  "en/index.html",
  "hubfs/146466316/raw_assets/homepage/179/js_client_assets/assets/island-DwW7ueMe.js",
  "en/about/index.html",
  "en/services/index.html",
  "en/contacts/index.html",
  "en/sustainability/index.html",
  "en/privacy-policy",
];

for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, "utf8");
  const next = applyFixes(original);
  if (next !== original) {
    fs.writeFileSync(file, next, "utf8");
    console.log("fixed:", rel);
  }
}

console.log("Encoding and English cleanup complete.");
