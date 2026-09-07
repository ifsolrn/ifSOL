"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { label: "Início", href: "/" },
  { label: "Núcleos", href: "/nucleos" },
  { label: "Editais", href: "/editais" },
  { label: "Artigos", href: "/artigos" },
  { label: "Galeria", href: "/galeria" },
  { label: "Notícias", href: "/noticias" },
  { label: "Sobre Nós", href: "/sobreNos" },
];

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="ifsol-navbar">
      <div className="ifsol-shell ifsol-navbar__content">
        <Sheet>
          <SheetTrigger asChild>
            <button className="ifsol-navbar__menu" aria-label="Abrir menu de navegação">
              <Menu aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            overlayClassName="bg-white/80"
            className="ifsol-mobile-menu w-[66vw] max-w-[460px] border-0 shadow-none"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            </SheetHeader>
            <span className="ifsol-mobile-menu__sun" aria-hidden="true" />
            <nav aria-label="Navegação móvel">
              {navigation.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link className={isActive(item.href) ? "is-active" : ""} href={item.href}>
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link className="ifsol-navbar__brand" href="/" aria-label="Página inicial da ifSOL">
          <Image src="/ifSOL/logo.svg" alt="ifSOL" width={130} height={88} priority />
        </Link>

        <nav className="ifsol-navbar__links" aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link className={isActive(item.href) ? "is-active" : ""} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
