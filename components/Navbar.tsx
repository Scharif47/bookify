"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, UserButton, useClerk, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import React from "react";

const publicNavItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
  { label: "Pricing", href: "/subscriptions" },
];

const privateNavItems = [{ label: "My Books", href: "/your-books" }];

const Navbar = () => {
  const pathName = usePathname();
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navItems = [...publicNavItems, ...(user ? privateNavItems : [])];

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathName]);

  return (
    <header className={cn("w-full fixed z-50 transition-colors", scrolled || menuOpen ? "bg-(--bg-primary) border-b border-(--border-subtle)" : "bg-transparent border-none")}>
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image src="/assets/logo.png" alt="Bookify Logo" width={43} height={26} />
          <span className="logo-text">Bookify</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <nav className="w-fit flex gap-7.5 items-center">
            {navItems.map(({ label, href }) => {
              const isActive = pathName === href || (href !== "/" && pathName.startsWith(href));
              return (
                <Link href={href} key={label} className={cn("nav-link-base", isActive ? "nav-link-active" : "text-black hover:opacity-70")}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton><button className="cursor-pointer">Sign in</button></SignInButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <UserButton />
                {user?.firstName && (
                  <button onClick={() => openUserProfile()} className="nav-user-name cursor-pointer bg-transparent border-none p-0">
                    {user.firstName}
                  </button>
                )}
              </div>
            </Show>
          </div>
        </div>

        {/* Mobile right side */}
        <div className="flex sm:hidden items-center gap-3">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="cursor-pointer text-[#212a3b]"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden bg-(--bg-primary) border-t border-(--border-subtle) px-6 py-4 flex flex-col gap-4">
          {navItems.map(({ label, href }) => {
            const isActive = pathName === href || (href !== "/" && pathName.startsWith(href));
            return (
              <Link href={href} key={label} className={cn("nav-link-base text-lg", isActive ? "nav-link-active" : "text-black hover:opacity-70")} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-(--border-subtle)">
            <Show when="signed-out">
              <SignInButton><button className="cursor-pointer nav-link-base text-lg">Sign in</button></SignInButton>
            </Show>
            <Show when="signed-in">
              {user?.firstName && (
                <button onClick={() => { openUserProfile(); setMenuOpen(false); }} className="cursor-pointer nav-link-base text-lg bg-transparent border-none p-0">
                  {user.firstName}'s profile
                </button>
              )}
            </Show>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
