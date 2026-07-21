import React, { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { Edit3, Filter, FolderPlus, Plus, RefreshCw, Search, Trash2, Upload, X } from "lucide-react";
import { db } from "../../../components/Firebase";
import { uploadToCloudinary } from "../../../config/cloudinary";

const config = { Categories: ["categories", "Category"], SubCategories: ["subcategories", "Sub Category"], Collections: ["collections", "Collection"], Countries: ["countries", "Country"], Brands: ["brands", "Brand"], Attributes: ["attributes", "Attribute"] };
const tone = (status) => status === "Draft" ? "bg-amber-50 text-amber-700" : status === "Trash" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700";

const CatalogManager = ({ type }) => {
  const [collectionName, singular] = config[type]; const csvInput = useRef(null); const editor = useRef(null);
  const [sourceItems, setSourceItems] = useState([]); const [trashItems, setTrashItems] = useState([]); const [editing, setEditing] = useState(null); const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [status, setStatus] = useState("Active"); const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All"); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  
  // Custom columns for Countries and Categories (Image and Link)
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);

  const hasExtraFields = type === "Countries" || type === "Categories";

  const toRows = (snapshot, isTrash = false) => snapshot.docs.map((item) => ({ 
    id: item.id, 
    ...(isTrash ? item.data().data : item.data()), 
    status: isTrash ? "Trash" : (item.data().status || "Active"), 
    trashId: isTrash ? item.id : null 
  }));

  useEffect(() => {
    const stopSource = onSnapshot(collection(db, collectionName), (snapshot) => setSourceItems(toRows(snapshot)), (event) => setError(event.message));
    const stopTrash = onSnapshot(query(collection(db, "trash"), where("sourceCollection", "==", collectionName)), (snapshot) => setTrashItems(toRows(snapshot, true)), (event) => setError(event.message));
    return () => { stopSource(); stopTrash(); };
  }, [collectionName]);

  const items = useMemo(() => [...sourceItems, ...trashItems], [sourceItems, trashItems]);
  
  const reset = () => { 
    setEditing(null); 
    setName(""); 
    setDescription(""); 
    setStatus("Active"); 
    setImage("");
    setLink("");
    setError(""); 
  };

  const openAdd = () => { reset(); setTimeout(() => editor.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 0); };
  
  const refresh = async () => { 
    setSaving(true); 
    setError(""); 
    try { 
      const [source, trash] = await Promise.all([getDocs(collection(db, collectionName)), getDocs(query(collection(db, "trash"), where("sourceCollection", "==", collectionName)))]); 
      setSourceItems(toRows(source)); 
      setTrashItems(toRows(trash, true)); 
    } catch (event) { 
      setError(event.message || "Refresh failed."); 
    } finally { 
      setSaving(false); 
    } 
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadToCloudinary(file);
      setImage(url);
    } catch (err) {
      setError("Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (event) => { 
    event.preventDefault(); 
    if (!name.trim()) { setError(`${singular} name is required.`); return; } 
    setSaving(true); 
    try { 
      const data = { 
        name: name.trim(), 
        description: description.trim(), 
        status, 
        updatedAt: serverTimestamp() 
      };
      
      if (hasExtraFields) {
        data.image = image;
        data.link = link.trim();
      }

      if (editing) {
        await updateDoc(doc(db, collectionName, editing.id), data); 
      } else {
        await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() }); 
      }
      reset(); 
    } catch (event) { 
      setError(event.message || "Unable to save."); 
    } finally { 
      setSaving(false); 
    } 
  };

  const edit = (item) => { 
    if (item.trashId) return; 
    setEditing(item); 
    setName(item.name || ""); 
    setDescription(item.description || ""); 
    setStatus(item.status); 
    if (hasExtraFields) {
      setImage(item.image || "");
      setLink(item.link || "");
    }
    setError(""); 
    editor.current?.scrollIntoView({ behavior: "smooth", block: "center" }); 
  };

  const moveToTrash = async (item) => { 
    if (!window.confirm(`Move ${item.name} to Trash?`)) return; 
    try { 
      const { id, trashId, ...data } = item; 
      const batch = writeBatch(db); 
      const ref = doc(collection(db, "trash")); 
      batch.set(ref, { sourceCollection: collectionName, sourceId: id, data, deletedAt: serverTimestamp() }); 
      batch.delete(doc(db, collectionName, id)); 
      await batch.commit(); 
      if (editing?.id === id) reset(); 
    } catch (event) { 
      setError(event.message || "Unable to move to Trash."); 
    } 
  };

  const permanentDelete = async (item) => { 
    if (!window.confirm(`Permanently delete ${item.name}? This cannot be undone.`)) return; 
    try { 
      await deleteDoc(doc(db, "trash", item.trashId)); 
    } catch (event) { 
      setError(event.message || "Unable to permanently delete."); 
    } 
  };

  const importCsv = (file) => { 
    if (!file) return; 
    Papa.parse(file, { 
      header: true, 
      skipEmptyLines: true, 
      complete: async ({ data }) => { 
        const rows = data.map((row) => {
          const entry = { 
            name: String(row.name || row.Name || "").trim(), 
            description: String(row.description || row.Description || "").trim(), 
            status: row.status === "Draft" ? "Draft" : "Active" 
          };
          if (hasExtraFields) {
            entry.image = String(row.image || "").trim();
            entry.link = String(row.link || "").trim();
          }
          return entry;
        }).filter((row) => row.name); 

        if (!rows.length) { 
          setError("CSV needs a name column with at least one value."); 
          return; 
        } 
        setSaving(true); 
        try { 
          await Promise.all(rows.map((row) => addDoc(collection(db, collectionName), { ...row, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }))); 
        } catch (event) { 
          setError(event.message || "CSV import failed."); 
        } finally { 
          setSaving(false); 
          file.value = ""; 
        } 
      } 
    }); 
  };

  const counts = { 
    total: items.length, 
    active: sourceItems.filter((item) => item.status === "Active").length, 
    draft: sourceItems.filter((item) => item.status === "Draft").length, 
    trash: trashItems.length 
  };

  const filtered = items.filter((item) => (filter === "All" || item.status === filter) && `${item.name} ${item.description || ""}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Total", counts.total, "bg-rose-50 text-[#941232]"], ["Active", counts.active, "bg-emerald-50 text-emerald-600"], ["Draft", counts.draft, "bg-amber-50 text-amber-600"], ["Trash", counts.trash, "bg-slate-100 text-slate-600"]].map(([label, value, tint]) => (
          <article key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-[14px] font-semibold text-slate-500">{label} {type.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
              </div>
              <span className={`grid h-10 w-10 place-items-center rounded-full ${tint}`}><FolderPlus size={18}/></span>
            </div>
            <p className="mt-3 text-[14px] text-slate-400">Live Firestore count</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-[16px] font-bold">{type.replace(/([A-Z])/g, " $1").trim()}</h1>
            <p className="mt-1 text-[14px] text-slate-400">Manage your catalogue entries.</p>
          </div>
          <div className="flex gap-2">
            <input ref={csvInput} type="file" accept=".csv" className="hidden" onChange={(event) => importCsv(event.target.files?.[0])}/>
            <button onClick={() => csvInput.current?.click()} className="flex items-center gap-2 rounded-lg border border-[#941232] px-3 py-2 text-xs font-semibold text-[#941232]"><Upload size={14}/>Upload CSV</button>
            <button onClick={refresh} className="rounded-lg border border-slate-200 p-2 text-slate-500" title="Refresh"><RefreshCw size={15}/></button>
            <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[#941232] px-4 py-2 text-xs font-semibold text-white"><Plus size={14}/>Add {singular}</button>
          </div>
        </div>

        <div className="m-5 flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-400">
            <Search size={15}/>
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-xs text-slate-700 outline-none" placeholder={`Search ${type.toLowerCase()}...`}/>
          </label>
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
            <option value="All">All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Trash</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead className="bg-slate-50 text-[14px] uppercase tracking-wider text-slate-400">
              <tr>
                {hasExtraFields && <th className="px-6 py-3">Image</th>}
                <th className="px-6 py-3">Name</th>
                <th className="px-5 py-3">Description</th>
                {hasExtraFields && <th className="px-5 py-3">Link</th>}
                <th className="px-5 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item) => (
                <tr key={item.trashId || item.id} className="text-xs">
                  {hasExtraFields && (
                    <td className="px-6 py-4">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      ) : (
                        <span className="text-[10px] text-slate-400">No Image</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 font-semibold">{item.name}</td>
                  <td className="px-5 py-4 text-slate-500">{item.description || "—"}</td>
                  {hasExtraFields && <td className="px-5 py-4 text-slate-500 font-mono truncate max-w-[150px]">{item.link || "—"}</td>}
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[14px] font-semibold ${tone(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {!item.trashId && <button onClick={() => edit(item)} className="rounded-lg bg-slate-100 p-2"><Edit3 size={14}/></button>}
                      <button onClick={() => item.trashId ? permanentDelete(item) : moveToTrash(item)} className="rounded-lg bg-rose-50 p-2 text-rose-600"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={hasExtraFields ? 6 : 4} className="px-6 py-14 text-center text-xs text-slate-400">No entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Editor section */}
      <section ref={editor} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold">{editing ? `Edit ${singular}` : `Add ${singular}`}</h2>
        <form onSubmit={save} className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-[14px] font-semibold">
            {singular} Name *
            <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white text-xs px-3 py-2.5 outline-none"/>
          </label>
          <label className="text-[14px] font-semibold">
            Description
            <input value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white text-xs px-3 py-2.5 outline-none"/>
          </label>
          
          {hasExtraFields && (
            <>
              <div className="text-[14px] font-semibold">
                Image
                <div className="flex gap-2 mt-1.5">
                  <input value={image} onChange={(event) => setImage(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white text-xs px-3 py-2.5 outline-none" placeholder="Link or upload"/>
                  <label className="flex items-center justify-center p-2 rounded-lg border border-dashed border-slate-350 cursor-pointer bg-slate-50 text-slate-650 hover:bg-slate-100">
                    <Upload size={14} />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
                {uploading && <p className="text-[9px] text-amber-600 mt-1">Uploading image...</p>}
              </div>

              <label className="text-[14px] font-semibold">
                Link
                <input value={link} onChange={(event) => setLink(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white text-xs px-3 py-2.5 outline-none" placeholder="/world-edit/country"/>
              </label>
            </>
          )}

          <label className="text-[14px] font-semibold">
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white text-xs px-3 py-2.5 outline-none">
              <option>Active</option>
              <option>Draft</option>
            </select>
          </label>
          <div className="flex items-end gap-2 col-span-full justify-end">
            <button disabled={saving || uploading} className="rounded-lg bg-[#941232] px-6 py-2.5 text-xs font-semibold text-white">{saving ? "Saving..." : editing ? "Update" : "Add"}</button>
            {editing && <button type="button" onClick={reset} className="rounded-lg border border-slate-200 p-2.5"><X size={15}/></button>}
          </div>
        </form>
        {error && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-[14px] text-rose-700">{error}</p>}
      </section>
    </div>
  );
};
export default CatalogManager;
