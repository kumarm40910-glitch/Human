import Link from "next/link"; import { getUser } from "@/lib/auth"; import { TONES } from "@/lib/ai";
export const dynamic = "force-dynamic";
export default async function Home() {
  const u = await getUser();
  return (<main>
    <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
      <span className="text-lg font-bold text-brand-600">Humanize</span>
      <nav className="flex items-center gap-4 text-sm"><a href="#pricing" className="text-slate-600">Pricing</a>
        {u ? <Link className="btn" href="/dashboard">Open workspace</Link> : <><Link href="/login" className="text-slate-600">Log in</Link><Link className="btn" href="/login?mode=signup">Start free</Link></>}</nav>
    </header>
    <section className="bg-brand-900 text-white"><div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">Your script sounds like a robot. Fix that in ten seconds.</h1>
      <p className="mt-5 max-w-xl text-lg text-blue-100">Paste any AI-generated script and get a version that sounds like a real person talking, in the tone you pick.</p>
      <div className="mt-8 flex flex-wrap gap-2">{Object.values(TONES).map(t => <span key={t} className="rounded-full border border-blue-300/40 px-3 py-1 text-sm text-blue-100">{t}</span>)}</div>
      <Link href="/login?mode=signup" className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-700">Humanize my first script</Link>
    </div></section>
    <section className="mx-auto grid max-w-5xl gap-4 px-5 py-16 sm:grid-cols-2">
      <div className="rounded-xl border border-red-200 bg-red-50 p-5"><p className="mb-2 text-sm font-semibold text-red-700">Before</p><p className="text-sm text-slate-700">In today's fast-paced world, it is crucial to delve into the myriad ways content can elevate your brand.</p></div>
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-5"><p className="mb-2 text-sm font-semibold text-brand-700">After</p><p className="text-sm text-slate-700">Look, your content isn't getting noticed. Here's what actually moves the needle for your brand.</p></div>
    </section>
    <section id="pricing" className="mx-auto max-w-5xl px-5 pb-20"><h2 className="text-2xl font-bold">Simple pricing</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border p-6"><h3 className="font-semibold">Free</h3><p className="mt-1 text-3xl font-bold">$0</p><p className="mt-3 text-sm text-slate-600">5 rewrites per month, all tones, saved history.</p></div>
        <div className="rounded-xl border-2 border-brand-500 p-6"><h3 className="font-semibold text-brand-600">Pro</h3><p className="mt-1 text-3xl font-bold">$12<span className="text-base font-normal text-slate-500">/mo</span></p><p className="mt-3 text-sm text-slate-600">Unlimited rewrites, all tones, saved history.</p></div>
      </div></section>
  </main>);
}
