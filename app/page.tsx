import { AuroraBackground } from '@/components/background/aurora';
import { Navbar } from '@/components/site/navbar';
import { Hero } from '@/components/site/hero';
import { About } from '@/components/site/about';
import { Experience } from '@/components/site/experience';
import { GraduationProject } from '@/components/site/graduation-project';
import { Skills } from '@/components/site/skills';
import { Certifications } from '@/components/site/certifications';
import { Achievements } from '@/components/site/achievements';
import { Timeline } from '@/components/site/timeline';
import { Contact } from '@/components/site/contact';
import { Footer } from '@/components/site/footer';
import { fetchPublicContent, type PublicContent } from '@/lib/supabase/server-data';

export default async function Home() {
  let content: PublicContent | null = null;
  try {
    content = await fetchPublicContent();
  } catch {
    content = null;
  }

  const sv = content?.sectionVisibility;

  return (
    <>
      <AuroraBackground />
      <Navbar navItems={content?.navItems ?? []} siteSettings={content?.siteSettings ?? null} />
      <main className="relative">
        {(!sv || sv.show_hero) && <Hero content={content?.heroContent ?? null} stats={content?.heroStats ?? []} siteSettings={content?.siteSettings ?? null} socialLinks={content?.socialLinks ?? []} />}
        {(!sv || sv.show_about) && <About content={content?.aboutContent ?? null} values={content?.aboutValues ?? []} />}
        {(!sv || sv.show_experience) && <Experience experiences={content?.experiences ?? []} />}
        {(!sv || sv.show_graduation) && <GraduationProject content={content?.gradProject ?? null} phases={content?.gradPhases ?? []} fragrances={content?.gradFragrances ?? []} stats={content?.gradStats ?? []} />}
        {(!sv || sv.show_skills) && <Skills categories={content?.skillCategories ?? []} />}
        {(!sv || sv.show_certifications) && <Certifications certificates={content?.certificates ?? []} />}
        {(!sv || sv.show_achievements) && <Achievements achievements={content?.achievements ?? []} />}
        {(!sv || sv.show_timeline) && <Timeline events={content?.timelineEvents ?? []} />}
        {(!sv || sv.show_contact) && <Contact contactInfo={content?.contactInfo ?? null} socialLinks={content?.socialLinks ?? []} />}
      </main>
      <Footer siteSettings={content?.siteSettings ?? null} navItems={content?.navItems ?? []} socialLinks={content?.socialLinks ?? []} contactInfo={content?.contactInfo ?? null} />
    </>
  );
}
