"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/mapa", label: "Mapa", icon: "map" },
  { href: "/reportes/nuevo", label: "Reportar", icon: "add_circle" },
  { href: "/reportes/mis-reportes", label: "Mis reportes", icon: "description" },
  { href: "/municipal", label: "Perfil", icon: "person" }
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    items.forEach((item) => router.prefetch(item.href));
  }, [router]);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-white/10 bg-[#0A0F1A]/90 px-xs pb-2 pt-xs shadow-[0_-14px_34px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const pending = pendingHref === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            onClick={() => {
              if (!active) setPendingHref(item.href);
            }}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition duration-200",
              active || pending ? "bg-white/[0.035] text-amber-300" : "text-slate-400 hover:bg-white/[0.025] hover:text-slate-100"
            )}
          >
            {active || pending ? <span className="absolute top-0 h-[3px] w-8 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.7)]" /> : null}
            <span className="material-symbols-outlined text-[22px] font-light">
              {pending ? "hourglass_top" : item.icon}
            </span>
            <span className="leading-tight">{pending ? "..." : item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
