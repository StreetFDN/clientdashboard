import { Button } from "@/components/ui/button";
import { GITHUB_APP_NAME } from "@/lib/constants";
import Link from "next/link";
import React from "react";

export default function InstallationCreate() {
  return (
    <Link
      href={`https://github.com/apps/${GITHUB_APP_NAME}/installations/new`}
      target="_blank"
    >
      <Button variant={"link"}>Add Github App</Button>
    </Link>
  );
}
