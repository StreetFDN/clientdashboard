"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Github } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { BACKEND_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.name}
          />
          <AvatarFallback>
            {user.user_metadata.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl">{user.user_metadata.name}</CardTitle>
          <CardDescription className="flex items-center gap-1 mt-1">
            <Badge className="p-1 rounded-full">
              <Github className="h-3 w-3" />
            </Badge>
            <p>@{user.user_metadata.user_name}</p>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
          {user.email_confirmed_at && (
            <Badge className="ml-auto text-xs">Verified</Badge>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(user.created_at)}</span>
          </div>
        </div>

        <div className="pt-2">
          <Badge variant="outline" className="capitalize">
            {user.app_metadata.provider}
          </Badge>
        </div>
        <Button onClick={checkBackendAuth}>Check BE Auth</Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

// Remove this in prod,this is only to test supabase connection on backend
const checkBackendAuth = async () => {
  const fetchResponse = await fetch(`${BACKEND_URL}/test-auth`, {
    credentials: "include",
  });
  const response = await fetchResponse.json();
  console.log("Response", response)
};
