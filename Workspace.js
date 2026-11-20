"use client";
import { useEffect, useState, useCallback } from "react"; import { useRouter } from "next/navigation"; import { TONES } from "@/lib/ai";
export default function Workspace({ user }) {
  const r = useRouter();
  const [text, setText] = useState(""), [tone, setTone] = useState("human"), [out, setOut] = useState(""), [err, setErr] = useState(""), [upg, setUpg] = useState(false), [busy, setBusy] = useState(false);
  const [items, setItems] = useState([]), [q, setQ] = useState(""), [ft, setFt] = useState(""), [copied, setCopied] = useState(false);
  const load = useCallback(async () => { const res = await fetch(`/api/scripts?q=${encodeURIComponent(q)}&tone=${ft}`); if (res.ok) setItems(await res.json()); }, [q, ft]);
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);
  async function go() { setBusy(true); setErr(""); setUpg(false); setOut("");
    const res = await fetch("/api/rewrite", { method: "POST", body: JSON.stringify({ text, tone }) }); const d = await res.json();
    if (res.ok) { setOut(d.output); load(); } else { setErr(d.error); setUpg(!!d.upgrade); } setBusy(false); }
  async function upgrade() { const d = await (await fetch("/api/stripe/checkout", { method: "POST" })).json(); if (d.url) location.href = d.url; else setErr(d.error); }
  async function del(id) { await fetch(`/api/scripts?id=${id}`, { method: "DELETE" }); load(); }
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); r.push("/"); r.refresh(); }
  const copy = () => { navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (<div className="min-h-screen bg-slate-50">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
      <span className="font-bold text-brand-600">Humanize</span>
      <div className="flex items-center gap-3 text-sm"><span className="hidden text-slate-500 sm:inline">{user.email}</span>
        {user.plan === "pro" ? <span className="rounded-full bg-brand-100 px-2.5 py-1 font-semibold text-brand-700">Pro</span> : <button onClick={upgrade} className="btn !py-1.5">Upgrade</button>}
        <button onClick={logout} className="text-slate-500">Log out</button></div></div></header>
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-5">
      <section className="space-y-4 lg:col-span-3">
        <textarea className="input h-56" placeholder="Paste your AI-generated script here…" value={text} onChange={e => setText(e.target.value)} />
        <div className="flex flex-wrap gap-2">{Object.entries(TONES).map(([k, v]) => <button key={k} onClick={() => setTone(k)} className={`rounded-full border px-3 py-1.5 text-sm ${tone === k ? "border-brand-500 bg-brand-500 text-white" : "bg-white text-slate-700"}`}>{v}</button>)}</div>
        <button className="btn" onClick={go} disabled={busy || text.trim().length < 20}>{busy ? "Rewriting…" : "Humanize script"}</button>
        {err && <p className="text-sm text-red-600">{err} {upg && <button onClick={upgrade} className="font-semibold underline">Upgrade now</button>}</p>}
        {out ? <div className="rounded-xl border border-brand-100 bg-white p-4"><div className="mb-2 flex justify-between"><span className="text-sm font-semibold text-brand-700">Result</span><button onClick={copy} className="text-sm text-brand-600">{copied ? "Copied" : "Copy"}</button></div><p className="whitespace-pre-wrap text-sm leading-relaxed">{out}</p></div>
          : <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">Your humanized script will show up here. Paste some text and pick a tone to start.</div>}
      </section>
      <aside className="lg:col-span-2"><h2 className="mb-3 font-semibold">History</h2>
        <div className="mb-3 flex gap-2"><input className="input" placeholder="Search scripts" value={q} onChange={e => setQ(e.target.value)} />
          <select className="input !w-auto" value={ft} onChange={e => setFt(e.target.value)}><option value="">All tones</option>{Object.entries(TONES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        {items.length === 0 ? <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">{q || ft ? "No scripts match your search." : "No rewrites yet. Your saved scripts will appear here."}</p> :
          <ul className="space-y-2">{items.map(i => <li key={i.id} className="rounded-lg border bg-white p-3">
            <div className="flex justify-between text-xs text-slate-500"><span className="font-semibold text-brand-600">{TONES[i.tone]}</span><span>{new Date(i.created * 1000).toLocaleDateString()}</span></div>
            <p className="mt-1 line-clamp-2 text-sm">{i.output}</p>
            <div className="mt-2 flex gap-3 text-xs"><button className="text-brand-600" onClick={() => { setText(i.input); setOut(i.output); setTone(i.tone); window.scrollTo(0, 0); }}>Open</button><button className="text-red-600" onClick={() => del(i.id)}>Delete</button></div></li>)}</ul>}
      </aside>
    </main></div>);
}
