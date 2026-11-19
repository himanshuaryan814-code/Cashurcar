# CashUrCar — GitHub-ready website starter

Premium, responsive used-car dealership website built with React, Vite, TypeScript, Tailwind CSS, Framer Motion dependencies, Lucide icons and Supabase.

## Included

- Responsive homepage with automotive hero carousel, shopping tools, featured inventory, editorial sections and footer.
- Inventory search, brand/body-type filters and sorting.
- Vehicle detail pages with call, WhatsApp and test-drive enquiry actions.
- Sell-your-car form with multiple image selection (uploads to Supabase Storage when configured).
- Reducing-balance EMI calculator and finance enquiry form.
- About and contact pages with the supplied CashUrCar address, phone numbers and Google Maps destination.
- Customer sign-up, login and password-reset flow via Supabase Auth.
- Starter admin dashboard for adding/deleting vehicles and viewing buyer leads.
- Supabase SQL schema with Row Level Security policies and storage buckets.
- Demo inventory fallback when Supabase environment variables are not configured.

## Run locally

1. Install Node.js 20 or newer.
2. Download/clone this repository.
3. In the project folder run:

```bash
npm install
cp .env.example .env.local
npm run dev
```

4. Open the local URL printed by Vite.

## Connect Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run the complete `supabase/schema.sql` file.
3. In Supabase Project Settings → API, copy the Project URL and anon/public key.
4. Add them to `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

5. Restart the Vite server after changing environment variables.
6. Register your own account through `/account`.
7. In Supabase SQL Editor, promote only your own account to administrator. Replace the email below:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOUR-ADMIN-EMAIL');
```

8. Sign out and sign in again. The app checks the profile role for routing; the database RLS policies are the actual security boundary.

**Never put the Supabase service-role key in frontend environment variables.** Only the anon/public key belongs in `VITE_` variables.

## Add real vehicles

Use the admin dashboard at `/admin/dashboard` to add a vehicle. For the initial implementation, the form accepts a publicly accessible image URL. The SQL also creates a `vehicle-images` public bucket for managed image hosting; the admin image upload UI can be extended to upload files to this bucket. Use dealership-owned/authorized photographs and confirm that every vehicle image matches the listed model.

The initial sample vehicle records in `src/lib/data.ts` are preview-only and are not confirmed CashUrCar stock. Remove or replace them before launch. When Supabase is connected, the live inventory table is used.

## Deploy to GitHub and Vercel

1. Create a new GitHub repository.
2. Upload/push all project files (do not upload `.env.local` or `node_modules`).
3. Import the repository into Vercel.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables.
5. Deploy. Vercel detects Vite automatically.
6. In Supabase Auth settings, configure your production site URL and allowed redirect URLs.

Build command: `npm run build`  
Output directory: `dist`

## Important launch checklist

- Replace preview images with licensed dealership images for the exact vehicle model.
- Replace demo inventory with actual, available stock and verified prices/specifications.
- Verify supplied business claims (50+ checks, 20+ years, 500+ customers) before publishing.
- Add actual customer reviews only with permission and source links.
- Configure admin account and test all RLS policies using an anon user and admin user.
- Test form submissions, image upload, WhatsApp, calls, maps, and mobile layouts.
- Configure legal/privacy text for the dealership's actual practices.

## Current implementation boundaries

This is a working starter platform, not a completed dealership ERP. The admin UI currently provides basic vehicle add/delete and a buyer-lead preview. Full CMS editing, full lead pipeline management (all lead types, statuses, notes, bulk deletion and CSV export), multi-image vehicle gallery upload/reordering, and customer saved-vehicle syncing are not yet implemented. The database schema includes tables/policies to support those extensions. Do not advertise those unimplemented admin capabilities as live features.
