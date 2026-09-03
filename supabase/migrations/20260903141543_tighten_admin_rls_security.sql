/*
# Tighten Admin RLS Security

## Purpose
Previously, all admin write policies (INSERT/UPDATE/DELETE) used `USING (true)` / `WITH CHECK (true)`
scoped to `TO authenticated`, meaning ANY authenticated Supabase user could modify all CMS data.
This migration locks down admin write operations to a single designated admin user.

## Changes

### 1. New column
- `site_settings.admin_email` (text, nullable) — stores the email of the designated admin user.
  When NULL, no one can perform admin writes (secure default).

### 2. New helper function
- `public.is_admin()` — SECURITY DEFINER function that checks whether the current
  authenticated user's JWT email matches `site_settings.admin_email`.
  Returns true only if there is a match; false otherwise.

### 3. RLS policy replacements (all admin write policies)
Every admin INSERT, UPDATE, and DELETE policy across all CMS tables is replaced:
- INSERT policies: `WITH CHECK (is_admin())` instead of `WITH CHECK (true)`
- UPDATE policies: `USING (is_admin()) WITH CHECK (is_admin())` instead of `true`
- DELETE policies: `USING (is_admin())` instead of `true`

### 4. Unchanged policies
- All public SELECT policies remain unchanged (anon + authenticated can read published content).
- Public INSERT policies for contact_messages, comments, testimonials, and notifications
  remain unchanged (public submissions with status = 'pending').

### 5. Security notes
1. The admin_email column is NULL by default — no one can write until it is set.
2. To set it: create a user in Supabase Auth, then run:
   UPDATE site_settings SET admin_email = 'your-email@example.com' WHERE id = 1;
3. The is_admin() function is SECURITY DEFINER so it can read site_settings regardless
   of the caller's RLS context, with a fixed search_path to prevent injection.
*/

-- ============================================================
-- STEP 1: Add admin_email column to site_settings
-- ============================================================
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS admin_email text;

-- ============================================================
-- STEP 2: Create is_admin() helper function
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM site_settings
    WHERE admin_email IS NOT NULL
    AND admin_email = auth.jwt() ->> 'email'
  );
$$;

-- ============================================================
-- STEP 3: Replace all admin write policies
-- ============================================================

-- site_settings
DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (is_admin());

-- navigation_items
DROP POLICY IF EXISTS "admin_insert_nav" ON navigation_items;
CREATE POLICY "admin_insert_nav" ON navigation_items FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_nav" ON navigation_items;
CREATE POLICY "admin_update_nav" ON navigation_items FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_nav" ON navigation_items;
CREATE POLICY "admin_delete_nav" ON navigation_items FOR DELETE
  TO authenticated USING (is_admin());

-- hero_content
DROP POLICY IF EXISTS "admin_update_hero" ON hero_content;
CREATE POLICY "admin_update_hero" ON hero_content FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_insert_hero" ON hero_content;
CREATE POLICY "admin_insert_hero" ON hero_content FOR INSERT
  TO authenticated WITH CHECK (is_admin());

-- hero_stats
DROP POLICY IF EXISTS "admin_insert_hero_stat" ON hero_stats;
CREATE POLICY "admin_insert_hero_stat" ON hero_stats FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_hero_stat" ON hero_stats;
CREATE POLICY "admin_update_hero_stat" ON hero_stats FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_hero_stat" ON hero_stats;
CREATE POLICY "admin_delete_hero_stat" ON hero_stats FOR DELETE
  TO authenticated USING (is_admin());

-- about_content
DROP POLICY IF EXISTS "admin_update_about" ON about_content;
CREATE POLICY "admin_update_about" ON about_content FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_insert_about" ON about_content;
CREATE POLICY "admin_insert_about" ON about_content FOR INSERT
  TO authenticated WITH CHECK (is_admin());

-- about_values
DROP POLICY IF EXISTS "admin_insert_value" ON about_values;
CREATE POLICY "admin_insert_value" ON about_values FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_value" ON about_values;
CREATE POLICY "admin_update_value" ON about_values FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_value" ON about_values;
CREATE POLICY "admin_delete_value" ON about_values FOR DELETE
  TO authenticated USING (is_admin());

-- experiences
DROP POLICY IF EXISTS "admin_insert_experience" ON experiences;
CREATE POLICY "admin_insert_experience" ON experiences FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_experience" ON experiences;
CREATE POLICY "admin_update_experience" ON experiences FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_experience" ON experiences;
CREATE POLICY "admin_delete_experience" ON experiences FOR DELETE
  TO authenticated USING (is_admin());

