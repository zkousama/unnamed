import { Button } from "@/components/ui/button";
import { useTRPC } from "@/integrations/trpc/react";
import { signOut } from "@/lib/auth-client";
import { getAvatar, getUserID } from "@/lib/auth-server-func";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const userID = await getUserID();
    return {
      userID,
    };
  },
  loader: async ({ context }) => {
    if (!context.userID) {
      throw redirect({ to: "/" });
    }
    return {
      userID: context.userID,
    };
  },
});

function RouteComponent() {
  const { userID } = Route.useLoaderData();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    getAvatar().then((avatar) => setAvatar(avatar ?? null));
  }, []);

  const {data: userName} = useQuery({
    queryKey: ["name"],
    queryFn: () => fetch("/api/name").then((res) => res.json()),
  })

  const trpc = useTRPC();
  const { data: userNameFromTRPC } = useQuery({
    ...trpc.people.currentUserName.queryOptions()
    });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>User ID: {userID}</p>

      <Button
        onClick={() => signOut({}, { onSuccess: () => navigate({ to: "/" }) })}
      >
        Sign out
      </Button>
      {avatar && <img src={avatar} alt="Avatar" className="w-40 h-40" />}
      {userName && <p>User Name: {JSON.stringify(userName)}</p>}
        {userNameFromTRPC && (
            <p>User Name from TRPC: {JSON.stringify(userNameFromTRPC)}</p>
        )}
    </div>
  );
}
