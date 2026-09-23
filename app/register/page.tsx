"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Semua field wajib diisi.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.user) {
      setError("Registrasi gagal.");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        name: name,
      });

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setSuccess("Registrasi berhasil!");
  }

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit">
          Register
        </button>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </form>
    </div>
  );
}