-- experience_highlights
DROP POLICY IF EXISTS "admin_insert_exp_highlight" ON experience_highlights;
CREATE POLICY "admin_insert_exp_highlight" ON experience_highlights FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_exp_highlight" ON experience_highlights;
CREATE POLICY "admin_update_exp_highlight" ON experience_highlights FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_exp_highlight" ON experience_highlights;
CREATE POLICY "admin_delete_exp_highlight" ON experience_highlights FOR DELETE
  TO authenticated USING (is_admin());

-- education
DROP POLICY IF EXISTS "admin_insert_education" ON education;
CREATE POLICY "admin_insert_education" ON education FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_education" ON education;
CREATE POLICY "admin_update_education" ON education FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_education" ON education;
CREATE POLICY "admin_delete_education" ON education FOR DELETE
  TO authenticated USING (is_admin());

-- skill_categories
DROP POLICY IF EXISTS "admin_insert_skill_cat" ON skill_categories;
CREATE POLICY "admin_insert_skill_cat" ON skill_categories FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_skill_cat" ON skill_categories;
CREATE POLICY "admin_update_skill_cat" ON skill_categories FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_skill_cat" ON skill_categories;
CREATE POLICY "admin_delete_skill_cat" ON skill_categories FOR DELETE
  TO authenticated USING (is_admin());

-- skills
DROP POLICY IF EXISTS "admin_insert_skill" ON skills;
CREATE POLICY "admin_insert_skill" ON skills FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_skill" ON skills;
CREATE POLICY "admin_update_skill" ON skills FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_skill" ON skills;
CREATE POLICY "admin_delete_skill" ON skills FOR DELETE
  TO authenticated USING (is_admin());

-- projects
DROP POLICY IF EXISTS "admin_insert_project" ON projects;
CREATE POLICY "admin_insert_project" ON projects FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_project" ON projects;
CREATE POLICY "admin_update_project" ON projects FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_project" ON projects;
CREATE POLICY "admin_delete_project" ON projects FOR DELETE
  TO authenticated USING (is_admin());

-- project_media
DROP POLICY IF EXISTS "admin_insert_project_media" ON project_media;
CREATE POLICY "admin_insert_project_media" ON project_media FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_project_media" ON project_media;
CREATE POLICY "admin_update_project_media" ON project_media FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_project_media" ON project_media;
CREATE POLICY "admin_delete_project_media" ON project_media FOR DELETE
  TO authenticated USING (is_admin());

-- graduation_project
DROP POLICY IF EXISTS "admin_insert_grad_project" ON graduation_project;
CREATE POLICY "admin_insert_grad_project" ON graduation_project FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_grad_project" ON graduation_project;
CREATE POLICY "admin_update_grad_project" ON graduation_project FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- grad_project_phases
DROP POLICY IF EXISTS "admin_insert_grad_phase" ON grad_project_phases;
CREATE POLICY "admin_insert_grad_phase" ON grad_project_phases FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_grad_phase" ON grad_project_phases;
CREATE POLICY "admin_update_grad_phase" ON grad_project_phases FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_grad_phase" ON grad_project_phases;
CREATE POLICY "admin_delete_grad_phase" ON grad_project_phases FOR DELETE
  TO authenticated USING (is_admin());

-- grad_project_fragrances
DROP POLICY IF EXISTS "admin_insert_grad_fragrance" ON grad_project_fragrances;
CREATE POLICY "admin_insert_grad_fragrance" ON grad_project_fragrances FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_grad_fragrance" ON grad_project_fragrances;
CREATE POLICY "admin_update_grad_fragrance" ON grad_project_fragrances FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_grad_fragrance" ON grad_project_fragrances;
CREATE POLICY "admin_delete_grad_fragrance" ON grad_project_fragrances FOR DELETE
  TO authenticated USING (is_admin());

-- grad_project_stats
DROP POLICY IF EXISTS "admin_insert_grad_stat" ON grad_project_stats;
CREATE POLICY "admin_insert_grad_stat" ON grad_project_stats FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_grad_stat" ON grad_project_stats;
CREATE POLICY "admin_update_grad_stat" ON grad_project_stats FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_grad_stat" ON grad_project_stats;
CREATE POLICY "admin_delete_grad_stat" ON grad_project_stats FOR DELETE
  TO authenticated USING (is_admin());

-- certificates
DROP POLICY IF EXISTS "admin_insert_cert" ON certificates;
CREATE POLICY "admin_insert_cert" ON certificates FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_cert" ON certificates;
CREATE POLICY "admin_update_cert" ON certificates FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_cert" ON certificates;
CREATE POLICY "admin_delete_cert" ON certificates FOR DELETE
  TO authenticated USING (is_admin());

