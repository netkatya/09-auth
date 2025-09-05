"use client";

import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "@/app/loading";
import { getUserProfile, updateUser } from "@/lib/api/clientApi";

export default function EditProfile() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await getUserProfile();
        setUsername(user.userName || "");
        setEmail(user.email);
      } catch (err) {
        console.error(err);
        setError("Unable to load a profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleSave() {
    try {
      await updateUser({ userName: username });
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Updating profile error");
    }
  }

  function handleCancel() {
    router.push("/profile");
  }

  if (loading) return <Loader />;

  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>

          <Image
            src="/img/emily.webp"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />

          <form className={css.profileInfo} action={handleSave}>
            <div className={css.usernameWrapper}>
              <label htmlFor="username">Username:</label>
              <input id="username" type="text" className={css.input} />
            </div>

            <p>Email: user_email@example.com</p>

            <div className={css.actions}>
              <button type="submit" className={css.saveButton}>
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
    </>
  );
}
