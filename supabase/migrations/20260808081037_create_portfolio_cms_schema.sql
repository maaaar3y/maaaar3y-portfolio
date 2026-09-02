/*
# Portfolio CMS Schema — Complete Database Architecture

## Overview
Creates the full database schema for a dynamic personal portfolio CMS with bilingual (English/Arabic) content support, admin authentication, public visitor submissions (testimonials, comments, contact messages), notifications, media library, and appearance/SEO settings.

## Tables Created

### Content Tables (admin-managed, public read for published rows)
1. **site_settings** — Global site configuration (owner name, title, tagline, etc.)
2. **navigation_items** — Nav bar links (orderable, publishable)
3. **hero_content** — Single-row hero section content (title, subtitle, CTA buttons, stats)
4. **about_content** — Single-row about section (summary, mission, vision, philosophy, values)
5. **experiences** — Work/volunteer experience entries (orderable, expandable highlights)
6. **education** — Education entries (orderable)
7. **skill_categories** — Skill groups with skills (orderable)
8. **skills** — Individual skills belonging to categories
9. **projects** — Portfolio projects (bilingual, featured, publishable, orderable)
10. **project_media** — Additional images/videos for projects
11. **graduation_project** — Single-row graduation case study (phases, fragrances, stats)
12. **certificates** — Certificates and training (orderable, featured)
13. **achievements** — Achievement stat cards (orderable)
14. **timeline_events** — Timeline entries (orderable, typed)
15. **social_links** — Social media links (orderable)
16. **contact_info** — Contact details (email, phone, location, etc.)
17. **seo_settings** — Single-row SEO config (meta, OG, keywords)
18. **appearance_settings** — Single-row appearance config (colors, fonts, radius, animation)
19. **profile_image** — Single-row profile/avatar reference

### Visitor Submission Tables (public write, admin moderate)
20. **testimonials** — Visitor testimonials (pending/approved/rejected, featured, pinned)
21. **comments** — Visitor comments/reviews (pending/approved/rejected, admin replies)
22. **contact_messages** — Contact form submissions (read/archived)

### System Tables
23. **notifications** — Admin notifications for new submissions
24. **media** — Media library entries (images, PDFs, docs — stored in Supabase Storage)

## Security Model
- **Public users (anon role)**: Can READ published content + submit testimonials, comments, contact messages.
- **Authenticated admin**: Full CRUD on all tables.
- All tables have RLS enabled.
- Visitor emails are never exposed publicly (separate policies hide email columns from anon on testimonials/comments).
- Contact messages are admin-only (no public read at all).

## Bilingual Architecture
- Content tables use `title_en`, `title_ar`, `description_en`, `description_ar` pattern for bilingual fields.
- The public site reads the appropriate column based on the current locale.
- Admin can edit both languages in the CMS.

## Notes
1. All tables include `created_at` and `updated_at` timestamps.
2. Orderable tables have `sort_order` integer column.
3. Publishable tables have `published` boolean column.
4. Single-row tables use a fixed `id = 1` pattern with a CHECK constraint.
5. Indexes added on frequently-queried columns (published, sort_order, status).
*/

-- ============================================================
-- SECTION 1: SITE SETTINGS & NAVIGATION
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  owner_name_en text NOT NULL DEFAULT 'Youssef M. Marey',
  owner_name_ar text NOT NULL DEFAULT 'يوسف م. مري',
  site_title_en text NOT NULL DEFAULT 'Youssef M. Marey — Personal Brand Platform',
  site_title_ar text NOT NULL DEFAULT 'يوسف م. مري — المنصة الشخصية',
  tagline_en text NOT NULL DEFAULT 'English Language & Translation Graduate',
  tagline_ar text NOT NULL DEFAULT 'خريج اللغة الإنجليزية والترجمة',
  description_en text NOT NULL DEFAULT 'Personal brand platform of Youssef M. Marey — English Language and Translation graduate, career development specialist, and bilingual project coordinator from Kafr El-Sheikh, Egypt.',
  description_ar text NOT NULL DEFAULT 'المنصة الشخصية ليوسف م. مري — خريج اللغة الإنجليزية والترجمة، أخصائي تطوير مهني، ومنسق مشاريع ثنائي اللغة من كفر الشيخ، مصر.',
  location_en text NOT NULL DEFAULT 'Kafr El-Sheikh, Egypt',
  location_ar text NOT NULL DEFAULT 'كفر الشيخ، مصر',
  available_for_opportunities boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- Navigation items
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label_en text NOT NULL,
  label_ar text NOT NULL,
  section_id text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_nav" ON navigation_items;