-- certificate_highlights
DROP POLICY IF EXISTS "admin_insert_cert_hl" ON certificate_highlights;
CREATE POLICY "admin_insert_cert_hl" ON certificate_highlights FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_cert_hl" ON certificate_highlights;
CREATE POLICY "admin_update_cert_hl" ON certificate_highlights FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_cert_hl" ON certificate_highlights;
CREATE POLICY "admin_delete_cert_hl" ON certificate_highlights FOR DELETE
  TO authenticated USING (is_admin());

-- achievements
DROP POLICY IF EXISTS "admin_insert_achievement" ON achievements;
CREATE POLICY "admin_insert_achievement" ON achievements FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_achievement" ON achievements;
CREATE POLICY "admin_update_achievement" ON achievements FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_achievement" ON achievements;
CREATE POLICY "admin_delete_achievement" ON achievements FOR DELETE
  TO authenticated USING (is_admin());

-- timeline_events
DROP POLICY IF EXISTS "admin_insert_timeline" ON timeline_events;
CREATE POLICY "admin_insert_timeline" ON timeline_events FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_timeline" ON timeline_events;
CREATE POLICY "admin_update_timeline" ON timeline_events FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_timeline" ON timeline_events;
CREATE POLICY "admin_delete_timeline" ON timeline_events FOR DELETE
  TO authenticated USING (is_admin());

-- social_links
DROP POLICY IF EXISTS "admin_insert_social" ON social_links;
CREATE POLICY "admin_insert_social" ON social_links FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_social" ON social_links;
CREATE POLICY "admin_update_social" ON social_links FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_social" ON social_links;
CREATE POLICY "admin_delete_social" ON social_links FOR DELETE
  TO authenticated USING (is_admin());

-- contact_info
DROP POLICY IF EXISTS "admin_insert_contact_info" ON contact_info;
CREATE POLICY "admin_insert_contact_info" ON contact_info FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_contact_info" ON contact_info;
CREATE POLICY "admin_update_contact_info" ON contact_info FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- seo_settings
DROP POLICY IF EXISTS "admin_insert_seo" ON seo_settings;
CREATE POLICY "admin_insert_seo" ON seo_settings FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_seo" ON seo_settings;
CREATE POLICY "admin_update_seo" ON seo_settings FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- appearance_settings
DROP POLICY IF EXISTS "admin_insert_appearance" ON appearance_settings;
CREATE POLICY "admin_insert_appearance" ON appearance_settings FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_appearance" ON appearance_settings;
CREATE POLICY "admin_update_appearance" ON appearance_settings FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- section_visibility
DROP POLICY IF EXISTS "admin_insert_section_visibility" ON section_visibility;
CREATE POLICY "admin_insert_section_visibility" ON section_visibility FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_section_visibility" ON section_visibility;
CREATE POLICY "admin_update_section_visibility" ON section_visibility FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- profile_image
DROP POLICY IF EXISTS "admin_insert_profile_image" ON profile_image;
CREATE POLICY "admin_insert_profile_image" ON profile_image FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_profile_image" ON profile_image;
CREATE POLICY "admin_update_profile_image" ON profile_image FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- media
DROP POLICY IF EXISTS "admin_insert_media" ON media;
CREATE POLICY "admin_insert_media" ON media FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_media" ON media;
CREATE POLICY "admin_update_media" ON media FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_media" ON media;
CREATE POLICY "admin_delete_media" ON media FOR DELETE
  TO authenticated USING (is_admin());

-- contact_messages (admin UPDATE/DELETE only; INSERT stays public)
DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (is_admin());

-- comments (admin UPDATE/DELETE only; INSERT stays public)
DROP POLICY IF EXISTS "admin_update_comments" ON comments;
CREATE POLICY "admin_update_comments" ON comments FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_comments" ON comments;
CREATE POLICY "admin_delete_comments" ON comments FOR DELETE
  TO authenticated USING (is_admin());

-- testimonials (admin UPDATE/DELETE only; INSERT stays public)
DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (is_admin());

-- notifications (admin UPDATE/DELETE only; INSERT stays public)
DROP POLICY IF EXISTS "admin_update_notifications" ON notifications;
CREATE POLICY "admin_update_notifications" ON notifications FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_notifications" ON notifications;
CREATE POLICY "admin_delete_notifications" ON notifications FOR DELETE
  TO authenticated USING (is_admin());
