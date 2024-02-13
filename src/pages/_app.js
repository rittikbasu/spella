import "@/styles/globals.css";
import { Josefin_Sans, Work_Sans } from "next/font/google";

const josefinSans = Josefin_Sans({
  weights: [400, 600, 700],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-josefin",
});

const workSans = Work_Sans({
  weights: [400, 600, 700],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export default function App({ Component, pageProps }) {
  return (
    <div
      className={`${josefinSans.variable} ${workSans.className} antialiased`}
    >
      <div className="min-h-screen fixed inset-0 -z-10 w-full bg-gray-100 bg-dot-gray-500/[0.2] flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <Component {...pageProps} />
    </div>
  );
}
