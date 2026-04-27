import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useCategories";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminCategories = () => {
  const { categories, loading, refetch } = useCategories(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setSaving(true);
    const payload = { name: trimmedName, slug: slugify(trimmedName), active: true };
    const { error } = editingId
      ? await supabase.from("categories" as any).update(payload).eq("id", editingId)
      : await supabase.from("categories" as any).insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Categoria atualizada" : "Categoria criada");
    setName("");
    setEditingId(null);
    refetch();
  };

  const edit = (category: { id: string; name: string }) => {
    setEditingId(category.id);
    setName(category.name);
  };

  const remove = async (id: string) => {
    if (!confirm("Remover esta categoria?")) return;
    const { error } = await supabase.from("categories" as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Categoria removida");
    refetch();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Categorias</h1>
        <p className="text-muted-foreground">Gerencie as categorias exibidas na loja</p>
      </div>

      <form onSubmit={save} className="bg-card border border-border rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da categoria"
          className="flex-1 bg-muted border border-border rounded-lg px-3 h-11 text-sm outline-none focus:border-primary"
        />
        <button disabled={saving} className="inline-flex items-center justify-center gap-2 gradient-primary text-white px-5 h-11 rounded-xl font-semibold shadow-glow disabled:opacity-60">
          <Plus className="w-4 h-4" /> {editingId ? "Salvar" : "Adicionar"}
        </button>
      </form>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-muted-foreground">Carregando...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-muted-foreground">Nenhuma categoria cadastrada</div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-4 p-4 hover:bg-muted/40">
                <div>
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{category.slug}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => edit(category)} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(category.id)} className="w-9 h-9 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;