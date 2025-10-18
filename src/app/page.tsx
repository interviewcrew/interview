"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { data: session } = authClient.useSession();
  const onSubmit = () => {
    console.log(email, name);

    authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onError: () => {
          alert("something went wrong");
        },
        onSuccess: () => {
          alert("success sign up");
        },
      }
    );
  };

  if (session) {
    return (
      <div className="flex flex-col gap-y-4 p-4">
        <p>Logged in as {session.user.email}</p>
        <Button onClick={() => authClient.signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-4">
      <Input
        placeholder="insert name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="insert email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="insert password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit}>Sign up</Button>
    </div>
  );
}
