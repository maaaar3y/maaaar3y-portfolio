export interface SiteSettings {
  id: number;
  owner_name_en: string;
  owner_name_ar: string;
  site_title_en: string;
  site_title_ar: string;
  tagline_en: string;
  tagline_ar: string;
  description_en: string;
  description_ar: string;
  location_en: string;
  location_ar: string;
  available_for_opportunities: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label_en: string;
  label_ar: string;
  section_id: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  id: number;
  badge_text_en: string;
  badge_text_ar: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  description_en: string;
  description_ar: string;
  cta_work_en: string;
  cta_work_ar: string;
  cta_contact_en: string;
  cta_contact_ar: string;
  created_at: string;
  updated_at: string;
}

export interface HeroStat {
  id: string;
  value: string;
  suffix: string;
  label_en: string;
  label_ar: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: number;
  eyebrow_en: string;
  eyebrow_ar: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  summary_en: string;
  summary_ar: string;
  summary_detail_en: string;
  summary_detail_ar: string;
  mission_en: string;
  mission_ar: string;
  vision_en: string;
  vision_ar: string;
  philosophy_en: string;
  philosophy_ar: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AboutValue {
  id: string;
  icon_name: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  role_en: string;
  role_ar: string;
  org_en: string;
  org_ar: string;
  collaboration_en: string | null;
  collaboration_ar: string | null;
  period_en: string;
  period_ar: string;
  location_en: string;
  location_ar: string;
  summary_en: string;
  summary_ar: string;
  tags: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExperienceHighlight {
  id: string;
  experience_id: string;
  icon_name: string;
  text_en: string;
  text_ar: string;
  sort_order: number;
  created_at: string;
}

export interface Education {
  id: string;
  degree_en: string;
  degree_ar: string;
  institution_en: string;
  institution_ar: string;
  period_en: string;
  period_ar: string;
  description_en: string;
  description_ar: string;
  gpa: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillCategory {
  id: string;
  icon_name: string;
  title_en: string;
  title_ar: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  category_id: string;
  name_en: string;
  name_ar: string;
  level: number;
  description_en: string;
  description_ar: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category_en: string;
  category_ar: string;
  technologies: string[];
  main_image_url: string | null;
  video_url: string | null;
  live_url: string | null;
  github_url: string | null;
  external_links: { url: string; label: string }[];
  start_date: string | null;
  end_date: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  media_type: string;
  url: string;
  caption_en: string | null;
  caption_ar: string | null;
  sort_order: number;
  created_at: string;
}

export interface GraduationProject {
  id: number;
  eyebrow_en: string;
  eyebrow_ar: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  overview_en: string | null;
  overview_ar: string | null;
  problem_en: string | null;
  problem_ar: string | null;
  objectives_en: string | null;
  objectives_ar: string | null;
  research_en: string | null;
  research_ar: string | null;
  methodology_en: string | null;
  methodology_ar: string | null;
  findings_en: string | null;
  findings_ar: string | null;
  results_en: string | null;
  results_ar: string | null;
  discussion_en: string | null;
  discussion_ar: string | null;
  conclusion_en: string | null;
  conclusion_ar: string | null;
  team_info_en: string | null;
  team_info_ar: string | null;
  technologies: string[];
  external_links: { url: string; label: string }[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GradProjectPhase {
  id: string;
  icon_name: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GradProjectFragrance {
  id: string;
  name_en: string;
  name_ar: string;
  culture_en: string;
  culture_ar: string;
  note_en: string;
  note_ar: string;
  sort_order: number;
  created_at: string;
}

export interface GradProjectStat {
  id: string;
  value: number;
  label_en: string;
  label_ar: string;
  sort_order: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  title_en: string;
  title_ar: string;
  issuer_en: string;
  issuer_ar: string;
  date_en: string;
  date_ar: string;
  hours_en: string | null;
  hours_ar: string | null;
  credential_id: string | null;
  serial_no: string | null;
  description_en: string;
  description_ar: string;
  image_url: string | null;
  pdf_url: string | null;
  verification_url: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CertificateHighlight {
  id: string;
  certificate_id: string;
  text_en: string;
  text_ar: string;
  sort_order: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  icon_name: string;
  value: number;
  suffix: string;
  label_en: string;
  label_ar: string;
  context_en: string;
  context_ar: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  date_en: string;
  date_ar: string;
  title_en: string;
  title_ar: string;
  org_en: string;
  org_ar: string;
  description_en: string;
  description_ar: string;
  icon_name: string;
  type: 'education' | 'experience' | 'certification' | 'project' | 'volunteer';
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  icon_name: string;
  url: string;
  label_en: string;
  label_ar: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  email: string;
  phone: string;
  location_en: string;
  location_ar: string;
  linkedin_url: string;
  github_url: string;
  created_at: string;
  updated_at: string;
}

export interface SeoSettings {
  id: number;
  page_title_en: string;
  page_title_ar: string;
  meta_description_en: string;
  meta_description_ar: string;
  keywords: string[];
  og_title_en: string;
  og_title_ar: string;
  og_description_en: string;
  og_description_ar: string;
  og_image_url: string | null;
  canonical_url: string;
  favicon_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppearanceSettings {
  id: number;
  primary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  border_radius: string;
  animation_intensity: 'off' | 'subtle' | 'normal' | 'high';
  created_at: string;
  updated_at: string;
}

export interface ProfileImage {
  id: number;
  image_url: string | null;
  alt_text_en: string;
  alt_text_ar: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  email: string;
  role_company: string | null;
  rating: number;
  comment_en: string;
  comment_ar: string | null;
  profile_image_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  featured: boolean;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment_en: string;
  comment_ar: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  featured: boolean;
  pinned: boolean;
  admin_reply_en: string | null;
  admin_reply_ar: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  type: 'testimonial' | 'comment' | 'contact_message';
  title: string;
  message: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  file_path: string;
  public_url: string;
  media_type: 'image' | 'pdf' | 'document' | 'video' | 'other';
  category: string;
  size_bytes: number;
  created_at: string;
  updated_at: string;
}

export interface SectionVisibility {
  id: number;
  show_hero: boolean;
  show_about: boolean;
  show_experience: boolean;
  show_graduation: boolean;
  show_skills: boolean;
  show_certifications: boolean;
  show_achievements: boolean;
  show_timeline: boolean;
  show_projects: boolean;
  show_testimonials: boolean;
  show_comments: boolean;
  show_contact: boolean;
  created_at: string;
  updated_at: string;
}

export type Locale = 'en' | 'ar';

export function localized<T extends Record<string, unknown>>(
  item: T,
  locale: Locale,
  field: string
): string {
  const key = `${field}_${locale}` as keyof T;
  return (item[key] as string) ?? (item[`${field}_en` as keyof T] as string) ?? '';
}
