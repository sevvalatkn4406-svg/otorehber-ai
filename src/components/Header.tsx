"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/araclar", label: "Araçlar" },
  { href: "/karsilastir", label: "Karşılaştır" },
  { href: "/asistan", label: "AI Asistan" },
  { href: "/bakim", label: "Bakım" },
  { href: "/hakkinda", label: "Hakkında" },
];

export function Header() {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const isOpen = openPath === pathname;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);
  const toggleMenu = () => setOpenPath((prev) => prev === pathname ? null : pathname);
  const closeMenu = () => setOpenPath(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-none md:backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 group focus-visible:rounded-lg"
          >
            {/* Custom automotive SVG logo */}
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary transition-transform group-hover:scale-105">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Sleek sports car front grill / aerodynamic headlights */}
                <path d="M3 13 L5 7 C6 5.5 8 5 12 5 C16 5 18 5.5 19 7 L21 13" />
                <path d="M2 13 C2 12.5 3 12 5 12 L19 12 C21 12 22 12.5 22 13 L21 17 C20 18.5 18 19 12 19 C6 19 4 18.5 3 17 Z" />
                <circle cx="6.5" cy="15.5" r="1.5" fill="currentColor" />
                <circle cx="17.5" cy="15.5" r="1.5" fill="currentColor" />
                <path d="M10 15.5 L14 15.5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-main leading-tight flex items-center gap-1">
                OtoRehber
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-primary text-white tracking-wider">
                  AI
                </span>
              </span>
              <span className="text-[10px] text-muted tracking-wide uppercase font-medium">
                Akıllı Araç Rehberi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Ana Menü"
            className="hidden md:flex items-center gap-0 lg:gap-2"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-1.5 lg:px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-muted hover:text-main hover:bg-surface-elevated"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block"><ThemeToggle /></div>

            {/* Mobile menu hamburger button */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label={isOpen ? "Menüyü Kapat" : "Menüyü Aç"}
              className="md:hidden min-h-11 min-w-11 p-2 rounded-lg text-muted hover:text-main hover:bg-surface-elevated border border-border transition-colors"
            >
              {isOpen ? (
                // Close X icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div id="mobile-navigation" className={`${isOpen ? "block" : "hidden"} md:hidden fixed inset-x-0 top-16 bottom-0 z-50`}>
          <button type="button" tabIndex={-1} aria-label="Menüyü kapat" onClick={closeMenu} className="absolute inset-0 w-full bg-black/40" />
          <nav
            aria-label="Mobil Menü"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full bg-surface border-b border-border shadow-xl px-4 py-4 flex flex-col gap-1 max-h-[calc(100dvh-4rem)] overflow-y-auto"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`min-h-11 flex items-center px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-muted hover:text-main hover:bg-surface-elevated"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-border mt-2 pt-3"><ThemeToggle /></div>
          </nav>
        </div>
      </div>
    </header>
  );
}
