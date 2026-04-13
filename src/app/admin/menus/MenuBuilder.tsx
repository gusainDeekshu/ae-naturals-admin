"use client";

import React, { useEffect, useState } from "react";
import { adminMenusService } from "@/services/admin-menus.service";
import { 
  Trash2, Plus, Save, Loader2, 
  ChevronRight, Layout, Columns, 
  Link as LinkIcon, Database, ExternalLink,
  Package, Tags, Monitor
} from "lucide-react";
import AdminMenuPreview from "./AdminMenuPreview";
import toast from "react-hot-toast";

// =====================
// MENU TYPES
// =====================
const MENU_TYPES = [
  { label: "Collection", value: "COLLECTION", icon: <Database size={14} /> },
  { label: "Category", value: "CATEGORY", icon: <Tags size={14} /> },
  { label: "Product", value: "PRODUCT", icon: <Package size={14} /> },
  { label: "Custom Link", value: "EXTERNAL", icon: <ExternalLink size={14} /> }
];

export default function MenuBuilder({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [groups, setGroups] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // =====================
  // INIT
  // =====================
  useEffect(() => {
    init();
  }, [slug]);

  const init = async () => {
    setLoading(true);
    try {
      const [menuRes, colRes, catRes, prodRes] = await Promise.all([
        adminMenusService.getMenuBySlug(slug),
        adminMenusService.getAvailableCollections(),
        adminMenusService.getCategories?.(),
        adminMenusService.getProducts?.()
      ]);

      const menu = menuRes?.data || menuRes;

      setGroups(menu?.groups || []);
      setCollections(colRes || []);
      setCategories(catRes || []);
      setProducts(prodRes || []);
    } catch (e) {
      console.error("INIT ERROR", e);
      toast.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // SAVE
  // =====================
  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving menu changes...");
    try {
      const payload = {
        groups: groups.map((g, gIdx) => ({
          title: g.title,
          image: g.image || null,
          link: g.link || null,
          position: gIdx,

          columns: (g.columns || []).map((c: any, cIdx: number) => ({
            title: c.title,
            position: cIdx,

            items: (c.items || []).map((i: any, iIdx: number) => ({
              label: i.label || "",
              slug: i.slug || "",
              type: i.type || "COLLECTION",
              position: iIdx,
              referenceId: i.referenceId || null
            }))
          }))
        }))
      };

      await adminMenusService.updateMenu(slug, payload);
      toast.success("Menu published successfully", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Failed to save menu changes", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // =====================
  // GROUP
  // =====================
  const addGroup = () => {
    setGroups([...groups, { title: "New Group", columns: [] }]);
    toast.success("New group added");
  };

  const deleteGroup = (gIdx: number) => {
    setGroups(groups.filter((_, i) => i !== gIdx));
    toast.error("Group removed");
  };

  // =====================
  // COLUMN
  // =====================
  const addColumn = (gIdx: number) => {
    const updated = [...groups];
    if (!updated[gIdx].columns) updated[gIdx].columns = [];

    updated[gIdx].columns.push({
      title: "New Column",
      items: []
    });

    setGroups(updated);
  };

  const deleteColumn = (gIdx: number, cIdx: number) => {
    const updated = [...groups];
    updated[gIdx].columns.splice(cIdx, 1);
    setGroups(updated);
  };

  // =====================
  // ITEM
  // =====================
  const addItem = (gIdx: number, cIdx: number) => {
    const updated = [...groups];

    updated[gIdx].columns[cIdx].items.push({
      label: "",
      slug: "",
      type: "COLLECTION",
      referenceId: null
    });

    setGroups(updated);
  };

  const deleteItem = (gIdx: number, cIdx: number, iIdx: number) => {
    const updated = [...groups];
    updated[gIdx].columns[cIdx].items.splice(iIdx, 1);
    setGroups(updated);
  };

  const syncCollection = (
    gIdx: number,
    cIdx: number,
    iIdx: number,
    id: string
  ) => {
    const selected = collections.find((c) => c.id === id);
    if (!selected) return;

    const updated = [...groups];

    updated[gIdx].columns[cIdx].items[iIdx] = {
      ...updated[gIdx].columns[cIdx].items[iIdx],
      label: selected.name,
      slug: selected.slug,
      referenceId: selected.id,
      type: "COLLECTION"
    };

    setGroups(updated);
  };

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center text-slate-400 gap-4 animate-in fade-in duration-500">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-sm font-medium tracking-widest uppercase">Initializing Menu Engine</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        
        {/* PREVIEW PANEL */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="bg-slate-50 px-6 py-3 border-b flex items-center gap-2">
                <Monitor size={14} className="text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Storefront Live Preview</span>
            </div>
            <div className="p-2 opacity-90 grayscale-[0.2]">
                <AdminMenuPreview groups={groups} />
            </div>
        </section>

        {/* STICKY HEADER */}
        <header className="sticky top-4 z-40">
            <div className="backdrop-blur-xl bg-white/70 border border-white/50 rounded-2xl shadow-lg shadow-slate-200/50 px-6 py-4 flex justify-between items-center ring-1 ring-slate-900/5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Layout className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Navigation Builder</h1>
                        <p className="text-xs text-slate-500 font-medium">Manage mega-menu hierarchy and links</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="group relative bg-slate-900 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
                >
                    {saving ? (
                    <Loader2 className="animate-spin" size={18} />
                    ) : (
                    <Save size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                    )}
                    <span className="font-bold text-sm">Save Changes</span>
                </button>
            </div>
        </header>

        {/* EMPTY STATE */}
        {groups.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-slate-300 rounded-[2rem] bg-white shadow-inner flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Layout size={32} className="text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-1">Start Building Your Menu</h3>
            <p className="text-slate-500 mb-8 max-w-sm">Define top-level menu groups that appear in your main navigation bar.</p>
            <button
              onClick={addGroup}
              className="inline-flex items-center gap-2 bg-white text-slate-900 border-2 border-slate-900 px-8 py-3 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm"
            >
              <Plus size={18} />
              Add Navigation Group
            </button>
          </div>
        )}

        {/* GROUPS LIST */}
        <div className="space-y-10">
          {groups.map((group, gIdx) => (
            <div
              key={gIdx}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500 p-8 space-y-8 animate-in zoom-in-95"
            >
              {/* GROUP HEADER */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4 flex-1">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-black text-sm">{gIdx + 1}</span>
                    <input
                        value={group.title}
                        placeholder="Group Title (e.g., Shop, Services)"
                        onChange={(e) => {
                            const u = [...groups];
                            u[gIdx].title = e.target.value;
                            setGroups(u);
                        }}
                        className="text-xl font-black w-full bg-transparent placeholder:text-slate-300 focus:outline-none focus:ring-0 text-slate-900 transition-colors focus:text-indigo-600"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => addColumn(gIdx)}
                        className="h-10 px-4 rounded-xl flex items-center gap-2 text-sm font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    >
                        <Columns size={16} />
                        Add Column
                    </button>
                    <button
                        onClick={() => deleteGroup(gIdx)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                        title="Delete Group"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>

              {/* COLUMNS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(group.columns || []).map((col: any, cIdx: number) => (
                  <div
                    key={cIdx}
                    className="group/column bg-slate-50/50 border border-slate-100 rounded-3xl p-5 space-y-5 transition-all duration-300 hover:bg-white hover:border-indigo-200 hover:shadow-lg"
                  >
                    {/* COLUMN HEADER */}
                    <div className="flex items-center gap-2 px-1">
                      <input
                        value={col.title}
                        placeholder="Column Title"
                        onChange={(e) => {
                          const u = [...groups];
                          u[gIdx].columns[cIdx].title = e.target.value;
                          setGroups(u);
                        }}
                        className="font-bold text-sm uppercase tracking-widest bg-transparent w-full text-slate-500 focus:text-indigo-600 focus:outline-none"
                      />

                      <button
                        onClick={() => deleteColumn(gIdx, cIdx)}
                        className="opacity-0 group-hover/column:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 hover:text-rose-500 transition-all duration-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* ITEMS LIST */}
                    <div className="space-y-3">
                        {(col.items || []).map((item: any, iIdx: number) => (
                        <div
                            key={iIdx}
                            className="group/item bg-white border border-slate-200 rounded-2xl p-4 space-y-4 hover:border-indigo-300 transition-all duration-300 hover:shadow-md relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        {MENU_TYPES.find(t => t.value === item.type)?.icon}
                                    </div>
                                    <select
                                        value={item.type}
                                        onChange={(e) => {
                                            const u = [...groups];
                                            u[gIdx].columns[cIdx].items[iIdx] = {
                                            ...item,
                                            type: e.target.value,
                                            label: "",
                                            slug: "",
                                            referenceId: null
                                            };
                                            setGroups(u);
                                        }}
                                        className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        {MENU_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <button
                                    onClick={() => deleteItem(gIdx, cIdx, iIdx)}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {/* CONDITIONAL SELECTS */}
                            <div className="space-y-3 animate-in fade-in duration-300">
                                {item.type === "COLLECTION" && (
                                <select
                                    value={item.referenceId || ""}
                                    onChange={(e) => syncCollection(gIdx, cIdx, iIdx, e.target.value)}
                                    className="w-full border-slate-200 border rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                >
                                    <option value="">Select Collection...</option>
                                    {collections.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                )}

                                {item.type === "CATEGORY" && (
                                <select
                                    value={item.referenceId || ""}
                                    onChange={(e) => {
                                        const selected = categories.find((c) => c.id === e.target.value);
                                        if (!selected) return;
                                        const u = [...groups];
                                        u[gIdx].columns[cIdx].items[iIdx] = {
                                            ...item,
                                            label: selected.name,
                                            slug: selected.slug,
                                            referenceId: selected.id,
                                            type: "CATEGORY"
                                        };
                                        setGroups(u);
                                    }}
                                    className="w-full border-slate-200 border rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                >
                                    <option value="">Select Category...</option>
                                    {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                )}

                                {item.type === "PRODUCT" && (
                                <select
                                    value={item.referenceId || ""}
                                    onChange={(e) => {
                                        const selected = products.find((p) => p.id === e.target.value);
                                        if (!selected) return;
                                        const u = [...groups];
                                        u[gIdx].columns[cIdx].items[iIdx] = {
                                            ...item,
                                            label: selected.name,
                                            slug: selected.slug,
                                            referenceId: selected.id,
                                            type: "PRODUCT"
                                        };
                                        setGroups(u);
                                    }}
                                    className="w-full border-slate-200 border rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                >
                                    <option value="">Select Product...</option>
                                    {products.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                )}

                                {item.type === "EXTERNAL" && (
                                <div className="grid gap-2">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><LinkIcon size={12} /></div>
                                        <input
                                            placeholder="Link Display Text"
                                            value={item.label}
                                            onChange={(e) => {
                                                const u = [...groups];
                                                u[gIdx].columns[cIdx].items[iIdx].label = e.target.value;
                                                setGroups(u);
                                            }}
                                            className="w-full pl-9 border-slate-200 border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <input
                                        placeholder="Full URL (e.g. /custom-page)"
                                        value={item.slug}
                                        onChange={(e) => {
                                            const u = [...groups];
                                            u[gIdx].columns[cIdx].items[iIdx].slug = e.target.value;
                                            setGroups(u);
                                        }}
                                        className="w-full border-slate-200 border rounded-xl px-4 py-2 text-xs font-mono bg-slate-50 text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                )}
                            </div>
                        </div>
                        ))}

                        <button
                            onClick={() => addItem(gIdx, cIdx)}
                            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold"
                        >
                            <Plus size={14} />
                            Add Link Item
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION */}
        <div className="flex justify-center pt-8 border-t border-slate-200">
            <button
                onClick={addGroup}
                className="group relative inline-flex items-center gap-3 bg-white text-slate-900 border-2 border-slate-900 px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-xl hover:shadow-indigo-200/50"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                Add New Navigation Group
            </button>
        </div>
      </div>
    </div>
  );
}