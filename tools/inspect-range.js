const fs = require("fs");

function allRangeIslands(file) {
  const h = fs.readFileSync(file, "utf8");
  const results = [];
  let searchFrom = 0;
  while (true) {
    const marker = "var newIslands = [";
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
    try {
      const islands = JSON.parse(h.slice(jsonStart, end));
      const range = islands.find((x) => x.id === "range");
      if (range) results.push(range);
    } catch (_) {}
    searchFrom = end;
  }
  return results;
}

for (const file of ["index.html", "en/index.html", "website-free.html"]) {
  const ranges = allRangeIslands(file);
  console.log("\n===", file, "count", ranges.length, "===");
  if (!ranges.length) continue;
  ranges[0].props.fieldValues.lines.slice(0, 4).forEach((line, i) => {
    console.log(i, JSON.stringify({ title: line.title, description: line.description }));
  });
}
