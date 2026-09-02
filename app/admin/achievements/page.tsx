'use client';

import { AdminCrud } from '@/components/admin/admin-crud';

export default function AdminAchievementsPage() {
  return (
    <AdminCrud
      table="achievements"
      title="Achievements"
      description="Manage achievement stat cards."
      orderBy="sort_order"
      formFields={[
        { key: 'icon_name', label: 'Icon (Lucide)', required: true },
        { key: 'value', label: 'Value', type: 'number' as any, required: true },
        { key: 'suffix', label: 'Suffix' },
        { key: 'label_en', label: 'Label (EN)', required: true },
        { key: 'label_ar', label: 'Label (AR)', required: true },
        { key: 'context_en', label: 'Context (EN)', full: true },
        { key: 'context_ar', label: 'Context (AR)', full: true },
        { key: 'published', label: 'Published', type: 'boolean' as any },
      ]}
      columns={[
        { key: 'label_en', label: 'Label' },
        { key: 'value', label: 'Value' },
        { key: 'suffix', label: 'Suffix' },
      ]}
      defaultValues={{ published: true, value: 0, suffix: '' }}
    />
  );
}
