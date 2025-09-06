"use client";

import css from "./SignInPage.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/types/auth";
import { loginClient } from "@/lib/api/clientApi";
import { AxiosError } from "axios";
import { useAuthStore } from "@/lib/store/authStore";

type ApiError = AxiosError<{ error: string }>;

export default function SignIn() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as LoginRequest;
      const res = await loginClient(formValues);
      if (res) {
        setUser(res);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Oops... some error"
      );
    }
  };
  return (
    <>
      <main className={css.mainContent}>
        <form className={css.form} action={handleSubmit}>
          <h1 className={css.formTitle}>Sign in</h1>

          <div className={css.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className={css.input}
              required
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={css.input}
              required
            />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.submitButton}>
              Log in
            </button>
          </div>

          <p className={css.error}>{error}</p>
        </form>
      </main>
    </>
  );
}
