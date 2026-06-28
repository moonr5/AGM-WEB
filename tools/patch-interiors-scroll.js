const fs = require("fs");
const path =
  "hubfs/146466316/raw_assets/homepage/179/js_client_assets/assets/island-DwW7ueMe.js";

let content = fs.readFileSync(path, "utf8");
if (content.charCodeAt(0) === 0xfeff) {
  content = content.slice(1);
}

const oldDelay = "St.to({},{duration:.5})},5e3))},[Ce])";
const newDelay = "St.to({},{duration:.5})},0))},[Ce])";

if (!content.includes(oldDelay)) {
  console.error("delay target not found");
  process.exit(1);
}

content = content.replace(oldDelay, newDelay);
fs.writeFileSync(path, content, "utf8");

console.log("patched interiors delay 5s -> 0ms, removed BOM");
