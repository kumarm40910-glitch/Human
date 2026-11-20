import Stripe from "stripe"; import db from "@/lib/db";
export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); let ev;
  try { ev = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET); } catch { return new Response("bad signature", { status: 400 }); }
  const o = ev.data.object;
  if (ev.type === "checkout.session.completed") db.prepare("update users set plan='pro', customer=? where id=?").run(o.customer, o.client_reference_id);
  if (ev.type === "customer.subscription.deleted") db.prepare("update users set plan='free' where customer=?").run(o.customer);
  return Response.json({ received: true });
}
