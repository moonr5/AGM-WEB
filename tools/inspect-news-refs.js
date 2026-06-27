const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const decoded = html.replace(/\\u002F/g, "/");
const hits = [...decoded.matchAll(/hubfs\/146466316\/[^"\\]+/g)].map((m) => m[0]);
const news = hits.filter((h) => h.includes("news"));
console.log("news paths:\n", [...new Set(news)].join("\n"));
console.log("\ntotal hubfs146 news count", news.length);
