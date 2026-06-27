const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT || 8080);
const ROOT = path.resolve(__dirname);
const GREEN_FALLBACK_IMAGE = path.join(ROOT, "hubfs", "placeholder-green.svg");
const PURPLE_FALLBACK_IMAGES = {
  landscape: path.join(ROOT, "en", "images", "fallback-purple", "purple-landscape.jpg"),
  portrait: path.join(ROOT, "en", "images", "fallback-purple", "purple-portrait.jpg"),
  square: path.join(ROOT, "en", "images", "fallback-purple", "purple-square.jpg"),
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf"
};

function isInsideRoot(candidate) {
  const relative = path.relative(ROOT, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function existsFile(candidate) {
  try {
    return fs.statSync(candidate).isFile();
  } catch {
    return false;
  }
}

function isBackgroundAsset(pathname) {
  const value = (pathname || "").toLowerCase();
  return [
    "background",
    "hero",
    "banner",
    "voyaging_draft",
    "coasting_draft",
    "pioneering_draft",
    "loader-",
    "_loader",
  ].some((token) => value.includes(token));
}

function pickPurpleFallback(pathname) {
  const value = (pathname || "").toLowerCase();

  if (/(portrait|person|people|crew|vertical|mobile)/.test(value)) {
    return PURPLE_FALLBACK_IMAGES.portrait;
  }
  if (/(thumb|square|tile|card)/.test(value)) {
    return PURPLE_FALLBACK_IMAGES.square;
  }
  return PURPLE_FALLBACK_IMAGES.landscape;
}

const AGM_MOBILE_SNIPPET = [
  '<link rel="stylesheet" href="/hubfs/raw_assets/homepage/179/js_client_assets/assets/agm-mobile.css?v=2">',
  '<script defer src="/hubfs/raw_assets/homepage/179/js_client_assets/assets/agm-mobile.js?v=2"></script>',
].join("\n");

function injectMobileAssets(html) {
  if (!html.includes("</head>") || html.includes("agm-mobile.css")) {
    return html;
  }
  return html.replace("</head>", `${AGM_MOBILE_SNIPPET}\n</head>`);
}

function localizeText(text) {
  return injectMobileAssets(
    text
    .replaceAll("https://www.sanlorenzoyacht.com/hubfs/", "/hubfs/")
    .replaceAll("https://www.sanlorenzoyacht.com/hs/", "/hs/")
    .replaceAll("https://www.sanlorenzoyacht.com/en/", "/en/")
    .replaceAll("https://www.sanlorenzoyacht.com/it/", "/it/")
    .replaceAll("https://www.sanlorenzoyacht.com/", "/")
    .replaceAll("https://146466316.fs1.hubspotusercontent-eu1.net/hubfs/", "/hubfs/")
    .replaceAll("//146466316.fs1.hubspotusercontent-eu1.net/hubfs/", "/hubfs/")
    .replaceAll("http://localhost:8080/", "/")
    .replaceAll("https://localhost:8080/", "/")
    .replaceAll("https://www.preowned.localhost:8080/en/", "/en/")
    .replaceAll("https://www.preowned.localhost:8080/it/", "/it/")
    .replaceAll("https://media.localhost:8080/dam/", "#")
    .replaceAll("https://she.localhost:8080?hsLang=en", "/en/our-fleet/she")
    .replaceAll('href=""', 'data-removed-empty-href=""')
    .replaceAll("https:\\u002F\\u002Fwww.sanlorenzoyacht.com\\u002Fhubfs\\u002F", "\\u002Fhubfs\\u002F")
    .replaceAll("https:\\u002F\\u002Fwww.sanlorenzoyacht.com\\u002Fhs\\u002F", "\\u002Fhs\\u002F")
    .replaceAll("https:\\u002F\\u002Fwww.sanlorenzoyacht.com\\u002Fen\\u002F", "\\u002Fen\\u002F")
    .replaceAll("https:\\u002F\\u002Fwww.sanlorenzoyacht.com\\u002Fit\\u002F", "\\u002Fit\\u002F")
    .replaceAll("https:\\u002F\\u002F146466316.fs1.hubspotusercontent-eu1.net\\u002Fhubfs\\u002F", "\\u002Fhubfs\\u002F")
    .replaceAll("http:\\u002F\\u002Flocalhost:8080\\u002F", "\\u002F")
    .replaceAll("https:\\u002F\\u002Flocalhost:8080\\u002F", "\\u002F")
    .replaceAll("https:\\u002F\\u002Flocalhost:8080/", "\\u002F")
    .replaceAll("https:\\/\\/localhost:8080\\/", "\\/")
    .replaceAll("https:\\/\\/www.sanlorenzoyacht.com\\/hubfs\\/", "\\/hubfs\\/")
    .replaceAll("https:\\/\\/www.sanlorenzoyacht.com\\/hs\\/", "\\/hs\\/")
    .replaceAll("https:\\/\\/146466316.fs1.hubspotusercontent-eu1.net\\/hubfs\\/", "\\/hubfs\\/")
  );
}

function resolveRequest(url) {
  const parsed = new URL(url, `http://localhost:${PORT}`);
  let pathname = parsed.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep original pathname when malformed encoding is present.
  }

  if (pathname === "/brand-representative") {
    pathname = "/en/brand-representative";
  }

  const candidates = [];
  if (pathname === "/") {
    candidates.push("en/index.html");
  } else {
    const clean = pathname.replace(/^\/+/, "");
    candidates.push(clean);
    candidates.push(path.join(clean, "index.html"));

    const parts = clean.split("/");
    while (parts.length > 1) {
      parts.pop();
      candidates.push(parts.join("/"));
    }
  }

  for (const candidate of candidates) {
    const absolute = path.join(ROOT, candidate);
    if (isInsideRoot(absolute) && existsFile(absolute)) {
      return absolute;
    }
  }

  return null;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    const sample = fs.readFileSync(filePath, "utf8").slice(0, 128).trimStart().toLowerCase();
    if (sample.startsWith("<!doctype") || sample.startsWith("<html")) return MIME[".html"];
  } catch {
    // Binary files fall through to extension-based MIME.
  }

  if (ext) return MIME[ext] || "application/octet-stream";

  const relative = path.relative(ROOT, filePath).replaceAll("\\", "/");
  if (relative.startsWith("en/") || relative === "brand-representative") {
    return MIME[".html"];
  }
  return "application/octet-stream";
}

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  // Intercept HubSpot dealer API — return single placeholder to suppress error
  if (req.url === "/api/dealers") {
    return send(res, 200, '{"results":[{"id":"placeholder","values":{"name":"","latitude":0,"longitude":0,"office":"","office_address":"","phone_number":"","email":""}}]}', MIME[".json"]);
  }

  const parsedUrl = new URL(req.url || "/", `http://localhost:${PORT}`);
  let pathname = parsedUrl.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep original pathname when malformed encoding is present.
  }
  const filePath = resolveRequest(req.url || "/");

  if (!filePath) {
    const ext = path.extname(pathname).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext)) {
      // Keep background placeholders as originally styled.
      if ((ext === ".svg" || isBackgroundAsset(pathname)) && existsFile(GREEN_FALLBACK_IMAGE)) {
        return send(res, 200, fs.readFileSync(GREEN_FALLBACK_IMAGE), MIME[".svg"]);
      }

      const purpleFallback = pickPurpleFallback(pathname);
      if (existsFile(purpleFallback)) {
        return send(res, 200, fs.readFileSync(purpleFallback), MIME[".jpg"]);
      }

      if (existsFile(GREEN_FALLBACK_IMAGE)) {
        return send(res, 200, fs.readFileSync(GREEN_FALLBACK_IMAGE), MIME[".svg"]);
      }
    }
    if (ext === ".css") return send(res, 200, "", MIME[".css"]);
    if ([".js", ".mjs"].includes(ext)) return send(res, 200, "", MIME[".js"]);
    return send(res, 404, "Not found", "text/plain; charset=utf-8");
  }

  const type = contentType(filePath);
  const raw = fs.readFileSync(filePath);

  if (type.startsWith("text/html") || type.startsWith("text/css") || type.startsWith("application/javascript")) {
    return send(res, 200, localizeText(raw.toString("utf8")), type);
  }

  send(res, 200, raw, type);
});

server.listen(PORT, () => {
  console.log(`AGM local site running at http://localhost:${PORT}/`);
  console.log(`Serving ${ROOT}`);
});
