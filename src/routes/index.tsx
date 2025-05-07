import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { AuthTabs } from "@/components/AuthTabs";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data: session } = useSession();
  
  return (
    <div className="p-5 flex flex-col gap-4">
      {session ? (
        <div className="flex flex-col gap-2">
          <Link to="/dashboard" className="text-blue-500 hover:underline">
            Go to Dashboard
          </Link>
          <p>Signed in as {session.user.name}</p>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <AuthTabs />
        </div>
      )}
    </div>
  );
}