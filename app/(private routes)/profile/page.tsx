import { Metadata } from "next";
import css from "./profilePage.module.css";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/user";
import { getUserProfile } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Note Hub. Your Profile",
  description: "Personal profile for making notes",
  openGraph: {
    title: "Note Hub. Your Profile",
    description: "Personal profile for making notes",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Note Hub Logo",
      },
    ],
  },
};

export default async function Profile() {
  let user: User | null = null;

  try {
    user = await getUserProfile();
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Please log in to see your profile.</p>
        <Link href="/sign-in">Go to Login</Link>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src="https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"
            alt="User Avatar"
            width={150}
            height={150}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username || "N/A"}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
