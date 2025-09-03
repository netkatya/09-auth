import { Metadata } from "next";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 | Page Not Found",
  description: "This page doesn'n exist",
  openGraph: {
    title: "404 | Page Not Found",
    description: "This page doesn'n exist",
    url: "https://08-zustand-ten-ochre.vercel.app/not-found",
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

export default function NotFound() {
  return (
    <>
      <div className={css.container}>
        <h1 className={css.error}>404</h1>
        <p className={css.message}>Oooops! Page not found</p>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </>
  );
}
