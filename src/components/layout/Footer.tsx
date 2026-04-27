import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const Footer = () => {
  const { categories } = useCategories();

  return (
  <footer className="bg-secondary text-secondary-foreground mt-20">
    <div className="container py-14 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
              <path d="M12 8v8M8 10l4-2 4 2" />
            </svg>
          </div>
          <div>
            <div className="font-display text-xl tracking-wider">AFORJA</div>
            <div className="text-[9px] tracking-[0.2em] text-primary-glow font-semibold -mt-0.5">SUPLEMENTOS</div>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          Os melhores suplementos para forjar o atleta dentro de você. Qualidade, performance e entrega expressa.
        </p>
        <div className="flex gap-3 mt-5">
          {[
            { Icon: Instagram, href: "https://www.instagram.com/aforjasuplementos/" },
            { Icon: Facebook, href: "https://www.facebook.com/people/A-FORJA-Suplementos/61583735893021/" },
            { Icon: Youtube, href: "#" },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:gradient-primary border border-white/10 flex items-center justify-center transition-all hover:scale-110"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4 text-primary-glow">Categorias</h4>
        <ul className="space-y-2 text-sm text-white/70">
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/categoria?cat=${encodeURIComponent(category.name)}`} className="hover:text-white transition-colors">
                {category.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/combos" className="hover:text-white transition-colors">
              Combos
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4 text-primary-glow">Atendimento</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-center gap-2">
            <Phone className="w-4 h-4" /> (11) 99999-9999
          </li>
          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> contato@aforja.com
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> São Paulo, SP
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4 text-primary-glow">Newsletter</h4>
        <p className="text-sm text-white/60 mb-3">Receba ofertas exclusivas e cupons.</p>
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="seu@email.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 h-10 text-sm outline-none focus:border-primary-glow"
          />
          <button className="px-4 h-10 gradient-primary rounded-lg text-sm font-semibold hover:shadow-glow transition-all">
            OK
          </button>
        </form>
      </div>
    </div>
    <div className="border-t border-white/5">
      <div className="container py-5 text-xs text-white/40 flex flex-wrap items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Aforja Suplementos. Todos os direitos reservados.</span>
        <span>CNPJ 00.000.000/0001-00</span>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
