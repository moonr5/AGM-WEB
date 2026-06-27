const fs = require("fs");

function parseHeroIsland(file) {
  const h = fs.readFileSync(file, "utf8");
  const marker = 'var newIslands = [';
  let searchFrom = 0;
  while (true) {
    const start = h.indexOf(marker, searchFrom);
    if (start === -1) break;
    const jsonStart = start + marker.length - 1;
    let depth = 0;
    let end = jsonStart;
    for (let i = jsonStart; i < h.length; i++) {
      if (h[i] === "[") depth++;
      if (h[i] === "]") {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    const islands = JSON.parse(h.slice(jsonStart, end));
    const hero = islands.find((x) => x.id === "hero");
    if (hero) return hero.props.fieldValues;
    searchFrom = end;
  }
  return null;
}

const fields = parseHeroIsland("index.html");
const insp = fields.inspiration;

console.log("Hero inspiration slides:\n");
for (let n = 0; n <= 3; n++) {
  console.log(`Slide ${n + 1}:`);
  console.log(`  Title: ${insp[`title${n}`] || "(none)"}`);
  console.log(`  Video: ${insp[`background${n}`]?.href || "(none)"}`);
  console.log(`  Mobile video: ${insp[`background${n}mobile`]?.href || "(none)"}`);
  console.log("");
}

console.log("Manifest title:", fields.manifest?.title);
console.log("Manifest text:", fields.manifest?.text?.slice(0, 80));
