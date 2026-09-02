/*
# Seed Portfolio Content — Migrate Existing Hardcoded Data

## Overview
Inserts all existing hardcoded portfolio content into the database tables created in the previous migration. This preserves the real portfolio content so the public site looks identical after migration.

## Data Inserted
1. site_settings — owner name, title, tagline, description
2. hero_content — hero section text, CTAs, badge
3. hero_stats — 3 stat cards (GPA, Training Programs, Event Participants)
4. about_content — summary, mission, vision, philosophy
5. about_values — 3 core values (Lifelong Learning, Bilingual Bridge, Community Impact)
6. experiences — 2 volunteer roles (UCCD, Haya Karima)
7. experience_highlights — 6 + 4 highlights for the two experiences
8. education — B.A. in English Language & Translation
9. skill_categories — 4 categories (Office & Data, MEL & Web, Content & Media, Languages)
10. skills — 9 individual skills across categories
11. graduation_project — full case study content
12. grad_project_phases — 6 phases
13. grad_project_fragrances — 3 fragrances (Veloura, Nefer, Rêve)
14. grad_project_stats — 3 stats (87, 3, 3)
15. certificates — 3 certificates (AmCham, Aspire, NTA)
16. certificate_highlights — highlights for each certificate
17. achievements — 6 achievement cards
18. timeline_events — 7 timeline entries
19. social_links — LinkedIn, GitHub, Email
20. contact_info — email, phone, location, links
21. seo_settings — full SEO config
22. appearance_settings — default theme colors
23. profile_image — default (null, will show fallback)
24. navigation_items — 8 nav links
25. section_visibility — all sections visible

## Notes
1. Uses ON CONFLICT DO NOTHING / DO UPDATE for idempotency
2. All content preserves the exact text from the original hardcoded components
3. Arabic translations are provided for navigation and hero; other sections have Arabic translations where available
*/

-- ============================================================
-- SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (id, owner_name_en, owner_name_ar, site_title_en, site_title_ar, tagline_en, tagline_ar, description_en, description_ar, location_en, location_ar, available_for_opportunities)
VALUES (1, 'Youssef M. Marey', 'يوسف م. مري', 'Youssef M. Marey — Personal Brand Platform', 'يوسف م. مري — المنصة الشخصية', 'English Language & Translation Graduate', 'خريج اللغة الإنجليزية والترجمة', 'Personal brand platform of Youssef M. Marey — English Language and Translation graduate, career development specialist, and bilingual project coordinator from Kafr El-Sheikh, Egypt.', 'المنصة الشخصية ليوسف م. مري — خريج اللغة الإنجليزية والترجمة، أخصائي تطوير مهني، ومنسق مشاريع ثنائي اللغة من كفر الشيخ، مصر.', 'Kafr El-Sheikh, Egypt', 'كفر الشيخ، مصر', true)
ON CONFLICT (id) DO UPDATE SET
  owner_name_en = EXCLUDED.owner_name_en,
  owner_name_ar = EXCLUDED.owner_name_ar,
  site_title_en = EXCLUDED.site_title_en,
  site_title_ar = EXCLUDED.site_title_ar,
  tagline_en = EXCLUDED.tagline_en,
  tagline_ar = EXCLUDED.tagline_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  location_en = EXCLUDED.location_en,
  location_ar = EXCLUDED.location_ar,
  available_for_opportunities = EXCLUDED.available_for_opportunities;

-- ============================================================
-- HERO CONTENT
-- ============================================================
INSERT INTO hero_content (id, badge_text_en, badge_text_ar, title_en, title_ar, subtitle_en, subtitle_ar, description_en, description_ar, cta_work_en, cta_work_ar, cta_contact_en, cta_contact_ar)
VALUES (1, 'Available for opportunities', 'متاح للفرص', 'Youssef M. Marey', 'يوسف م. مري', 'English Language & Translation Graduate', 'خريج اللغة الإنجليزية والترجمة', 'career development specialist, bilingual project coordinator, and monitoring & evaluation practitioner from Kafr El-Sheikh, Egypt.', 'أخصائي تطوير مهني، منسق مشاريع ثنائي اللغة، وممارس متابعة وتقييم من كفر الشيخ، مصر.', 'View My Work', 'شاهد أعمالي', 'Get In Touch', 'تواصل معي')
ON CONFLICT (id) DO UPDATE SET
  badge_text_en = EXCLUDED.badge_text_en,
  badge_text_ar = EXCLUDED.badge_text_ar,
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  subtitle_en = EXCLUDED.subtitle_en,
  subtitle_ar = EXCLUDED.subtitle_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  cta_work_en = EXCLUDED.cta_work_en,
  cta_work_ar = EXCLUDED.cta_work_ar,
  cta_contact_en = EXCLUDED.cta_contact_en,
  cta_contact_ar = EXCLUDED.cta_contact_ar;

