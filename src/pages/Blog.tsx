import Layout from "@/components/layout/Layout";
import { Calendar, Clock } from "lucide-react";

const posts = [
  { title: "Como tomar Whey Protein da forma certa", excerpt: "Veja a hora certa, dose recomendada e dicas para maximizar resultados.", date: "20 Abr 2026", read: "5 min", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900" },
  { title: "Creatina: tudo o que você precisa saber", excerpt: "Benefícios, contraindicações e protocolo de saturação explicados.", date: "15 Abr 2026", read: "7 min", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900" },
  { title: "Pré-treino: vale mesmo a pena?", excerpt: "Quando usar, ingredientes-chave e como evitar dependência de cafeína.", date: "10 Abr 2026", read: "6 min", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900" },
];

const Blog = () => (
  <Layout>
    <section className="gradient-hero text-white py-16">
      <div className="container">
        <h1 className="font-display text-4xl md:text-5xl">Blog Aforja</h1>
        <p className="text-white/70 mt-2">Dicas, ciência e treinos para você evoluir.</p>
      </div>
    </section>
    <div className="container py-12 grid md:grid-cols-3 gap-6">
      {posts.map((p, i) => (
        <article key={i} className="bg-card border border-border rounded-2xl overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="aspect-video bg-muted overflow-hidden">
            <img src={p.img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5 space-y-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.read}</span>
            </div>
            <h3 className="font-bold text-lg leading-snug hover:text-primary transition-colors cursor-pointer">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.excerpt}</p>
          </div>
        </article>
      ))}
    </div>
  </Layout>
);

export default Blog;
