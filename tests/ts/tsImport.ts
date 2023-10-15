// @ts-expect-error
import { helloWorld } from "./helloWorld.ts";

export function tsImport(): string {
  return helloWorld();
}
