"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { getUserProfile, updateUser } from "@/lib/api/clientApi";
// import { User } from "@/types/user";
import Loader from "@/app/loading";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | undefined>("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (user) return;

    async function fetchProfile() {
      try {
        setLoading(true);
        const currentUser = await getUserProfile();
        setUsername(currentUser.userName);
        setEmail(currentUser.email);
        setUser(currentUser);
      } catch (err) {
        console.error(err);
        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, setUser]);

  const handleSave = async () => {
    try {
      const updatedUser = await updateUser({ username: username });

      setUser(updatedUser);

      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  function handleCancel() {
    router.push("/profile");
  }

  if (loading) return <Loader />;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src="/img/avatar.jpg"
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        {error && <p className={css.error}>{error}</p>}

        <form className={css.profileInfo} action={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
