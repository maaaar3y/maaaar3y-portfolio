'use client';

import { AdminCrud } from '@/components/admin/admin-crud';

export default function AdminTimelinePage() {
  return (
    <AdminCrud
      table="timeline_events"
      title="Timeline"
      description="Manage timeline events."
      orderBy="sort_order"
      formFields={[
        { key: 'date_en', label: 'Date (EN)', required: true },
        { key: 'date_ar', label: 'Date (AR)', required: true },
        { key: 'title_en', label: 'Title (EN)', required: true },
        { key: 'title_ar', label: 'Title (AR)', required: true },
        { key: 'org_en', label: 'Organization (EN)', required: true },
        { key: 'org_ar', label: 'Organization (AR)', required: true },
        { key: 'description_en', label: 'Description (EN)', full: true, type: 'textarea' as any },
        { key: 'description_ar', label: 'Description (AR)', full: true, type: 'textarea' as any },
        { key: 'icon_name', label: 'Icon (Lucide)' },
        { key: 'type', label: 'Type', type: 'select' as any, options: [
          { value: 'education', label: 'Education' },
          { value: 'experience', label: 'Experience' },
          { value: 'certification', label: 'Certification' },
          { value: 'project', label: 'Project' },
          { value: 'volunteer', label: 'Volunteer' },
        ]},
        { key: 'image_url', label: 'Image URL', full: true },
        { key: 'link_url', label: 'Link URL', full: true },
        { key: 'published', label: 'Published', type: 'boolean' as any },
      ]}
      columns={[
        { key: 'date_en', label: 'Date' },
        { key: 'title_en', label: 'Title' },
        { key: 'org_en', label: 'Organization' },
        { key: 'type', label: 'Type' },
      ]}
      defaultValues={{ published: true, type: 'education', icon_name: 'GraduationCap' }}
    />
  );
}