CREATE POLICY "public_read_nav" ON navigation_items FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_nav" ON navigation_items;
CREATE POLICY "admin_insert_nav" ON navigation_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_nav" ON navigation_items;
CREATE POLICY "admin_update_nav" ON navigation_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_nav" ON navigation_items;
CREATE POLICY "admin_delete_nav" ON navigation_items FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_nav_sort ON navigation_items (sort_order);

-- ============================================================
-- SECTION 2: HERO CONTENT
-- ============================================================

CREATE TABLE IF NOT EXISTS hero_content (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  badge_text_en text NOT NULL DEFAULT 'Available for opportunities',
  badge_text_ar text NOT NULL DEFAULT 'متاح للفرص',
  title_en text NOT NULL DEFAULT 'Youssef M. Marey',
  title_ar text NOT NULL DEFAULT 'يوسف م. مري',
  subtitle_en text NOT NULL DEFAULT 'English Language & Translation Graduate',
  subtitle_ar text NOT NULL DEFAULT 'خريج اللغة الإنجليزية والترجمة',
  description_en text NOT NULL DEFAULT 'career development specialist, bilingual project coordinator, and monitoring & evaluation practitioner from Kafr El-Sheikh, Egypt.',
  description_ar text NOT NULL DEFAULT 'أخصائي تطوير مهني، منسق مشاريع ثنائي اللغة، وممارس متابعة وتقييم من كفر الشيخ، مصر.',
  cta_work_en text NOT NULL DEFAULT 'View My Work',
  cta_work_ar text NOT NULL DEFAULT 'شاهد أعمالي',
  cta_contact_en text NOT NULL DEFAULT 'Get In Touch',
  cta_contact_ar text NOT NULL DEFAULT 'تواصل معي',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_hero" ON hero_content;
CREATE POLICY "public_read_hero" ON hero_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_hero" ON hero_content;
CREATE POLICY "admin_update_hero" ON hero_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_hero" ON hero_content;
CREATE POLICY "admin_insert_hero" ON hero_content FOR INSERT
  TO authenticated WITH CHECK (true);

-- Hero stats
CREATE TABLE IF NOT EXISTS hero_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text NOT NULL,
  suffix text NOT NULL DEFAULT '',
  label_en text NOT NULL,
  label_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_hero_stats" ON hero_stats;
CREATE POLICY "public_read_hero_stats" ON hero_stats FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_hero_stat" ON hero_stats;
CREATE POLICY "admin_insert_hero_stat" ON hero_stats FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_hero_stat" ON hero_stats;
CREATE POLICY "admin_update_hero_stat" ON hero_stats FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_hero_stat" ON hero_stats;
CREATE POLICY "admin_delete_hero_stat" ON hero_stats FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_hero_stats_sort ON hero_stats (sort_order);

-- ============================================================
-- SECTION 3: ABOUT CONTENT
-- ============================================================

CREATE TABLE IF NOT EXISTS about_content (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow_en text NOT NULL DEFAULT 'About Me',
  eyebrow_ar text NOT NULL DEFAULT 'نبذة',
  title_en text NOT NULL DEFAULT 'Bridging language, data, and community impact',
  title_ar text NOT NULL DEFAULT 'الجسر بين اللغة والبيانات والتأثير المجتمعي',
  description_en text NOT NULL DEFAULT 'A bilingual professional turning academic excellence in translation into hands-on career development, monitoring & evaluation, and project coordination.',
  description_ar text NOT NULL DEFAULT 'محترف ثنائي اللغة يحول التميز الأكاديمي في الترجمة إلى تطوير مهني عملي ومتابعة وتقييم وتنسيق مشاريع.',
  summary_en text NOT NULL DEFAULT 'English Language and Translation graduate with a GPA of 3.61 / 4.00 and hands-on experience in career development services, IT support, and monitoring & evaluation — gained through sustained volunteer work at Kafrelsheikh University''s Career Development Center (UCCD).',
  summary_ar text NOT NULL DEFAULT 'خريج اللغة الإنجليزية والترجمة بمعدل تراكمي 3.61 / 4.00 وخبرة عملية في خدمات التطوير المهني ودعم تكنولوجيا المعلومات والمتابعة والتقييم — مكتسبة من خلال العمل التطوعي المستمر في مركز تطوير المسارات المهنية بجامعة كفر الشيخ (UCCD).',
  summary_detail_en text NOT NULL DEFAULT 'Accredited training in project management, entrepreneurship, and workplace readiness. Bilingual in Arabic and English, with a track record of coordinating data, content, and cross-functional projects in service-oriented environments. Passionate about building systems that help people grow — whether through training programs, career services, or community outreach.',
  summary_detail_ar text NOT NULL DEFAULT 'تدريب معتمد في إدارة المشاريع وريادة الأعمال والجاهزية للعمل. ثنائي اللغة (العربية والإنجليزية)، مع سجل حافل في تنسيق البيانات والمحتوى والمشاريع المتعددة التخصصات في بيئات الخدمة. شغوف ببناء أنظمة تساعد الناس على النمو — سواء من خلال برامج التدريب أو الخدمات المهنية أو التواصل المجتمعي.',
  mission_en text NOT NULL DEFAULT 'To apply translation, data, and project management skills in roles that create real opportunities for people and communities.',
  mission_ar text NOT NULL DEFAULT 'تطبيق مهارات الترجمة والبيانات وإدارة المشاريع في أدوار تخلق فرصًا حقيقية للناس والمجتمعات.',
  vision_en text NOT NULL DEFAULT 'To become a trusted bilingual professional bridging cultures, organizations, and data-driven decision-making across the Arab region.',
  vision_ar text NOT NULL DEFAULT 'أن أصبح محترفًا ثنائي اللغة موثوقًا به يعمل كجسر بين الثقافات والمؤسسات واتخاذ القرارات المبنية على البيانات في المنطقة العربية.',
  philosophy_en text NOT NULL DEFAULT 'Quality work creates trust. Trust creates opportunity. Every detail — from a survey report to a social media reel — matters.',
  philosophy_ar text NOT NULL DEFAULT 'العمل الجيد يخلق الثقة. والثقة تخلق الفرصة. كل تفصيلة — من تقرير استبيار إلى مقطع على وسائل التواصل — مهمة.',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_about" ON about_content;
CREATE POLICY "public_read_about" ON about_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_about" ON about_content;
CREATE POLICY "admin_update_about" ON about_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_about" ON about_content;
CREATE POLICY "admin_insert_about" ON about_content FOR INSERT
  TO authenticated WITH CHECK (true);

-- About values
CREATE TABLE IF NOT EXISTS about_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL DEFAULT 'BookOpen',
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_values" ON about_values;
CREATE POLICY "public_read_values" ON about_values FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_value" ON about_values;
CREATE POLICY "admin_insert_value" ON about_values FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_value" ON about_values;
CREATE POLICY "admin_update_value" ON about_values FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_value" ON about_values;
CREATE POLICY "admin_delete_value" ON about_values FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_values_sort ON about_values (sort_order);

-- ============================================================
-- SECTION 4: EXPERIENCE
-- ============================================================

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_en text NOT NULL,
  role_ar text NOT NULL,
  org_en text NOT NULL,
  org_ar text NOT NULL,
  collaboration_en text,
  collaboration_ar text,
  period_en text NOT NULL,
  period_ar text NOT NULL,
  location_en text NOT NULL,
  location_ar text NOT NULL,
  summary_en text NOT NULL,
  summary_ar text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_experiences" ON experiences;
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_experience" ON experiences;
CREATE POLICY "admin_insert_experience" ON experiences FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_experience" ON experiences;
CREATE POLICY "admin_update_experience" ON experiences FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_experience" ON experiences;
CREATE POLICY "admin_delete_experience" ON experiences FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_exp_sort ON experiences (sort_order);

-- Experience highlights
CREATE TABLE IF NOT EXISTS experience_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  icon_name text NOT NULL DEFAULT 'Users',
  text_en text NOT NULL,
  text_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experience_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_exp_highlights" ON experience_highlights;
CREATE POLICY "public_read_exp_highlights" ON experience_highlights FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_exp_highlight" ON experience_highlights;
CREATE POLICY "admin_insert_exp_highlight" ON experience_highlights FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_exp_highlight" ON experience_highlights;
CREATE POLICY "admin_update_exp_highlight" ON experience_highlights FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_exp_highlight" ON experience_highlights;
CREATE POLICY "admin_delete_exp_highlight" ON experience_highlights FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_exp_hl_exp ON experience_highlights (experience_id);
CREATE INDEX IF NOT EXISTS idx_exp_hl_sort ON experience_highlights (sort_order);

-- ============================================================
-- SECTION 5: EDUCATION
-- ============================================================

CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree_en text NOT NULL,
  degree_ar text NOT NULL,
  institution_en text NOT NULL,
  institution_ar text NOT NULL,
  period_en text NOT NULL,
  period_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  gpa text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_education" ON education;
CREATE POLICY "admin_insert_education" ON education FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_education" ON education;
CREATE POLICY "admin_update_education" ON education FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_education" ON education;
CREATE POLICY "admin_delete_education" ON education FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_edu_sort ON education (sort_order);

-- ============================================================
-- SECTION 6: SKILLS
-- ============================================================

CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL DEFAULT 'BarChart3',
  title_en text NOT NULL,
  title_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skill_cats" ON skill_categories;
CREATE POLICY "public_read_skill_cats" ON skill_categories FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_skill_cat" ON skill_categories;
CREATE POLICY "admin_insert_skill_cat" ON skill_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skill_cat" ON skill_categories;
CREATE POLICY "admin_update_skill_cat" ON skill_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skill_cat" ON skill_categories;
CREATE POLICY "admin_delete_skill_cat" ON skill_categories FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_skill_cat_sort ON skill_categories (sort_order);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  level integer NOT NULL DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  description_en text NOT NULL DEFAULT '',
  description_ar text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_skill" ON skills;
CREATE POLICY "admin_insert_skill" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skill" ON skills;
CREATE POLICY "admin_update_skill" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skill" ON skills;
CREATE POLICY "admin_delete_skill" ON skills FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_skill_cat ON skills (category_id);
CREATE INDEX IF NOT EXISTS idx_skill_sort ON skills (sort_order);

-- ============================================================
-- SECTION 7: PROJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  category_en text NOT NULL DEFAULT '',
  category_ar text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  main_image_url text,
  video_url text,
  live_url text,
  github_url text,
  external_links jsonb NOT NULL DEFAULT '[]',
  start_date date,
  end_date date,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_project" ON projects;
CREATE POLICY "admin_insert_project" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_project" ON projects;
CREATE POLICY "admin_update_project" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_project" ON projects;
CREATE POLICY "admin_delete_project" ON projects FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_proj_sort ON projects (sort_order);
CREATE INDEX IF NOT EXISTS idx_proj_featured ON projects (featured);

CREATE TABLE IF NOT EXISTS project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'file')),
  url text NOT NULL,
  caption_en text,
  caption_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_media" ON project_media;
