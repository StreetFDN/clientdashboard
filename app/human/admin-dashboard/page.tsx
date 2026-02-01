import { getUser } from "@/lib/supabase/getUser";
import React from "react";
import ProfileCard from "./ProfileCard";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export default async function Page() {
  const { data, error } = await getUser();

  if (error) {
    return <div>No user</div>;
  }

  if (!data) {
    redirect("/auth/login");
  }
  return (
    <div className="w-full h-full px-8 py-4 flex items-center flex-col justify-center gap-4">
      <ProfileCard user={data.user} />
      <LogoutButton />
    </div>
  );
}
