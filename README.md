# ISM Digital Museum

ISM Digital Museum нь Мэдээллийн Системийн Менежментийн тэнхимийн түүх, багш нарын танилцуулга, тэнхимийн өдөрлөг болон арга хэмжээний гэрэл зураг, оюутнуудын бүтээл, судалгаа, технологийн төслүүдийг нэг дор хадгалж, интерактив хэлбэрээр танилцуулах веб аппликейшн юм.

**Live demo:** https://ism-digital-museum-9vas.vercel.app

## Features
- Exhibits: list, detail page, search by title, filter by category, year and technology
- Teachers (unit, degree, email, office, courses) and Events with photo albums (admin managed)
- Department History and ISM Creators (students linked to their works)
- Registration, login, logout, roles: guest, student, admin
- CRUD with image upload to Supabase Storage
- Creative feature: **ISM Time Machine**, an interactive timeline merging history milestones,
  events and exhibits, with type filters and a year range slider

## Tech stack
React (Vite) + JavaScript, React Router, Supabase (Auth, PostgreSQL, Storage, RLS), GitHub, Vercel

## Setup
1. Clone the repository and run `npm install`
2. Create a `.env` file in the project root:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-publishable-key
   ```
3. Run the SQL scripts in the Supabase SQL Editor (tables, policies, storage buckets)
4. Start the app with `npm run dev`

## Database
![ERD](docs/erd.png)

- **Primary keys:** every table has an `id` (`profiles.id` equals `auth.users.id`).
- **Foreign keys:** `exhibits.creator_id` references `profiles.id` (owner of the work);
  `exhibits.category_id` references `exhibition_categories.id`;
  `event_photos.event_id` references `events.id` (deleting an event deletes its photos).

## Security (RLS)
Row Level Security is enabled on every table. Anyone can read published content. Students can
create exhibits and edit or delete only their own (`creator_id = auth.uid()`). Admins
(`profiles.role = 'admin'`) manage teachers, events, photos, categories and history. Storage
policies let students upload only into their own folder. Only the publishable (anon) key is used
in the frontend; no service key.

## Wireframes / prototype
Screenshots of the main pages are in `docs/wireframes/`.