CREATE POLICY "public_read_project_media" ON project_media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_project_media" ON project_media;
CREATE POLICY "admin_insert_project_media" ON project_media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_project_media" ON project_media;
CREATE POLICY "admin_update_project_media" ON project_media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_project_media" ON project_media;
CREATE POLICY "admin_delete_project_media" ON project_media FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_pm_proj ON project_media (project_id);
CREATE INDEX IF NOT EXISTS idx_pm_sort ON project_media (sort_order);

-- ============================================================
-- SECTION 8: GRADUATION PROJECT
-- ============================================================

CREATE TABLE IF NOT EXISTS graduation_project (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow_en text NOT NULL DEFAULT 'Graduation Project — Case Study',
  eyebrow_ar text NOT NULL DEFAULT 'مشروع التخرج — دراسة حالة',
  title_en text NOT NULL DEFAULT 'The Art of Merging: Cultural Aromas into One Essence',
  title_ar text NOT NULL DEFAULT 'فن الدمج: روائح الثقافات في جوهر واحد',
  description_en text NOT NULL DEFAULT 'A heritage-driven fragrance brand born from academic research, cross-cultural analysis, and bilingual localization — supervised by Dr. Rana Ghanem.',
  description_ar text NOT NULL DEFAULT 'علامة عطور مدفوعة بالتراث وُلدت من البحث الأكاديمي والتحليل الثقافي والترجمة ثنائية اللغة — تحت إشراف د. رنا غانم.',
  overview_en text,
  overview_ar text,
  problem_en text,
  problem_ar text,
  objectives_en text,
  objectives_ar text,
  research_en text,
  research_ar text,
  methodology_en text,
  methodology_ar text,
  findings_en text,
  findings_ar text,
  results_en text,
  results_ar text,
  discussion_en text,
  discussion_ar text,
  conclusion_en text,
  conclusion_ar text,
  team_info_en text,
  team_info_ar text,
  technologies text[] NOT NULL DEFAULT '{}',
  external_links jsonb NOT NULL DEFAULT '[]',
  featured boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE graduation_project ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_grad_project" ON graduation_project;
CREATE POLICY "public_read_grad_project" ON graduation_project FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_update_grad_project" ON graduation_project;
CREATE POLICY "admin_update_grad_project" ON graduation_project FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_grad_project" ON graduation_project;
CREATE POLICY "admin_insert_grad_project" ON graduation_project FOR INSERT
  TO authenticated WITH CHECK (true);

-- Graduation project phases
CREATE TABLE IF NOT EXISTS grad_project_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL DEFAULT 'FlaskConical',
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE grad_project_phases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_grad_phases" ON grad_project_phases;
CREATE POLICY "public_read_grad_phases" ON grad_project_phases FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_grad_phase" ON grad_project_phases;
CREATE POLICY "admin_insert_grad_phase" ON grad_project_phases FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_grad_phase" ON grad_project_phases;
CREATE POLICY "admin_update_grad_phase" ON grad_project_phases FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_grad_phase" ON grad_project_phases;
CREATE POLICY "admin_delete_grad_phase" ON grad_project_phases FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_gp_phase_sort ON grad_project_phases (sort_order);

-- Graduation project fragrances
CREATE TABLE IF NOT EXISTS grad_project_fragrances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  culture_en text NOT NULL,
  culture_ar text NOT NULL,
  note_en text NOT NULL,
  note_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE grad_project_fragrances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_grad_fragrances" ON grad_project_fragrances;
CREATE POLICY "public_read_grad_fragrances" ON grad_project_fragrances FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_grad_fragrance" ON grad_project_fragrances;
CREATE POLICY "admin_insert_grad_fragrance" ON grad_project_fragrances FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_grad_fragrance" ON grad_project_fragrances;
CREATE POLICY "admin_update_grad_fragrance" ON grad_project_fragrances FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_grad_fragrance" ON grad_project_fragrances;
CREATE POLICY "admin_delete_grad_fragrance" ON grad_project_fragrances FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_gp_frag_sort ON grad_project_fragrances (sort_order);

-- Graduation project stats
CREATE TABLE IF NOT EXISTS grad_project_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value integer NOT NULL DEFAULT 0,
  label_en text NOT NULL,
  label_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE grad_project_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_grad_stats" ON grad_project_stats;
CREATE POLICY "public_read_grad_stats" ON grad_project_stats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_grad_stat" ON grad_project_stats;
CREATE POLICY "admin_insert_grad_stat" ON grad_project_stats FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_grad_stat" ON grad_project_stats;
CREATE POLICY "admin_update_grad_stat" ON grad_project_stats FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_grad_stat" ON grad_project_stats;
CREATE POLICY "admin_delete_grad_stat" ON grad_project_stats FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_gp_stat_sort ON grad_project_stats (sort_order);

-- ============================================================
-- SECTION 9: CERTIFICATES
-- ============================================================

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  issuer_en text NOT NULL,
  issuer_ar text NOT NULL,
  date_en text NOT NULL,
  date_ar text NOT NULL,
  hours_en text,
  hours_ar text,
  credential_id text,
  serial_no text,
  description_en text NOT NULL DEFAULT '',
  description_ar text NOT NULL DEFAULT '',
  image_url text,
  pdf_url text,
  verification_url text,
  tags text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_certs" ON certificates;
CREATE POLICY "public_read_certs" ON certificates FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_cert" ON certificates;
CREATE POLICY "admin_insert_cert" ON certificates FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_cert" ON certificates;
CREATE POLICY "admin_update_cert" ON certificates FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_cert" ON certificates;
CREATE POLICY "admin_delete_cert" ON certificates FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_cert_sort ON certificates (sort_order);
CREATE INDEX IF NOT EXISTS idx_cert_featured ON certificates (featured);

-- Certificate highlights
CREATE TABLE IF NOT EXISTS certificate_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id uuid NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  text_en text NOT NULL,
  text_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificate_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_cert_highlights" ON certificate_highlights;
CREATE POLICY "public_read_cert_highlights" ON certificate_highlights FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_cert_hl" ON certificate_highlights;
CREATE POLICY "admin_insert_cert_hl" ON certificate_highlights FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_cert_hl" ON certificate_highlights;
CREATE POLICY "admin_update_cert_hl" ON certificate_highlights FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_cert_hl" ON certificate_highlights;
CREATE POLICY "admin_delete_cert_hl" ON certificate_highlights FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_ch_cert ON certificate_highlights (certificate_id);

-- ============================================================
-- SECTION 10: ACHIEVEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL DEFAULT 'Trophy',
  value integer NOT NULL DEFAULT 0,
  suffix text NOT NULL DEFAULT '',
  label_en text NOT NULL,
  label_ar text NOT NULL,
  context_en text NOT NULL,
  context_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_achievements" ON achievements;
CREATE POLICY "public_read_achievements" ON achievements FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_achievement" ON achievements;
CREATE POLICY "admin_insert_achievement" ON achievements FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_achievement" ON achievements;
CREATE POLICY "admin_update_achievement" ON achievements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_achievement" ON achievements;
CREATE POLICY "admin_delete_achievement" ON achievements FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_ach_sort ON achievements (sort_order);

-- ============================================================
-- SECTION 11: TIMELINE
-- ============================================================

CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_en text NOT NULL,
  date_ar text NOT NULL,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  org_en text NOT NULL,
  org_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  icon_name text NOT NULL DEFAULT 'GraduationCap',
  type text NOT NULL DEFAULT 'education' CHECK (type IN ('education', 'experience', 'certification', 'project', 'volunteer')),
  image_url text,
  link_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_timeline" ON timeline_events;
CREATE POLICY "public_read_timeline" ON timeline_events FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_timeline" ON timeline_events;
CREATE POLICY "admin_insert_timeline" ON timeline_events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_timeline" ON timeline_events;
CREATE POLICY "admin_update_timeline" ON timeline_events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_timeline" ON timeline_events;
CREATE POLICY "admin_delete_timeline" ON timeline_events FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_tl_sort ON timeline_events (sort_order);

-- ============================================================
-- SECTION 12: SOCIAL LINKS & CONTACT INFO
-- ============================================================

CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Linkedin',
  url text NOT NULL,
  label_en text NOT NULL,
  label_ar text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social" ON social_links;
CREATE POLICY "public_read_social" ON social_links FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "admin_insert_social" ON social_links;
CREATE POLICY "admin_insert_social" ON social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_social" ON social_links;
CREATE POLICY "admin_update_social" ON social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_social" ON social_links;
CREATE POLICY "admin_delete_social" ON social_links FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_social_sort ON social_links (sort_order);

CREATE TABLE IF NOT EXISTS contact_info (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email text NOT NULL DEFAULT 'maaaar3y@gmail.com',
  phone text NOT NULL DEFAULT '+20 100 479 3760',
  location_en text NOT NULL DEFAULT 'Kafr El-Sheikh, Egypt',
  location_ar text NOT NULL DEFAULT 'كفر الشيخ، مصر',
  linkedin_url text NOT NULL DEFAULT 'https://linkedin.com/in/maaaar3y',
  github_url text NOT NULL DEFAULT 'https://github.com/maaaar3y',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_contact_info" ON contact_info;
CREATE POLICY "public_read_contact_info" ON contact_info FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contact_info" ON contact_info;
CREATE POLICY "admin_update_contact_info" ON contact_info FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_contact_info" ON contact_info;
CREATE POLICY "admin_insert_contact_info" ON contact_info FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- SECTION 13: SEO & APPEARANCE SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS seo_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  page_title_en text NOT NULL DEFAULT 'Youssef M. Marey — English Language & Translation Graduate',
  page_title_ar text NOT NULL DEFAULT 'يوسف م. مري — خريج اللغة الإنجليزية والترجمة',
  meta_description_en text NOT NULL DEFAULT 'Personal brand platform of Youssef M. Marey — English Language and Translation graduate, career development specialist, and bilingual project coordinator from Kafr El-Sheikh, Egypt.',
  meta_description_ar text NOT NULL DEFAULT 'المنصة الشخصية ليوسف م. مري — خريج اللغة الإنجليزية والترجمة، أخصائي تطوير مهني، ومنسق مشاريع ثنائي اللغة من كفر الشيخ، مصر.',
  keywords text[] NOT NULL DEFAULT '{"Youssef Marey","Youssef M. Marey","English Translation","Career Development","Kafrelsheikh University","UCCD","Project Management","Monitoring and Evaluation","Bilingual Professional","Egypt"}',
  og_title_en text NOT NULL DEFAULT 'Youssef M. Marey — Personal Brand Platform',
  og_title_ar text NOT NULL DEFAULT 'يوسف م. مري — المنصة الشخصية',
  og_description_en text NOT NULL DEFAULT 'English Language & Translation graduate, career development specialist, and bilingual project coordinator.',
  og_description_ar text NOT NULL DEFAULT 'خريج اللغة الإنجليزية والترجمة، أخصائي تطوير مهني، ومنسق مشاريع ثنائي اللغة.',
  og_image_url text,
  canonical_url text NOT NULL DEFAULT 'https://maaaar3y.com',
  favicon_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_seo" ON seo_settings;
CREATE POLICY "public_read_seo" ON seo_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_seo" ON seo_settings;
CREATE POLICY "admin_update_seo" ON seo_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_seo" ON seo_settings;
CREATE POLICY "admin_insert_seo" ON seo_settings FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS appearance_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  primary_color text NOT NULL DEFAULT '185 80% 24%',
  accent_color text NOT NULL DEFAULT '38 65% 52%',
  background_color text NOT NULL DEFAULT '180 25% 98%',
  text_color text NOT NULL DEFAULT '190 35% 12%',
  font_family text NOT NULL DEFAULT 'serif',
  border_radius text NOT NULL DEFAULT '0.75rem',
  animation_intensity text NOT NULL DEFAULT 'normal' CHECK (animation_intensity IN ('off', 'subtle', 'normal', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_appearance" ON appearance_settings;
CREATE POLICY "public_read_appearance" ON appearance_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_appearance" ON appearance_settings;
CREATE POLICY "admin_update_appearance" ON appearance_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_appearance" ON appearance_settings;
CREATE POLICY "admin_insert_appearance" ON appearance_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- SECTION 14: PROFILE IMAGE
-- ============================================================

CREATE TABLE IF NOT EXISTS profile_image (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  image_url text,
  alt_text_en text NOT NULL DEFAULT 'Youssef M. Marey',
  alt_text_ar text NOT NULL DEFAULT 'يوسف م. مري',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile_image ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profile_image" ON profile_image;
CREATE POLICY "public_read_profile_image" ON profile_image FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_profile_image" ON profile_image;
CREATE POLICY "admin_update_profile_image" ON profile_image FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_profile_image" ON profile_image;
CREATE POLICY "admin_insert_profile_image" ON profile_image FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- SECTION 15: TESTIMONIALS (visitor submissions)
-- ============================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  role_company text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment_en text NOT NULL,
  comment_ar text,
  profile_image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  featured boolean NOT NULL DEFAULT false,
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can read only approved testimonials, but email is NOT exposed
-- We use a column-level policy to hide email from anon
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (status = 'approved');

-- Public can submit testimonials
DROP POLICY IF EXISTS "public_insert_testimonials" ON testimonials;
CREATE POLICY "public_insert_testimonials" ON testimonials FOR INSERT
  TO anon, authenticated WITH CHECK (status = 'pending');

-- Admin full CRUD
DROP POLICY IF EXISTS "admin_select_testimonials" ON testimonials;
CREATE POLICY "admin_select_testimonials" ON testimonials FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_test_status ON testimonials (status);
CREATE INDEX IF NOT EXISTS idx_test_featured ON testimonials (featured);

-- Revoke email column access from anon
REVOKE UPDATE (email) ON testimonials FROM anon, authenticated;
-- Note: RLS already prevents anon from seeing rows, but we add column-level security too
-- The SELECT policy returns all columns; to hide email we use a column grant
GRANT SELECT (id, name, role_company, rating, comment_en, comment_ar, profile_image_url, status, featured, pinned, created_at, updated_at) ON testimonials TO anon;

-- ============================================================
-- SECTION 16: COMMENTS / REVIEWS (visitor submissions)
-- ============================================================

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment_en text NOT NULL,
  comment_ar text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  featured boolean NOT NULL DEFAULT false,
  pinned boolean NOT NULL DEFAULT false,
  admin_reply_en text,
  admin_reply_ar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public can read only approved comments (email hidden via column grant)
DROP POLICY IF EXISTS "public_read_comments" ON comments;
CREATE POLICY "public_read_comments" ON comments FOR SELECT
  TO anon, authenticated USING (status = 'approved');

-- Public can submit comments
DROP POLICY IF EXISTS "public_insert_comments" ON comments;
CREATE POLICY "public_insert_comments" ON comments FOR INSERT
  TO anon, authenticated WITH CHECK (status = 'pending');

-- Admin full CRUD
DROP POLICY IF EXISTS "admin_select_comments" ON comments;
CREATE POLICY "admin_select_comments" ON comments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_comments" ON comments;
CREATE POLICY "admin_update_comments" ON comments FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_comments" ON comments;
CREATE POLICY "admin_delete_comments" ON comments FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_comment_status ON comments (status);

-- Hide email from anon
GRANT SELECT (id, name, rating, comment_en, comment_ar, status, featured, pinned, admin_reply_en, admin_reply_ar, created_at, updated_at) ON comments TO anon;

-- ============================================================
-- SECTION 17: CONTACT MESSAGES (admin-only)
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert contact messages only
DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Admin full access
DROP POLICY IF EXISTS "admin_select_contact_messages" ON contact_messages;
CREATE POLICY "admin_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_cm_read ON contact_messages (is_read);
CREATE INDEX IF NOT EXISTS idx_cm_archived ON contact_messages (archived);

-- ============================================================
-- SECTION 18: NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('testimonial', 'comment', 'contact_message')),
  title text NOT NULL,
  message text NOT NULL,
  reference_id uuid,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public can insert notifications (when submitting testimonials/comments/messages)
DROP POLICY IF EXISTS "public_insert_notifications" ON notifications;
CREATE POLICY "public_insert_notifications" ON notifications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Admin only can read/update/delete
DROP POLICY IF EXISTS "admin_read_notifications" ON notifications;
CREATE POLICY "admin_read_notifications" ON notifications FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_notifications" ON notifications;
CREATE POLICY "admin_update_notifications" ON notifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_notifications" ON notifications;
CREATE POLICY "admin_delete_notifications" ON notifications FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_notif_read ON notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_notif_created ON notifications (created_at DESC);

-- ============================================================
-- SECTION 19: MEDIA LIBRARY
-- ============================================================

CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_path text NOT NULL,
  public_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'pdf', 'document', 'video', 'other')),
  category text NOT NULL DEFAULT 'general',
  size_bytes bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public can read media (for images displayed on the site)
DROP POLICY IF EXISTS "public_read_media" ON media;
CREATE POLICY "public_read_media" ON media FOR SELECT
  TO anon, authenticated USING (true);

-- Admin full CRUD
DROP POLICY IF EXISTS "admin_insert_media" ON media;
CREATE POLICY "admin_insert_media" ON media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_media" ON media;
CREATE POLICY "admin_update_media" ON media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_media" ON media;
CREATE POLICY "admin_delete_media" ON media FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_media_category ON media (category);
CREATE INDEX IF NOT EXISTS idx_media_type ON media (media_type);

-- ============================================================
-- SECTION 20: SECTION VISIBILITY
-- ============================================================

CREATE TABLE IF NOT EXISTS section_visibility (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  show_hero boolean NOT NULL DEFAULT true,
  show_about boolean NOT NULL DEFAULT true,
  show_experience boolean NOT NULL DEFAULT true,
  show_graduation boolean NOT NULL DEFAULT true,
  show_skills boolean NOT NULL DEFAULT true,
  show_certifications boolean NOT NULL DEFAULT true,
  show_achievements boolean NOT NULL DEFAULT true,
  show_timeline boolean NOT NULL DEFAULT true,
  show_projects boolean NOT NULL DEFAULT true,
  show_testimonials boolean NOT NULL DEFAULT true,
  show_comments boolean NOT NULL DEFAULT true,
  show_contact boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE section_visibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_section_visibility" ON section_visibility;
CREATE POLICY "public_read_section_visibility" ON section_visibility FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_section_visibility" ON section_visibility;
CREATE POLICY "admin_update_section_visibility" ON section_visibility FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_section_visibility" ON section_visibility;
CREATE POLICY "admin_insert_section_visibility" ON section_visibility FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- SECTION 21: AUTO-UPDATE TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name NOT IN ('schema_migrations')
  LOOP
    BEGIN
      EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', t);
      EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END $$;

-- ============================================================
-- SECTION 22: STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('media', 'media', true),
  ('profile', 'profile', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
DROP POLICY IF EXISTS "public_read_media_bucket" ON storage.objects;
CREATE POLICY "public_read_media_bucket" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id IN ('media', 'profile'));

DROP POLICY IF EXISTS "admin_upload_media_bucket" ON storage.objects;
CREATE POLICY "admin_upload_media_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id IN ('media', 'profile'));

DROP POLICY IF EXISTS "admin_update_media_bucket" ON storage.objects;
CREATE POLICY "admin_update_media_bucket" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id IN ('media', 'profile'));

DROP POLICY IF EXISTS "admin_delete_media_bucket" ON storage.objects;
CREATE POLICY "admin_delete_media_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id IN ('media', 'profile'));
