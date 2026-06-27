const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FILES = ["index.html", "en/index.html"];

const REPLACEMENTS = [
  [
    "hubfs\\u002F146466316\\u002Fnews\\u002Fthird%20paradise\\u002FMassimo-Perotti-&-Michelangelo-Pistoletto-(1).jpg",
    "en/images/company-profile/vessel-charter.jpg",
  ],
  [
    "hubfs/146466316/news/third%20paradise/Massimo-Perotti-&-Michelangelo-Pistoletto-(1).jpg",
    "en/images/company-profile/vessel-charter.jpg",
  ],
  [
    "Michelangelo Pistoletto and the reinterpretation of Third Paradise",
    "AGM fleet expansion and new crewboat charter services",
  ],
  [
    "Massimo-Perotti-&-Michelangelo-Pistoletto-(1)",
    "AGM vessel charter",
  ],
  ["/en/about//", "/en/about/"],
  ["/en/sustainability//", "/en/sustainability/"],
  ["/en/contacts//", "/en/contacts/"],
  ["/en/services//", "/en/services/"],
  ["/en/#range//", "/en/#range"],
];

function fixFile(rel) {
  const file = path.join(ROOT, rel);
  let text = fs.readFileSync(file, "utf8");
  const original = text;

  for (const [from, to] of REPLACEMENTS) {
    text = text.split(from).join(to);
  }

  text = text.replace(
    /<script defer src="\/hs\/hsstatic\/content-cwv-embed\/static-1\.1293\/embed\.js"><\/script>\s*\r?\n/g,
    "",
  );

  if (text !== original) {
    fs.writeFileSync(file, text, "utf8");
    console.log("fixed:", rel);
  }
}

for (const rel of FILES) fixFile(rel);

console.log("Live error fixes applied.");
