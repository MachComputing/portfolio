import React from "react";
import Image from "next/image";

export function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="gap-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {children}
    </div>
  );
}

export function GridItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-10 min-w-10 bg-white/50 rounded p-2">{children}</div>
  );
}

export function GridItemHeader({ children }: { children: React.ReactNode }) {
  return <h1 className="text-xl text-center">{children}</h1>;
}

export function GridItemDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function GridItemImage({ href, alt }: { href: string; alt: string }) {
  return (
    <div className="relative w-full h-32">
      <Image src={href} alt={alt} fill={true} />
    </div>
  );
}
