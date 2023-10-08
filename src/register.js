import process from "node:process";
import { register } from "node:module";

if ("setSourceMapsEnabled" in process) {
  process.setSourceMapsEnabled(true);
}

register("./hooks.js", import.meta.url);
