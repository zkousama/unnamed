import { auth } from "@/lib/auth";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/name")({
  GET: async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    return json({ name: session.user?.name });
  },
});
