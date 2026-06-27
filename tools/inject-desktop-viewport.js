const fs = require("fs");
const path = require("path");

const INLINE = `<script id="agm-desktop-viewport">(function(){var W=1280,d=document,m=d.querySelector('meta[name="viewport"]');if(!m){m=d.createElement("meta");m.name="viewport";(d.head||d.documentElement).appendChild(m);}var sw=window.innerWidth||window.screen.width;if(sw<W){m.setAttribute("content","width="+W+",initial-scale="+(sw/W)+",viewport-fit=cover");}})();</script>`;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

let updated = 0;
for (const file of walk(".")) {
  let content;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (!content.includes("agm-mobile.css") || content.includes("agm-desktop-viewport")) {
    continue;
  }
  const next = content.replace(
    /<link rel="stylesheet" href="[^"]*agm-mobile\.css[^"]*">/,
    `${INLINE}\n$&`
  );
  if (next !== content) {
    fs.writeFileSync(file, next, "utf8");
    updated++;
    console.log(path.relative(".", file));
  }
}

console.log(`Added inline viewport script to ${updated} file(s).`);
