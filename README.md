# ISM Digital Museum

ISM Digital Museum нь Мэдээллийн Системийн Менежментийн тэнхимийн түүх, багш нарын танилцуулга, тэнхимийн өдөрлөг болон арга хэмжээний гэрэл зураг, оюутнуудын бүтээл, судалгаа, технологийн төслүүдийг нэг дор хадгалж, интерактив хэлбэрээр танилцуулах веб аппликейшн юм.

**Live demo:** https://ism-digital-museum-9vas.vercel.app

## Features
- Exhibits: list, detail page, search by title, filter by category, year and technology
- Teachers and Events with photo albums (admin managed)
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

