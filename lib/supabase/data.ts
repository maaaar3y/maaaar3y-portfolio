'use client';

import { createBrowserClient } from './client';
import type {
  SiteSettings,
  NavigationItem,
  HeroContent,
  HeroStat,
  AboutContent,
  AboutValue,
  Experience,
  ExperienceHighlight,
  Education,
  SkillCategory,
  Skill,
  Project,
  ProjectMedia,
  GraduationProject,
  GradProjectPhase,
  GradProjectFragrance,
  GradProjectStat,
  Certificate,
  CertificateHighlight,
  Achievement,
  TimelineEvent,
  SocialLink,
  ContactInfo,
  SeoSettings,
  AppearanceSettings,
  ProfileImage,
  Testimonial,
  Comment,
  ContactMessage,
  Notification,
  MediaItem,
  SectionVisibility,
} from './types';

export { createBrowserClient };

export async function fetchSiteSettings() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
  return data as SiteSettings | null;
}

export async function fetchNavigationItems() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('navigation_items')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as NavigationItem[];
}

export async function fetchHeroContent() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('hero_content').select('*').eq('id', 1).maybeSingle();
  return data as HeroContent | null;
}

export async function fetchHeroStats() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('hero_stats')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as HeroStat[];
}

export async function fetchAboutContent() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('about_content').select('*').eq('id', 1).maybeSingle();
  return data as AboutContent | null;
}

export async function fetchAboutValues() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('about_values')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as AboutValue[];
}

export async function fetchExperiences() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('experiences')
    .select('*, highlights:experience_highlights(*)')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as (Experience & { highlights: ExperienceHighlight[] })[];
}

export async function fetchEducation() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('education')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as Education[];
}

export async function fetchSkillCategories() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('skill_categories')
    .select('*, skills(*)')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as (SkillCategory & { skills: Skill[] })[];
}

export async function fetchProjects() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('projects')
    .select('*, media:project_media(*)')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as (Project & { media: ProjectMedia[] })[];
}

export async function fetchGraduationProject() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('graduation_project').select('*').eq('id', 1).maybeSingle();
  return data as GraduationProject | null;
}

export async function fetchGradProjectPhases() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('grad_project_phases')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as GradProjectPhase[];
}

export async function fetchGradProjectFragrances() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('grad_project_fragrances')
    .select('*')
    .order('sort_order');
  return (data ?? []) as GradProjectFragrance[];
}

export async function fetchGradProjectStats() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('grad_project_stats')
    .select('*')
    .order('sort_order');
  return (data ?? []) as GradProjectStat[];
}

export async function fetchCertificates() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('certificates')
    .select('*, highlights:certificate_highlights(*)')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as (Certificate & { highlights: CertificateHighlight[] })[];
}

export async function fetchAchievements() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('achievements')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as Achievement[];
}

export async function fetchTimelineEvents() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as TimelineEvent[];
}

export async function fetchSocialLinks() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('social_links')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  return (data ?? []) as SocialLink[];
}

export async function fetchContactInfo() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('contact_info').select('*').eq('id', 1).maybeSingle();
  return data as ContactInfo | null;
}

export async function fetchSeoSettings() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('seo_settings').select('*').eq('id', 1).maybeSingle();
  return data as SeoSettings | null;
}

export async function fetchAppearanceSettings() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('appearance_settings').select('*').eq('id', 1).maybeSingle();
  return data as AppearanceSettings | null;
}

export async function fetchProfileImage() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('profile_image').select('*').eq('id', 1).maybeSingle();
  return data as ProfileImage | null;
}

export async function fetchSectionVisibility() {
  const supabase = createBrowserClient();
  const { data } = await supabase.from('section_visibility').select('*').eq('id', 1).maybeSingle();
  return data as SectionVisibility | null;
}

export async function fetchApprovedTestimonials() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('testimonials')
    .select('id, name, role_company, rating, comment_en, comment_ar, profile_image_url, status, featured, pinned, created_at, updated_at')
    .eq('status', 'approved')
    .order('pinned', { ascending: false })
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  return (data ?? []) as Omit<Testimonial, 'email'>[];
}

export async function fetchApprovedComments() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('comments')
    .select('id, name, rating, comment_en, comment_ar, status, featured, pinned, admin_reply_en, admin_reply_ar, created_at, updated_at')
    .eq('status', 'approved')
    .order('pinned', { ascending: false })
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  return (data ?? []) as Omit<Comment, 'email'>[];
}

export async function submitTestimonial(input: {
  name: string;
  email: string;
  role_company?: string;
  rating: number;
  comment_en: string;
  comment_ar?: string;
}) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      ...input,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw error;

  if (data) {
    await supabase.from('notifications').insert({
      type: 'testimonial',
      title: 'New testimonial submission',
      message: `${input.name} submitted a testimonial with rating ${input.rating}/5`,
      reference_id: data.id,
      is_read: false,
    });
  }

  return data;
}

export async function submitComment(input: {
  name: string;
  email: string;
  rating: number;
  comment_en: string;
  comment_ar?: string;
}) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('comments')
    .insert({
      ...input,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw error;

  if (data) {
    await supabase.from('notifications').insert({
      type: 'comment',
      title: 'New comment/review submission',
      message: `${input.name} submitted a comment with rating ${input.rating}/5`,
      reference_id: data.id,
      is_read: false,
    });
  }

  return data;
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(input)
    .select('id')
    .single();

  if (error) throw error;

  if (data) {
    await supabase.from('notifications').insert({
      type: 'contact_message',
      title: `New contact message: ${input.subject || 'No subject'}`,
      message: `${input.name} sent a message: ${input.message.slice(0, 100)}...`,
      reference_id: data.id,
      is_read: false,
    });
  }

  return data;
}

export async function fetchAllContent() {
  const [
    siteSettings,
    navItems,
    heroContent,
    heroStats,
    aboutContent,
    aboutValues,
    experiences,
    education,
    skillCategories,
    projects,
    gradProject,
    gradPhases,
    gradFragrances,
    gradStats,
    certificates,
    achievements,
    timelineEvents,
    socialLinks,
    contactInfo,
    sectionVisibility,
  ] = await Promise.all([
    fetchSiteSettings(),
    fetchNavigationItems(),
    fetchHeroContent(),
    fetchHeroStats(),
    fetchAboutContent(),
    fetchAboutValues(),
    fetchExperiences(),
    fetchEducation(),
    fetchSkillCategories(),
    fetchProjects(),
    fetchGraduationProject(),
    fetchGradProjectPhases(),
    fetchGradProjectFragrances(),
    fetchGradProjectStats(),
    fetchCertificates(),
    fetchAchievements(),
    fetchTimelineEvents(),
    fetchSocialLinks(),
    fetchContactInfo(),
    fetchSectionVisibility(),
  ]);

  return {
    siteSettings,
    navItems,
    heroContent,
    heroStats,
    aboutContent,
    aboutValues,
    experiences,
    education,
    skillCategories,
    projects,
    gradProject,
    gradPhases,
    gradFragrances,
    gradStats,
    certificates,
    achievements,
    timelineEvents,
    socialLinks,
    contactInfo,
    sectionVisibility,
  };
}

export type AllContent = Awaited<ReturnType<typeof fetchAllContent>>;
