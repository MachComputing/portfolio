import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="gap-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {children}
    </div>
  );
}

export function GridItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <div className="min-h-10 min-w-10 bg-gray-300/60 hover:bg-white/70 rounded p-2">
      <Link href={href}>{children}</Link>
    </div>
  );
}

export function GridItemHeader({ children }: { children: React.ReactNode }) {
  return <h1 className="text-xl font-bold text-center">{children}</h1>;
}

export function GridItemDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-2">{children}</div>;
}

export function GridItemImage({ href, alt }: { href: string; alt: string }) {
  return (
    <div className="relative w-full h-32 overflow-hidden">
      <Image src={href} alt={alt} width={1024} height={1024} />
    </div>
  );
}
