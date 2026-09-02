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

export default function Home() {
  return (
    <>
      <AuroraBackground />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Experience />
        <GraduationProject />
        <Skills />
        <Certifications />
        <Achievements />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
