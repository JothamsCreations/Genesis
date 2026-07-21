import { Codex } from "@openai/codex-sdk";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const BLOCKED_CREDENTIALS = new Set(["openai_api_key", "codex_api_key"]);
const EXPECTED_RESPONSE = "GENESIS_CODEX_SDK_OK";

export function buildCodexEnvironment(source = process.env) {
  return Object.fromEntries(
    Object.entries(source).filter(
      ([key, value]) => value !== undefined && !BLOCKED_CREDENTIALS.has(key.toLowerCase()),
    ),
  );
}

export async function verifyCodexSdk({
  workingDirectory = process.cwd(),
  timeoutMs = 120_000,
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  timeout.unref?.();

  try {
    const codex = new Codex({ env: buildCodexEnvironment() });
    const thread = codex.startThread({
      approvalPolicy: "never",
      networkAccessEnabled: false,
      sandboxMode: "read-only",
      skipGitRepoCheck: true,
      webSearchMode: "disabled",
      workingDirectory,
    });
    const result = await thread.run(
      `This is a connectivity verification only. Do not inspect or modify files, run commands, use tools, or access the network. Reply with exactly: ${EXPECTED_RESPONSE}`,
      { signal: controller.signal },
    );
    const response = result.finalResponse.trim();

    if (response !== EXPECTED_RESPONSE) {
      throw new Error(`Codex responded, but the verification token did not match. Received: ${response.slice(0, 160)}`);
    }

    return {
      itemCount: result.items.length,
      ok: true,
      response,
      threadIdPresent: Boolean(thread.id),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function redactError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/sk-(?:proj-)?[A-Za-z0-9_-]+/g, "[redacted]").slice(0, 1_000);
}

async function main() {
  console.log("Codex SDK verification: starting read-only ChatGPT-authenticated run");
  console.log("Platform API credentials: removed from the Codex child environment");

  try {
    const result = await verifyCodexSdk();
    console.log(`Codex SDK verification: PASS (${result.response})`);
    console.log(`Thread created: ${result.threadIdPresent ? "yes" : "no"}; completed items: ${result.itemCount}`);
  } catch (error) {
    console.error(`Codex SDK verification: FAIL\n${redactError(error)}`);
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) await main();
