import { generateBlueprint } from "@/lib/blueprint/generation-service";
import { ideaInputSchema } from "@/lib/blueprint/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a valid JSON request body." }, { status: 400 });
  }

  const parsed = ideaInputSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "The product idea is not valid.";
    return Response.json({ error: message }, { status: 400 });
  }

  const result = await generateBlueprint(parsed.data);
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
