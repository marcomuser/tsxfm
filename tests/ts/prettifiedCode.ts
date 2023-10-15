import * as prettier from "prettier";
import { codeToFormat } from "./codeToFormat.js";

export async function prettifiedCode(): Promise<string> {
  const formatted = await prettier.format(codeToFormat(), {
    parser: "typescript",
  });
  return formatted;
}
