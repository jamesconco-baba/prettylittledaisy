# Pretty little Daisy
Phase 1 storefront, Phase 2 cart and Stripe checkout, admin dashboard at /admin.

## Setup
1. Supabase: run supabase/schema.sql in the SQL editor.
2. Stripe: add webhook endpoint https://YOURDOMAIN/api/webhook, event checkout.session.completed.
3. Vercel environment variables:
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ADMIN_PASSWORD (optional ADMIN_USER, default admin),
NEXT_PUBLIC_SITE_URL, RESEND_API_KEY and EMAIL_FROM (optional until the domain is verified).
