const fs = require("fs");
const path = require("path");

function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);

    if (s.isDirectory()) {
      scan(p);
    } else if (p.endsWith(".js") || p.endsWith(".jsx")) {
      const c = fs.readFileSync(p, "utf8");
      if (c.includes('import { use } from "react"') || c.includes("React5")) {
        console.log(p);
      }
    }
  }
}

scan("./src");