-- Hero stats
INSERT INTO hero_stats (value, suffix, label_en, label_ar, sort_order, published) VALUES
  ('3.61', '', 'GPA / 4.00', 'المعدل / 4.00', 0, true),
  ('70', '+', 'Training Programs', 'برامج التدريب', 1, true),
  ('1000', '+', 'Event Participants', 'مشاركو الفعاليات', 2, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ABOUT CONTENT
-- ============================================================
INSERT INTO about_content (id, eyebrow_en, eyebrow_ar, title_en, title_ar, description_en, description_ar, summary_en, summary_ar, summary_detail_en, summary_detail_ar, mission_en, mission_ar, vision_en, vision_ar, philosophy_en, philosophy_ar)
VALUES (1, 'About Me', 'نبذة', 'Bridging language, data, and community impact', 'الجسر بين اللغة والبيانات والتأثير المجتمعي', 'A bilingual professional turning academic excellence in translation into hands-on career development, monitoring & evaluation, and project coordination.', 'محترف ثنائي اللغة يحول التميز الأكاديمي في الترجمة إلى تطوير مهني عملي ومتابعة وتقييم وتنسيق مشاريع.', 'English Language and Translation graduate with a GPA of 3.61 / 4.00 and hands-on experience in career development services, IT support, and monitoring & evaluation — gained through sustained volunteer work at Kafrelsheikh University''s Career Development Center (UCCD).', 'خريج اللغة الإنجليزية والترجمة بمعدل تراكمي 3.61 / 4.00 وخبرة عملية في خدمات التطوير المهني ودعم تكنولوجيا المعلومات والمتابعة والتقييم — مكتسبة من خلال العمل التطوعي المستمر في مركز تطوير المسارات المهنية بجامعة كفر الشيخ (UCCD).', 'Accredited training in project management, entrepreneurship, and workplace readiness. Bilingual in Arabic and English, with a track record of coordinating data, content, and cross-functional projects in service-oriented environments. Passionate about building systems that help people grow — whether through training programs, career services, or community outreach.', 'تدريب معتمد في إدارة المشاريع وريادة الأعمال والجاهزية للعمل. ثنائي اللغة (العربية والإنجليزية)، مع سجل حافل في تنسيق البيانات والمحتوى والمشاريع المتعددة التخصصات في بيئات الخدمة. شغوف ببناء أنظمة تساعد الناس على النمو — سواء من خلال برامج التدريب أو الخدمات المهنية أو التواصل المجتمعي.', 'To apply translation, data, and project management skills in roles that create real opportunities for people and communities.', 'تطبيق مهارات الترجمة والبيانات وإدارة المشاريع في أدوار تخلق فرصًا حقيقية للناس والمجتمعات.', 'To become a trusted bilingual professional bridging cultures, organizations, and data-driven decision-making across the Arab region.', 'أن أصبح محترفًا ثنائي اللغة موثوقًا به يعمل كجسر بين الثقافات والمؤسسات واتخاذ القرارات المبنية على البيانات في المنطقة العربية.', 'Quality work creates trust. Trust creates opportunity. Every detail — from a survey report to a social media reel — matters.', 'العمل الجيد يخلق الثقة. والثقة تخلق الفرصة. كل تفصيلة — من تقرير استبيار إلى مقطع على وسائل التواصل — مهمة.')
ON CONFLICT (id) DO UPDATE SET
  eyebrow_en = EXCLUDED.eyebrow_en,
  eyebrow_ar = EXCLUDED.eyebrow_ar,
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  summary_en = EXCLUDED.summary_en,
  summary_ar = EXCLUDED.summary_ar,
  summary_detail_en = EXCLUDED.summary_detail_en,
  summary_detail_ar = EXCLUDED.summary_detail_ar,
  mission_en = EXCLUDED.mission_en,
  mission_ar = EXCLUDED.mission_ar,
  vision_en = EXCLUDED.vision_en,
  vision_ar = EXCLUDED.vision_ar,
  philosophy_en = EXCLUDED.philosophy_en,
  philosophy_ar = EXCLUDED.philosophy_ar;

-- About values
INSERT INTO about_values (icon_name, title_en, title_ar, description_en, description_ar, sort_order, published) VALUES
  ('BookOpen', 'Lifelong Learning', 'التعلم مدى الحياة', 'Continuously building expertise through accredited training and real-world application.', 'بناء الخبرة باستمرار من خلال التدريب المعتمد والتطبيق العملي.', 0, true),
  ('Globe2', 'Bilingual Bridge', 'جسر ثنائي اللغة', 'Connecting Arabic and English-speaking communities through translation and localization.', 'ربط المجتمعات الناطقة بالعربية والإنجليزية من خلال الترجمة والتعريب.', 1, true),
  ('Users', 'Community Impact', 'التأثير المجتمعي', 'Driving measurable results in career development and national initiatives across Egypt.', 'تحقيق نتائج قابلة للقياس في التطوير المهني والمبادرات الوطنية في جميع أنحاء مصر.', 2, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- EXPERIENCES
-- ============================================================
INSERT INTO experiences (role_en, role_ar, org_en, org_ar, collaboration_en, collaboration_ar, period_en, period_ar, location_en, location_ar, summary_en, summary_ar, tags, sort_order, published) VALUES
  ('Volunteer — Career Development & MEL', 'متطوع — التطوير المهني والمتابعة والتقييم', 'University Center for Career Development (UCCD)', 'مركز تطوير المسارات المهنية (UCCD)', 'Kafrelsheikh University (KFS) × American University in Cairo (AUC)', 'جامعة كفر الشيخ (KFS) × الجامعة الأمريكية في القاهرة (AUC)', 'Jan 2024 — 2026', 'يناير 2024 — 2026', 'Kafr El-Sheikh, Egypt', 'كفر الشيخ، مصر', 'Built and operated the monitoring, evaluation, and learning system for 60–70+ training programs while coordinating events, content, and data for 90+ weekly trainees.', 'بناء وتشغيل نظام المتابعة والتقييم والتعلم لـ 60-70+ برنامج تدريبي مع تنسيق الفعاليات والمحتوى والبيانات لـ 90+ متدربًا أسبوعيًا.', ARRAY['MEL Systems', 'Data Coordination', 'Content Creation', 'Event Management', 'Volunteer Training'], 0, true),
  ('Volunteer — Community Outreach', 'متطوع — التواصل المجتمعي', 'Haya Karima Foundation', 'مؤسسة حياة كريمة', '"Decent Life" National Initiative, Egypt', 'مبادرة "حياة كريمة" الوطنية، مصر', '2024 — Present', '2024 — حتى الآن', 'Egypt', 'مصر', 'Supporting national development initiatives aligned with Egypt''s Vision 2030 through community outreach, event logistics, and training documentation.', 'دعم المبادرات التنموية الوطنية المتوافقة مع رؤية مصر 2030 من خلال التواصل المجتمعي ولوجستيات الفعاليات وتوثيق التدريب.', ARRAY['Community Outreach', 'Event Logistics', 'Vision 2030', 'Documentation'], 1, true)
ON CONFLICT DO NOTHING;

-- Experience highlights for UCCD (first experience)
INSERT INTO experience_highlights (experience_id, icon_name, text_en, text_ar, sort_order)
SELECT e.id, h.icon_name, h.text_en, h.text_ar, h.sort_order
FROM experiences e
CROSS JOIN (VALUES
  ('Users', 'Trained and supported 30+ UCCD volunteers across multiple onboarding cycles on educational and administrative information systems, improving day-to-day operational efficiency.', 'تدريب ودعم 30+ متطوع في UCCD عبر دورات تعريفية متعددة على الأنظمة التعليمية والإدارية، مما حسّن الكفاءة التشغيلية اليومية.', 0),
  ('Megaphone', 'Designed, launched, and maintained recruitment and career-program campaigns across print and social media channels, while managing and updating the UCCD website.', 'تصميم وإطلاق وصيانة حملات التوظيف والبرامج المهنية عبر قنوات الطباعة ووسائل التواصل الاجتماعي، مع إدارة وتحديث موقع UCCD.', 1),
  ('BarChart3', 'Built and implemented a Monitoring, Evaluation, and Learning (MEL) system to track and report program data, establishing priorities, policies, and procedures for data collection and management — supporting delivery of 60–70+ training programs.', 'بناء وتنفيذ نظام متابعة وتقييم وتعلم (MEL) لتتبع والإبلاغ عن بيانات البرامج، وتحديد الأولويات والسياسات والإجراءات لجمع البيانات وإدارتها — دعمًا لتقديم 60-70+ برنامج تدريبي.', 2),
  ('CalendarCheck', 'Coordinated the annual graduate follow-up survey end-to-end: collecting data, supervising data entry, generating results, and editing the final survey report.', 'تنسيق استبيار متابعة الخريجين السنوي من البداية إلى النهاية: جمع البيانات، الإشراف على إدخال البيانات، توليد النتائج، وتحرير تقرير الاستبيار النهائي.', 3),
  ('Video', 'Created, produced, and edited social media content, videos, and reels to promote center services, workshops, and training programs.', 'إنشاء وإنتاج وتحرير محتوى وسائل التواصل الاجتماعي ومقاطع الفيديو والريلز للترويج لخدمات المركز وورش العمل والبرامج التدريبية.', 4),
  ('Calendar', 'Coordinated logistics and operational support for 10–15 major career events, workshops, roundtables, and career fairs serving 700–1,000 participants.', 'تنسيق اللوجستيات والدعم التشغيلي لـ 10-15 فعالية مهنية كبرى وورش عمل وموائد مستديرة ومعارض وظيفية تخدم 700-1,000 مشارك.', 5)
) AS h(icon_name, text_en, text_ar, sort_order)
WHERE e.role_en = 'Volunteer — Career Development & MEL'
ON CONFLICT DO NOTHING;

-- Experience highlights for Haya Karima (second experience)
INSERT INTO experience_highlights (experience_id, icon_name, text_en, text_ar, sort_order)
SELECT e.id, h.icon_name, h.text_en, h.text_ar, h.sort_order
FROM experiences e
CROSS JOIN (VALUES
  ('Megaphone', 'Organized and delivered community outreach and awareness campaigns promoting national development initiatives aligned with Egypt''s Vision 2030.', 'تنظيم وتقديم حملات التواصل المجتمعي والتوعية التي تروج للمبادرات التنموية الوطنية المتوافقة مع رؤية مصر 2030.', 0),
  ('Calendar', 'Coordinated logistics and administrative support for foundation events, workshops, and programs.', 'تنسيق اللوجستيات والدعم الإداري لفعاليات المؤسسة وورش العمل والبرامج.', 1),
  ('Users', 'Communicated program information to community members, encouraging engagement and participation in initiatives.', 'تواصل معلومات البرنامج لأعضاء المجتمع، تشجيع المشاركة والانخراط في المبادرات.', 2),
  ('CalendarCheck', 'Prepared and organized materials and documentation to support training sessions and public events.', 'إعداد وتنظيم المواد والتوثيق لدعم جلسات التدريب والفعاليات العامة.', 3)
) AS h(icon_name, text_en, text_ar, sort_order)
WHERE e.role_en = 'Volunteer — Community Outreach'
ON CONFLICT DO NOTHING;

-- ============================================================
-- EDUCATION
-- ============================================================
INSERT INTO education (degree_en, degree_ar, institution_en, institution_ar, period_en, period_ar, description_en, description_ar, gpa, sort_order, published) VALUES
  ('B.A. in English Language & Translation', 'بكالوريوس في اللغة الإنجليزية والترجمة', 'Kafrelsheikh University', 'جامعة كفر الشيخ', 'Sep 2021 — Jun 2026', 'سبتمبر 2021 — يونيو 2026', 'GPA 3.61/4.00 (Excellent) — Simultaneous Interpreting, Consecutive Translating, Literary & Media Translation, Advanced Linguistics.', 'معدل 3.61/4.00 (ممتاز) — الترجمة الفورية، الترجمة التتابعية، ترجمة الأدب والإعلام، علم اللغة المتقدم.', '3.61/4.00', 0, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SKILLS
-- ============================================================
INSERT INTO skill_categories (icon_name, title_en, title_ar, sort_order, published) VALUES
  ('FileSpreadsheet', 'Office & Data', 'المكتب والبيانات', 0, true),
  ('BarChart3', 'MEL & Web', 'المتابعة والويب', 1, true),
  ('Video', 'Content & Media', 'المحتوى والإعلام', 2, true),
  ('Languages', 'Languages', 'اللغات', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO skills (category_id, name_en, name_ar, level, description_en, description_ar, sort_order)
SELECT sc.id, s.name_en, s.name_ar, s.level, s.description_en, s.description_ar, s.sort_order
FROM skill_categories sc
CROSS JOIN (VALUES
  ('Office & Data', 'Microsoft Excel', 'مايكروسوفت إكسل', 88, 'Reporting, data tracking, and analysis', 'التقارير وتتبع البيانات والتحليل', 0),
  ('Office & Data', 'Microsoft Word', 'مايكروسوفت وورد', 92, 'Document creation and formatting', 'إنشاء المستندات والتنسيق', 1),
  ('Office & Data', 'Microsoft PowerPoint', 'مايكروسوفت بوربوينت', 90, 'Presentation design', 'تصميم العروض التقديمية', 2),
  ('MEL & Web', 'Monitoring, Evaluation & Learning', 'المتابعة والتقييم والتعلم', 85, 'MEL systems and data reporting tools', 'أنظمة المتابعة والتقييم وأدوات الإبلاغ عن البيانات', 0),
  ('MEL & Web', 'Website Content Management', 'إدارة محتوى المواقع', 82, 'Content updates and management', 'تحديث المحتوى وإدارته', 1),
  ('Content & Media', 'Social Media Design', 'تصميم وسائل التواصل', 80, 'Posts, reels, and campaign design', 'تصميم المنشورات والريلز والحملات', 0),
  ('Content & Media', 'Video Editing', 'تحرير الفيديو', 78, 'Reels and promotional videos', 'الريلز ومقاطع الفيديو الترويجية', 1),
  ('Languages', 'Arabic', 'العربية', 100, 'Native proficiency', 'إتقان أصلي', 0),
  ('Languages', 'English', 'الإنجليزية', 85, 'Professional working proficiency — translation & interpreting (simultaneous & consecutive)', 'إتقان مهني — الترجمة والترجمة الفورية (الفورية والتتابعية)', 1)
) AS s(cat_title, name_en, name_ar, level, description_en, description_ar, sort_order)
WHERE sc.title_en = s.cat_title
ON CONFLICT DO NOTHING;

-- ============================================================
-- GRADUATION PROJECT
-- ============================================================
INSERT INTO graduation_project (id, eyebrow_en, eyebrow_ar, title_en, title_ar, description_en, description_ar, overview_en, overview_ar, team_info_en, team_info_ar, technologies, featured, published)
VALUES (1, 'Graduation Project — Case Study', 'مشروع التخرج — دراسة حالة', 'The Art of Merging: Cultural Aromas into One Essence', 'فن الدمج: روائح الثقافات في جوهر واحد', 'A heritage-driven fragrance brand born from academic research, cross-cultural analysis, and bilingual localization — supervised by Dr. Rana Ghanem.', 'علامة عطور مدفوعة بالتراث وُلدت من البحث الأكاديمي والتحليل الثقافي والترجمة ثنائية اللغة — تحت إشراف د. رنا غانم.', 'A heritage-driven fragrance brand born from academic research, cross-cultural analysis, and bilingual localization.', 'علامة عطور مدفوعة بالتراث وُلدت من البحث الأكاديمي والتحليل الثقافي والترجمة ثنائية اللغة.', 'Supervised by Dr. Rana Ghanem', 'تحت إشراف د. رنا غانم', ARRAY['CAT Tools', 'Translation', 'Localization', 'Market Research', 'Brand Identity', 'E-commerce'], true, true)
ON CONFLICT (id) DO UPDATE SET
  eyebrow_en = EXCLUDED.eyebrow_en,
  eyebrow_ar = EXCLUDED.eyebrow_ar,
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  overview_en = EXCLUDED.overview_en,
  overview_ar = EXCLUDED.overview_ar,
  team_info_en = EXCLUDED.team_info_en,
  team_info_ar = EXCLUDED.team_info_ar,
  technologies = EXCLUDED.technologies,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published;

-- Graduation project phases
INSERT INTO grad_project_phases (icon_name, title_en, title_ar, description_en, description_ar, sort_order, published) VALUES
  ('FlaskConical', 'Research & Analysis', 'البحث والتحليل', 'Researched and analyzed Egyptian, French, and Gulf perfumery traditions to identify a market gap for a heritage-driven fragrance brand.', 'البحث وتحليل تقاليد العطور المصرية والفرنسية والخليجية لتحديد فجوة في السوق لعلامة عطور مدفوعة بالتراث.', 0, true),
  ('Sparkles', 'Product Development', 'تطوير المنتج', 'Designed and developed three original fragrance formulations — Ra‘| Veloura, Ra‘| Nefer, and Ra‘| Rêve — blending Egyptian, French, and Arabian olfactory elements.', 'تصميم وتطوير ثلاث تركيبات عطور أصلية — رع | فيلورا، رع | نفر، ورع | ريف — تمزج العناصر العطرية المصرية والفرنسية والعربية.', 1, true),
  ('Globe', 'Market Validation', 'التحقق من السوق', 'Conducted, analyzed, and interpreted an 87-participant market survey to evaluate consumer preferences and validate demand for the concept.', 'إجراء وتحليل وتفسير استبيان سوقي شمل 87 مشاركًا لتقييم تفضيلات المستهلكين والتحقق من الطلب على المفهوم.', 2, true),
  ('Languages', 'Translation & Localization', 'الترجمة والتعريب', 'Applied translation and localization strategies, including CAT tools, to adapt the brand for both regional and international markets.', 'تطبيق استراتيجيات الترجمة والتعريب، بما في ذلك أدوات CAT، لتكييف العلامة للأسواق الإقليمية والدولية.', 3, true),
  ('Megaphone', 'Marketing & Content', 'التسويق والمحتوى', 'Produced marketing materials, including promotional videos and a branded e-commerce website, to launch and present the final product.', 'إنتاج مواد تسويقية، بما في ذلك مقاطع فيديو ترويجية وموقع تجارة إلكترونية بعلامة تجارية، لإطلاق وعرض المنتج النهائي.', 4, true),
  ('Package', 'Brand & Packaging', 'العلامة والتغليف', 'Created a complete brand identity and packaging concept that tells the story of merging cultural aromas into one essence.', 'إنشاء هوية علامة تجارية كاملة ومفهوم تغليف يروي قصة دمج الروائح الثقافية في جوهر واحد.', 5, true)
ON CONFLICT DO NOTHING;

-- Graduation project fragrances
INSERT INTO grad_project_fragrances (name_en, name_ar, culture_en, culture_ar, note_en, note_ar, sort_order) VALUES
  ('Ra‘ | Veloura', 'رع | فيلورا', 'Egyptian × French', 'مصري × فرنسي', 'Soft, velvety, warm', 'ناعم، مخملي، دافئ', 0),
  ('Ra‘ | Nefer', 'رع | نفر', 'Egyptian Heritage', 'تراث مصري', 'Beautiful, ancient, pure', 'جميل، قديم، نقي', 1),
  ('Ra‘ | Rêve', 'رع | ريف', 'French × Arabian', 'فرنسي × عربي', 'Dreamy, opulent, bold', 'حالم، فاخر، جريء', 2)
ON CONFLICT DO NOTHING;

-- Graduation project stats
INSERT INTO grad_project_stats (value, label_en, label_ar, sort_order) VALUES
  (87, 'Survey Participants', 'مشاركو الاستبيان', 0),
  (3, 'Original Fragrances', 'عطور أصلية', 1),
  (3, 'Cultural Traditions', 'تقاليد ثقافية', 2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CERTIFICATES
-- ============================================================
INSERT INTO certificates (title_en, title_ar, issuer_en, issuer_ar, date_en, date_ar, hours_en, hours_ar, credential_id, serial_no, description_en, description_ar, tags, featured, published, sort_order) VALUES
  ('Project Management Training', 'تدريب إدارة المشاريع', 'American Chamber of Commerce (AmCham)', 'الغرفة الأمريكية للتجارة (AmCham)', 'Oct 2024', 'أكتوبر 2024', '35 hours', '35 ساعة', NULL, '0011524', 'Applied Agile and Waterfall methodologies to plan, execute, monitor, and close projects using industry-standard tools. Practiced risk management, stakeholder engagement, and communication strategies for cross-functional project delivery.', 'تطبيق منهجيات Agile و Waterfall لتخطيط وتنفيذ ومراقبة وإغلاق المشاريع باستخدام أدوات قياسية في الصناعة. ممارسة إدارة المخاطر وإشراك أصحاب المصلحة واستراتيجيات التواصل لتسليم المشاريع متعددة التخصصات.', ARRAY['Agile', 'Waterfall', 'Risk Management', 'Stakeholder Engagement'], false, true, 0),
  ('Soft Skills & Employability Skills Training', 'تدريب المهارات الشخصية ومهارات التوظيف', 'Aspire Consulting International', 'Aspire للاستشارات الدولية', 'Nov 2024', 'نوفمبر 2024', '35 hours', '35 ساعة', NULL, NULL, 'Strengthened communication, teamwork, and leadership competencies through practical workplace-readiness exercises. Practiced problem-solving and critical-thinking techniques to resolve simulated workplace scenarios. Managed time and prioritized tasks effectively while adapting to changing team requirements.', 'تعزيز كفاءات التواصل والعمل الجماعي والقيادة من خلال تمارين عملية للجاهزية للعمل. ممارسة تقنيات حل المشكلات والتفكير النقدي لحل سيناريوهات عمل محاكاة. إدارة الوقت وتحديد أولويات المهام بفعالية مع التكيف مع المتطلبات المتغيرة للفريق.', ARRAY['Communication', 'Teamwork', 'Leadership', 'Problem-Solving'], false, true, 1),
  ('Value Training', 'تدريب القيمة', 'National Training Academy (NTA) × Haya Karima Foundation', 'الأكاديمية الوطنية للتدريب (NTA) × مؤسسة حياة كريمة', 'Nov 2024', 'نوفمبر 2024', '5-day intensive program', 'برنامج مكثف لمدة 5 أيام', 'UYTP11-124-033662', NULL, 'Developed entrepreneurial and innovative solutions aligned with Egypt''s Vision 2030 national development goals. Built labor-market readiness through hands-on sessions covering leadership, communication, and national project awareness. Collaborated with peers to design venture concepts addressing real community needs, presenting outcomes to program facilitators.', 'تطوير حلول ريادية ومبتكرة متوافقة مع أهداف التنمية الوطنية لرؤية مصر 2030. بناء الجاهزية لسوق العمل من خلال جلسات عملية تغطي القيادة والتواصل والوعي بالمشاريع الوطنية. التعاون مع الزملاء لتصميم مفاهيم مشاريع تعالج احتياجات مجتمعية حقيقية وعرض النتائج على ميسري البرنامج.', ARRAY['Entrepreneurship', 'Innovation', 'Vision 2030', 'Leadership'], false, true, 2)
ON CONFLICT DO NOTHING;

-- Certificate highlights
INSERT INTO certificate_highlights (certificate_id, text_en, text_ar, sort_order)
SELECT c.id, h.text_en, h.text_ar, h.sort_order
FROM certificates c
CROSS JOIN (VALUES
  ('Project Management Training', 'Applied Agile and Waterfall methodologies to plan, execute, monitor, and close projects using industry-standard tools.', 'تطبيق منهجيات Agile و Waterfall لتخطيط وتنفيذ ومراقبة وإغلاق المشاريع.', 0),
  ('Project Management Training', 'Practiced risk management, stakeholder engagement, and communication strategies for cross-functional project delivery.', 'ممارسة إدارة المخاطر وإشراك أصحاب المصلحة واستراتيجيات التواصل لتسليم المشاريع.', 1),
  ('Soft Skills & Employability Skills Training', 'Strengthened communication, teamwork, and leadership competencies through practical workplace-readiness exercises.', 'تعزيز كفاءات التواصل والعمل الجماعي والقيادة من خلال تمارين عملية.', 0),
  ('Soft Skills & Employability Skills Training', 'Practiced problem-solving and critical-thinking techniques to resolve simulated workplace scenarios.', 'ممارسة تقنيات حل المشكلات والتفكير النقدي لحل سيناريوهات عمل محاكاة.', 1),
  ('Soft Skills & Employability Skills Training', 'Managed time and prioritized tasks effectively while adapting to changing team requirements.', 'إدارة الوقت وتحديد أولويات المهام بفعالية مع التكيف مع المتطلبات المتغيرة.', 2),
  ('Value Training', 'Developed entrepreneurial and innovative solutions aligned with Egypt''s Vision 2030 national development goals.', 'تطوير حلول ريادية ومبتكرة متوافقة مع أهداف رؤية مصر 2030.', 0),
  ('Value Training', 'Built labor-market readiness through hands-on sessions covering leadership, communication, and national project awareness.', 'بناء الجاهزية لسوق العمل من خلال جلسات عملية تغطي القيادة والتواصل.', 1),
  ('Value Training', 'Collaborated with peers to design venture concepts addressing real community needs, presenting outcomes to program facilitators.', 'التعاون مع الزملاء لتصميم مفاهيم مشاريع تعالج احتياجات مجتمعية حقيقية.', 2)
) AS h(cert_title, text_en, text_ar, sort_order)
WHERE c.title_en = h.cert_title
ON CONFLICT DO NOTHING;

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
INSERT INTO achievements (icon_name, value, suffix, label_en, label_ar, context_en, context_ar, sort_order, published) VALUES
  ('GraduationCap', 361, '/400', 'GPA', 'المعدل', 'Grade: Excellent — Kafrelsheikh University', 'التقدير: ممتاز — جامعة كفر الشيخ', 0, true),
  ('Users', 30, '+', 'Volunteers Trained', 'متطوعون مدربون', 'Across multiple UCCD onboarding cycles', 'عبر دورات تعريفية متعددة في UCCD', 1, true),
  ('TrendingUp', 70, '+', 'Training Programs', 'برامج تدريبية', 'Supported through MEL system delivery', 'مدعومة من خلال نظام المتابعة والتقييم', 2, true),
  ('Calendar', 15, '+', 'Major Events', 'فعاليات كبرى', 'Career fairs, workshops, roundtables coordinated', 'معارض وظيفية وورش عمل وموائد مستديرة منسقة', 3, true),
  ('Users', 1000, '+', 'Event Participants', 'مشاركو الفعاليات', 'Served across career events', 'تمت خدمتهم عبر الفعاليات المهنية', 4, true),
  ('Megaphone', 87, '', 'Survey Participants', 'مشاركو الاستبيان', 'Graduation project market validation', 'التحقق من السوق لمشروع التخرج', 5, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TIMELINE EVENTS
-- ============================================================
INSERT INTO timeline_events (date_en, date_ar, title_en, title_ar, org_en, org_ar, description_en, description_ar, icon_name, type, sort_order, published) VALUES
  ('Sep 2021 — Jun 2026', 'سبتمبر 2021 — يونيو 2026', 'B.A. in English Language & Translation', 'بكالوريوس في اللغة الإنجليزية والترجمة', 'Kafrelsheikh University', 'جامعة كفر الشيخ', 'GPA 3.61/4.00 (Excellent) — Simultaneous Interpreting, Consecutive Translating, Literary & Media Translation, Advanced Linguistics.', 'معدل 3.61/4.00 (ممتاز) — الترجمة الفورية، الترجمة التتابعية، ترجمة الأدب والإعلام، علم اللغة المتقدم.', 'GraduationCap', 'education', 0, true),
  ('2024 — 2026', '2024 — 2026', 'Graduation Project: The Art of Merging', 'مشروع التخرج: فن الدمج', 'Supervised by Dr. Rana Ghanem', 'تحت إشراف د. رنا غانم', 'Heritage-driven fragrance brand — research, 87-participant survey, 3 original fragrances, bilingual localization, e-commerce website.', 'علامة عطور مدفوعة بالتراث — بحث، استبيان 87 مشاركًا، 3 عطور أصلية، ترجمة ثنائية اللغة، موقع تجارة إلكترونية.', 'FlaskConical', 'project', 1, true),
  ('Jan 2024 — 2026', 'يناير 2024 — 2026', 'Volunteer — UCCD', 'متطوع — UCCD', 'Kafrelsheikh University × AUC', 'جامعة كفر الشيخ × AUC', 'Built MEL system for 60–70+ training programs, trained 30+ volunteers, coordinated events for 700–1,000 participants.', 'بناء نظام متابعة وتقييم لـ 60-70+ برنامج تدريبي، تدريب 30+ متطوع، تنسيق فعاليات لـ 700-1,000 مشارك.', 'Briefcase', 'experience', 2, true),
  ('Oct 2024', 'أكتوبر 2024', 'Project Management Training', 'تدريب إدارة المشاريع', 'AmCham — 35 hours', 'AmCham — 35 ساعة', 'Agile & Waterfall methodologies, risk management, stakeholder engagement. Serial No. 0011524.', 'منهجيات Agile و Waterfall، إدارة المخاطر، إشراك أصحاب المصلحة. رقم تسلسلي 0011524.', 'Award', 'certification', 3, true),
  ('Nov 2024', 'نوفمبر 2024', 'Soft Skills & Employability Training', 'تدريب المهارات الشخصية', 'Aspire Consulting International — 35 hours', 'Aspire للاستشارات — 35 ساعة', 'Communication, teamwork, leadership, problem-solving, and time management for workplace readiness.', 'التواصل والعمل الجماعي والقيادة وحل المشكلات وإدارة الوقت للجاهزية للعمل.', 'Award', 'certification', 4, true),
  ('Nov 2024', 'نوفمبر 2024', 'Value Training', 'تدريب القيمة', 'NTA × Haya Karima — 5-day intensive', 'NTA × حياة كريمة — مكثف 5 أيام', 'Entrepreneurship and innovation aligned with Egypt Vision 2030. Credential ID: UYTP11-124-033662.', 'ريادة الأعمال والابتكار متوافقة مع رؤية مصر 2030. رقم الاعتماد: UYTP11-124-033662.', 'Award', 'certification', 5, true),
  ('2024 — Present', '2024 — حتى الآن', 'Volunteer — Haya Karima Foundation', 'متطوع — مؤسسة حياة كريمة', '"Decent Life" National Initiative', 'مبادرة "حياة كريمة" الوطنية', 'Community outreach, event logistics, and training documentation aligned with Egypt''s Vision 2030.', 'التواصل المجتمعي ولوجستيات الفعاليات وتوثيق التدريب متوافقة مع رؤية مصر 2030.', 'Heart', 'volunteer', 6, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SOCIAL LINKS
-- ============================================================
INSERT INTO social_links (platform, icon_name, url, label_en, label_ar, sort_order, published) VALUES
  ('linkedin', 'Linkedin', 'https://linkedin.com/in/maaaar3y', 'LinkedIn', 'لينكدإن', 0, true),
  ('github', 'Github', 'https://github.com/maaaar3y', 'GitHub', 'جيت هاب', 1, true),
  ('email', 'Mail', 'mailto:maaaar3y@gmail.com', 'Email', 'البريد الإلكتروني', 2, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CONTACT INFO
-- ============================================================
INSERT INTO contact_info (id, email, phone, location_en, location_ar, linkedin_url, github_url)
VALUES (1, 'maaaar3y@gmail.com', '+20 100 479 3760', 'Kafr El-Sheikh, Egypt', 'كفر الشيخ، مصر', 'https://linkedin.com/in/maaaar3y', 'https://github.com/maaaar3y')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_en = EXCLUDED.location_en,
  location_ar = EXCLUDED.location_ar,
  linkedin_url = EXCLUDED.linkedin_url,
  github_url = EXCLUDED.github_url;

-- ============================================================
-- SEO SETTINGS
-- ============================================================
INSERT INTO seo_settings (id, page_title_en, page_title_ar, meta_description_en, meta_description_ar, keywords, og_title_en, og_title_ar, og_description_en, og_description_ar, canonical_url)
VALUES (1, 'Youssef M. Marey — English Language & Translation Graduate', 'يوسف م. مري — خريج اللغة الإنجليزية والترجمة', 'Personal brand platform of Youssef M. Marey — English Language and Translation graduate, career development specialist, and bilingual project coordinator from Kafr El-Sheikh, Egypt.', 'المنصة الشخصية ليوسف م. مري — خريج اللغة الإنجليزية والترجمة، أخصائي تطوير مهني، ومنسق مشاريع ثنائي اللغة من كفر الشيخ، مصر.', ARRAY['Youssef Marey', 'Youssef M. Marey', 'English Translation', 'Career Development', 'Kafrelsheikh University', 'UCCD', 'Project Management', 'Monitoring and Evaluation', 'Bilingual Professional', 'Egypt'], 'Youssef M. Marey — Personal Brand Platform', 'يوسف م. مري — المنصة الشخصية', 'English Language & Translation graduate, career development specialist, and bilingual project coordinator.', 'خريج اللغة الإنجليزية والترجمة، أخصائي تطوير مهني، ومنسق مشاريع ثنائي اللغة.', 'https://maaaar3y.com')
ON CONFLICT (id) DO UPDATE SET
  page_title_en = EXCLUDED.page_title_en,
  page_title_ar = EXCLUDED.page_title_ar,
  meta_description_en = EXCLUDED.meta_description_en,
  meta_description_ar = EXCLUDED.meta_description_ar,
  keywords = EXCLUDED.keywords,
  og_title_en = EXCLUDED.og_title_en,
  og_title_ar = EXCLUDED.og_title_ar,
  og_description_en = EXCLUDED.og_description_en,
  og_description_ar = EXCLUDED.og_description_ar,
  canonical_url = EXCLUDED.canonical_url;

-- ============================================================
-- APPEARANCE SETTINGS
-- ============================================================
INSERT INTO appearance_settings (id, primary_color, accent_color, background_color, text_color, font_family, border_radius, animation_intensity)
VALUES (1, '185 80% 24%', '38 65% 52%', '180 25% 98%', '190 35% 12%', 'serif', '0.75rem', 'normal')
ON CONFLICT (id) DO UPDATE SET
  primary_color = EXCLUDED.primary_color,
  accent_color = EXCLUDED.accent_color,
  background_color = EXCLUDED.background_color,
  text_color = EXCLUDED.text_color,
  font_family = EXCLUDED.font_family,
  border_radius = EXCLUDED.border_radius,
  animation_intensity = EXCLUDED.animation_intensity;

-- ============================================================
-- PROFILE IMAGE
-- ============================================================
INSERT INTO profile_image (id, image_url, alt_text_en, alt_text_ar)
VALUES (1, NULL, 'Youssef M. Marey', 'يوسف م. مري')
ON CONFLICT (id) DO UPDATE SET
  alt_text_en = EXCLUDED.alt_text_en,
  alt_text_ar = EXCLUDED.alt_text_ar;

-- ============================================================
-- NAVIGATION ITEMS
-- ============================================================
INSERT INTO navigation_items (label_en, label_ar, section_id, sort_order, published) VALUES
  ('About', 'نبذة', 'about', 0, true),
  ('Experience', 'الخبرة', 'experience', 1, true),
  ('Graduation', 'مشروع التخرج', 'graduation', 2, true),
  ('Skills', 'المهارات', 'skills', 3, true),
  ('Certifications', 'الشهادات', 'certifications', 4, true),
  ('Achievements', 'الإنجازات', 'achievements', 5, true),
  ('Timeline', 'المسار الزمني', 'timeline', 6, true),
  ('Contact', 'تواصل', 'contact', 7, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION VISIBILITY
-- ============================================================
INSERT INTO section_visibility (id, show_hero, show_about, show_experience, show_graduation, show_skills, show_certifications, show_achievements, show_timeline, show_projects, show_testimonials, show_comments, show_contact)
VALUES (1, true, true, true, true, true, true, true, true, true, true, true, true)
ON CONFLICT (id) DO UPDATE SET
  show_hero = EXCLUDED.show_hero,
  show_about = EXCLUDED.show_about,
  show_experience = EXCLUDED.show_experience,
  show_graduation = EXCLUDED.show_graduation,
  show_skills = EXCLUDED.show_skills,
  show_certifications = EXCLUDED.show_certifications,
  show_achievements = EXCLUDED.show_achievements,
  show_timeline = EXCLUDED.show_timeline,
  show_projects = EXCLUDED.show_projects,
  show_testimonials = EXCLUDED.show_testimonials,
  show_comments = EXCLUDED.show_comments,
  show_contact = EXCLUDED.show_contact;