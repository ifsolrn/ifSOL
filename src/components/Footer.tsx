import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

const links = [
  ["Artigos", "/artigos"],
  ["Galeria", "/galeria"],
  ["Sobre nós", "/sobreNos"],
  ["Notícias", "/noticias"],
  ["Editais", "/editais"],
];

export function Footer() {
  return (
    <footer className="ifsol-footer">
      <div className="ifsol-shell">
        <div className="ifsol-footer__top">
          <span className="ifsol-footer__name">IFsol</span>
          <div className="ifsol-footer__socials">
            <a href="mailto:ifsol@ifrn.edu.br" aria-label="Enviar e-mail para a ifSOL"><Mail /></a>
            <a href="https://www.instagram.com/ifrnzonaleste/" target="_blank" rel="noreferrer" aria-label="Instagram da ifSOL"><Instagram /></a>
          </div>
        </div>
        <div className="ifsol-footer__line" />
        <div className="ifsol-footer__links">
          <nav aria-label="Links do rodapé">
            {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <p className="ifsol-footer__credit">Equipe de desenvolvimento &lt;/&gt;</p>
      </div>
    </footer>
  );
}
