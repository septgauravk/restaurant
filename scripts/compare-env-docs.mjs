import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const code = execFileSync("grep", ["-RhoE", "process\\.env\\.[A-Z0-9_]+|import\\.meta\\.env\\.[A-Z0-9_]+", "client", "server", "api"], { encoding: "utf8" });
const codeVars = new Set(code.split(/\s+/).filter(Boolean).map((value) => value.replace(/^.*env\./, "")));
const docs = readFileSync("ENVIRONMENT_SETUP.md", "utf8");
const docVars = new Set((docs.match(/`[A-Z][A-Z0-9_]+`/g) ?? []).map((value) => value.slice(1, -1)));
const missing = [...codeVars].filter((value) => !docVars.has(value));
const platformManaged = new Set(["OWNER_NAME", "VITE_ANALYTICS_ENDPOINT", "VITE_ANALYTICS_WEBSITE_ID", "VITE_APP_TITLE", "VITE_APP_LOGO"]);
const unexpected = [...docVars].filter((value) => !codeVars.has(value) && !platformManaged.has(value));
console.log(JSON.stringify({ code: [...codeVars].sort(), documented: [...docVars].sort(), missing, unexpected }, null, 2));
if (missing.length || unexpected.length) process.exit(1);
