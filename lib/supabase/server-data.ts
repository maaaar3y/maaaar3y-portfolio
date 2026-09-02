import { createServerClient } from './server';
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
  SectionVisibility,
} from './types';

export interface PublicContent {
  siteSettings: SiteSettings | null;
  navItems: NavigationItem[];
  heroContent: HeroContent | null;
  heroStats: HeroStat[];
  aboutContent: AboutContent | null;
  aboutValues: AboutValue[];
  experiences: (Experience & { highlights: ExperienceHighlight[] })[];
  education: Education[];
  skillCategories: (SkillCategory & { skills: Skill[] })[];
  projects: (Project & { media: ProjectMedia[] })[];
  gradProject: GraduationProject | null;
  gradPhases: GradProjectPhase[];
  gradFragrances: GradProjectFragrance[];
  gradStats: GradProjectStat[];
  certificates: (Certificate & { highlights: CertificateHighlight[] })[];
  achievements: Achievement[];
  timelineEvents: TimelineEvent[];
  socialLinks: SocialLink[];
  contactInfo: ContactInfo | null;
  seoSettings: SeoSettings | null;
  appearanceSettings: AppearanceSettings | null;
  profileImage: ProfileImage | null;
  sectionVisibility: SectionVisibility | null;
}

export async function fetchPublicContent(): Promise<PublicContent> {
  const supabase = await createServerClient();

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
    seoSettings,
    appearanceSettings,
    profileImage,
    sectionVisibility,
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('navigation_items').select('*').eq('published', true).order('sort_order'),
    supabase.from('hero_content').select('*').eq('id', 1).maybeSingle(),
    supabase.from('hero_stats').select('*').eq('published', true).order('sort_order'),
    supabase.from('about_content').select('*').eq('id', 1).maybeSingle(),
    supabase.from('about_values').select('*').eq('published', true).order('sort_order'),
    supabase.from('experiences').select('*, highlights:experience_highlights(*)').eq('published', true).order('sort_order'),
    supabase.from('education').select('*').eq('published', true).order('sort_order'),
    supabase.from('skill_categories').select('*, skills(*)').eq('published', true).order('sort_order'),
    supabase.from('projects').select('*, media:project_media(*)').eq('published', true).order('sort_order'),
    supabase.from('graduation_project').select('*').eq('id', 1).maybeSingle(),
    supabase.from('grad_project_phases').select('*').eq('published', true).order('sort_order'),
    supabase.from('grad_project_fragrances').select('*').order('sort_order'),
    supabase.from('grad_project_stats').select('*').order('sort_order'),
    supabase.from('certificates').select('*, highlights:certificate_highlights(*)').eq('published', true).order('sort_order'),
    supabase.from('achievements').select('*').eq('published', true).order('sort_order'),
    supabase.from('timeline_events').select('*').eq('published', true).order('sort_order'),
    supabase.from('social_links').select('*').eq('published', true).order('sort_order'),
    supabase.from('contact_info').select('*').eq('id', 1).maybeSingle(),
    supabase.from('seo_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('appearance_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('profile_image').select('*').eq('id', 1).maybeSingle(),
    supabase.from('section_visibility').select('*').eq('id', 1).maybeSingle(),
  ]);

  return {
    siteSettings: siteSettings.data as SiteSettings | null,
    navItems: (navItems.data ?? []) as NavigationItem[],
    heroContent: heroContent.data as HeroContent | null,
    heroStats: (heroStats.data ?? []) as HeroStat[],
    aboutContent: aboutContent.data as AboutContent | null,
    aboutValues: (aboutValues.data ?? []) as AboutValue[],
    experiences: (experiences.data ?? []) as (Experience & { highlights: ExperienceHighlight[] })[],
    education: (education.data ?? []) as Education[],
    skillCategories: (skillCategories.data ?? []) as (SkillCategory & { skills: Skill[] })[],
    projects: (projects.data ?? []) as (Project & { media: ProjectMedia[] })[],
    gradProject: gradProject.data as GraduationProject | null,
    gradPhases: (gradPhases.data ?? []) as GradProjectPhase[],
    gradFragrances: (gradFragrances.data ?? []) as GradProjectFragrance[],
    gradStats: (gradStats.data ?? []) as GradProjectStat[],
    certificates: (certificates.data ?? []) as (Certificate & { highlights: CertificateHighlight[] })[],
    achievements: (achievements.data ?? []) as Achievement[],
    timelineEvents: (timelineEvents.data ?? []) as TimelineEvent[],
    socialLinks: (socialLinks.data ?? []) as SocialLink[],
    contactInfo: contactInfo.data as ContactInfo | null,
    seoSettings: seoSettings.data as SeoSettings | null,
    appearanceSettings: appearanceSettings.data as AppearanceSettings | null,
    profileImage: profileImage.data as ProfileImage | null,
    sectionVisibility: sectionVisibility.data as SectionVisibility | null,
  };
}

export { localized } from './types';
export type { Locale } from './types';
