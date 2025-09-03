import { Metadata } from "next";
import css from "./profilePage.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Note Hub. Your Profile",
  description: "Personal profile for making notes",
  openGraph: {
    title: "Note Hub. Your Profile",
    description: "Personal profile for making notes",
    // url: "https://08-zustand-ten-ochre.vercel.app/",
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

export default function Profile() {
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
          <img
            src="Avatar"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: your_username</p>
          <p>Email: your_email@example.com</p>
        </div>
      </div>
    </main>
  );
}
