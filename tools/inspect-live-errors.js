const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const news = [...html.matchAll(/hubfs\/146466316\/news[^"\\]+/g)].map((m) => m[0]);
console.log("news refs:", [...new Set(news)].join("\n"));

const p8 = path.join(ROOT, "en/p8.mp4");
if (fs.existsSync(p8)) {
  const head = fs.readFileSync(p8, "utf8", { encoding: "utf8", flag: "r" }).slice(0, 80);
  const stat = fs.statSync(p8);
  console.log("p8 size:", stat.size, "head:", JSON.stringify(head));
} else {
  console.log("p8 missing");
}

const mp4s = fs.readdirSync(path.join(ROOT, "en")).filter((f) => f.endsWith(".mp4"));
console.log("en mp4 files:", mp4s);
