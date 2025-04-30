import { createFileRoute, Link } from "@tanstack/react-router";

import { useSession, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data: session } = useSession();
  return (
    <div className="p-5 flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        {session && <Link to="/dashboard">Dashboard</Link>}
        {!session && (
          <Button onClick={() => signIn.social({ provider: "google" })}>
            Sign in with Google
          </Button>
        )}
      </div>
      {session && <p>Client signed in as {session.user.name}</p>}
    </div>
  );
}
