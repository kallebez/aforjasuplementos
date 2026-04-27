import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/types";
import { useCategories } from "@/hooks/useCategories";
import { Plus, Edit, Trash2, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FormData = Partial<Product> & { tagsInput?: string };

const empty: FormData = {
  name: "",
  brand: "AFORJA",
  description: "",
  category: "Whey Protein",
  price: 0,
  old_price: null,
  image_url: "",
  badge: "",
  tags: [],
  stock: 100,
  active: true,
  rating: 5,
  rating_count: 0,
  tagsInput: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { categories } = useCategories();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (p: Product) => {
    setForm({ ...p, tagsInput: (p.tags ?? []).join(", ") });
    setOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: pub.publicUrl }));
      toast.success("Imagem enviada");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        image_url: form.image_url,
        badge: form.badge,
        tags: (form.tagsInput ?? "").split(",").map((t) => t.trim()).filter(Boolean),
        stock: Number(form.stock ?? 0),
        rating: Number(form.rating ?? 5),
        rating_count: Number(form.rating_count ?? 0),
        active: form.active ?? true,
      };
      if (form.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", form.id);
        if (error) throw error;
        toast.success("Produto atualizado");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Produto criado");
      }
      setOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produto removido");
    load();
  };

  const toggleActive = async (p: Product) => {
    await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Produtos</h1>
          <p className="text-muted-foreground">{products.length} produto(s) no catálogo</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 gradient-primary text-white px-5 h-11 rounded-xl font-semibold shadow-glow hover:shadow-intense transition-all">
          <Plus className="w-4 h-4" /> Novo produto
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4">Produto</th>
                <th className="text-left p-4">Categoria</th>
                <th className="text-left p-4">Preço</th>
                <th className="text-left p-4">Estoque</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted animate-pulse shrink-0" />
                        <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                      </div>
                    </td>
                    <td className="p-4"><div className="h-4 w-20 rounded bg-muted animate-pulse" /></td>
                    <td className="p-4"><div className="h-4 w-16 rounded bg-muted animate-pulse" /></td>
                    <td className="p-4"><div className="h-4 w-10 rounded bg-muted animate-pulse" /></td>
                    <td className="p-4"><div className="h-6 w-16 rounded-full bg-muted animate-pulse" /></td>
                    <td className="p-4"><div className="h-9 w-20 rounded-lg bg-muted animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-10 text-muted-foreground">Nenhum produto cadastrado ainda</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="font-medium line-clamp-2 max-w-xs">{p.name}</div>
                    </div>
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 font-semibold">{formatBRL(p.price)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(p)} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.active ? "bg-success/10 text-success border border-success/20" : "bg-muted text-muted-foreground border border-border"}`}>
                      {p.active ? "Ativo" : "Oculto"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => remove(p.id)} className="w-9 h-9 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-bold text-lg">{form.id ? "Editar produto" : "Novo produto"}</h2>
              <button type="button" onClick={() => setOpen(false)} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Nome *</label>
                <input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Marca</label>
                  <input value={form.brand ?? ""} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Categoria *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary">
                    {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Descrição</label>
                <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Preço *</label>
                  <input type="number" step="0.01" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} required className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Preço antigo</label>
                  <input type="number" step="0.01" value={form.old_price ?? ""} onChange={(e) => setForm({ ...form, old_price: e.target.value ? parseFloat(e.target.value) : null })} className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Estoque</label>
                  <input type="number" value={form.stock ?? 0} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })} className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Imagem</label>
                <div className="flex gap-3 items-start">
                  <div className="w-24 h-24 rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {form.image_url ? <img src={form.image_url} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">Sem imagem</span>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="URL da imagem" className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary" />
                    <label className="flex items-center justify-center gap-2 cursor-pointer h-10 rounded-lg border border-dashed border-border hover:border-primary hover:bg-muted/50 text-xs">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading ? "Enviando..." : "Enviar imagem"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Badge</label>
                  <input value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Ex: NOVO, MAIS VENDIDO" className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Tags (separadas por vírgula)</label>
                  <input value={form.tagsInput ?? ""} onChange={(e) => setForm({ ...form, tagsInput: e.target.value })} placeholder="Ex: Força, Resistência" className="w-full bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active ?? true} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-primary" />
                Produto visível na loja
              </label>
            </div>

            <div className="flex gap-2 p-5 border-t border-border sticky bottom-0 bg-card">
              <button type="button" onClick={() => setOpen(false)} className="flex-1 h-11 rounded-xl border border-border hover:bg-muted text-sm font-semibold">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 h-11 rounded-xl gradient-primary text-white text-sm font-semibold hover:shadow-glow transition-all disabled:opacity-60">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
