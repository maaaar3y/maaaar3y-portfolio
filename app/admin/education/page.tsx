'use client';

import { AdminCrud } from '@/components/admin/admin-crud';

export default function AdminEducationPage() {
  return (
    <AdminCrud
      table="education"
      title="Education"
      description="Manage education entries."
      orderBy="sort_order"
      formFields={[
        { key: 'degree_en', label: 'Degree (EN)', required: true },
        { key: 'degree_ar', label: 'Degree (AR)', required: true },
        { key: 'institution_en', label: 'Institution (EN)', required: true },
        { key: 'institution_ar', label: 'Institution (AR)', required: true },
        { key: 'period_en', label: 'Period (EN)', required: true },
        { key: 'period_ar', label: 'Period (AR)', required: true },
        { key: 'description_en', label: 'Description (EN)', full: true, type: 'textarea' as any },
        { key: 'description_ar', label: 'Description (AR)', full: true, type: 'textarea' as any },
        { key: 'gpa', label: 'GPA' },
        { key: 'published', label: 'Published', type: 'boolean' as any },
      ]}
      columns={[
        { key: 'degree_en', label: 'Degree' },
        { key: 'institution_en', label: 'Institution' },
        { key: 'period_en', label: 'Period' },
        { key: 'gpa', label: 'GPA' },
      ]}
      defaultValues={{ published: true }}
    />
  );
}
