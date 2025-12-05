import type { Metadata, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const heroImage = "/images/pc-land2.png";
import clsx from "clsx";
import { Card } from "@/components/Card";
import PillButton from "@/components/PillButton";
import Kline from "@/components/kline";

export const metadata: Metadata = {
  title: "Klariti OS",
  description:
    "Reklaim your time — Develop a healthy relationship with technology",
  openGraph: {
    title: "Klariti .ORG",
    description: "Develope a healthier relationship with technology",
    images: [
      {
        url: "public/images/pc-land2.png",
        width: 1200,
        height: 630,
        alt: "Klariti OS - Reklaim your time",
      },
    ],
  },
};



const HomePage: NextPage = () => {
  const jsonSchema = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Klariti OS",
      url: "https://klariti.org",
    },
  ]);
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonSchema,
          }}
        />
      </Head>
      <main className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage} // Using pc-land2 equivalent or similar high-quality landscape
            alt="Klariti Landscape"
            fill
            className="object-cover object-center opacity-90"
            priority
            quality={100}
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-white/60 dark:from-black/10 dark:via-black/20 dark:to-black/60 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pt-20 pb-32">
          {/* Brand / Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 font-sans mb-4">
              The new standard <br />
              <span className="font-serif italic font-light">in digital wellness</span>
            </h1>
          </div>

          {/* Subtitle / Description */}
          <div className="max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
              We&apos;re building a powerful suite of tools to empower our generation to enjoy the benefits of technology while fostering a <span className="italic font-serif">balanced, healthy relationship</span> with it.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <PillButton
              href="/join"
              className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get started
            </PillButton>
            <PillButton
              href="/manifesto"
              className="bg-white/50 backdrop-blur-sm text-gray-900 hover:bg-white/80 px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 border border-gray-200/50"
            >
              Read manifesto
            </PillButton>
          </div>

          {/* Optional: Photos Carousel below fold or integrated subtly */}
          {/* <div className="mt-20 opacity-80 hover:opacity-100 transition-opacity duration-500">
             <Photos />
          </div> */}
        </div>
      </main>
    </>
  );
};

export default HomePage;
