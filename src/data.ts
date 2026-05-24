/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SolutionItem, NewsItem, CompanyNotice } from './types';

export const SOLUTIONS: SolutionItem[] = [
  {
    id: 'hr-management',
    title: 'HR Management',
    description: 'Comprehensive lifecycle management from onboarding to performance tracking with professional integrity.',
    icon: 'groups'
  },
  {
    id: 'manpower-services',
    title: 'Manpower Services',
    description: 'Dynamic recruitment pipelines and vetted professional deployment globally.',
    icon: 'engineering'
  },
  {
    id: 'strategic-planning',
    title: 'Strategic Planning',
    description: 'Aligning workforce capacity with high-growth future horizons.',
    icon: 'insights'
  },
  {
    id: 'compliance-audits',
    title: 'Compliance & Auditing',
    description: 'Ensuring global operations meet physical and regulatory high-trust standards.',
    icon: 'verified'
  },
  {
    id: 'talent-retention',
    title: 'Talent Retention',
    description: 'Innovative career path mapping and wellness initiatives.',
    icon: 'favorite'
  },
  {
    id: 'payroll-benefits',
    title: 'Global Payroll Integration',
    description: 'Automated multi-currency compensation systems optimized for privacy.',
    icon: 'payments'
  }
];

export const NEWS: NewsItem[] = [
  {
    id: 'news-1',
    category: 'Innovation',
    title: 'Expanding our Global Reach',
    description: 'New regional headquarters opening in London Q3.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgv3jHcfNfGwaLhX6lf4x2P7yh8vS25a58-FnovgeT_MQAMyqyW3PCsDx9Uq43hdBQwqD_cmvTkBhtnrEHljRm8mToaJ0MSNxLUR2ncDh1-6oc0u3f4lFTJlSkH6qzcFEURvFUb8a3Ew-t12hdfvNGZypPc5BMDTHlEHwyKcQ3Pg-jWenhCpjRNsOGL9bpjpUhVYJqglYgia0X9O_CnYrVdyERCziQsUK3j9fLqCxhFJvR1z8lRZmdATVcWqPDOXfv-IqUPASaLw'
  },
  {
    id: 'news-2',
    category: 'Culture',
    title: 'Employee Wellness Initiative',
    description: 'Introducing new health benefits for all global staff.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6oTlZeBWy1mAPGc5c-1z1MEZ2IhBFQb1H6LNSO3Gf4r5uVaKiVkQdsCwU5N0UM9suW6RmA2y_KPEUvKZOuKeMquCEaFFzWTdZa7jk8QvQIm7JP5jQlvRpnNdui-D4xN7vREYWOILb_vd7vpr90VHAIqLYEX0RkETXfTxp3J8GMBq1uRbfB9GVMKrim3ANQV2c4QHtHraksoHJPmEfm10NWGLIv7FtZUIfL8HuUXxxk-LyAPGcEpOEh9b45Y4QGSP6JNd6Wl9jYg'
  },
  {
    id: 'news-3',
    category: 'Leadership',
    title: 'Executive Summit 2026',
    description: 'Gathering top strategy directors to shape the next decade of workforce optimization.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASTn8oKyQS0mSsKLPNOwR67hZRaQTfPUamOK2UxZH4--ZYPQHIYYncQwIsnVNA6elk4fU_HzFwGo0_8Jv4rkYtko4G-JDCA5B6jdcYiMgI1NwvqSwXdkCNtHx4YlF_4Z9vCWVINaPhxk8GYSmpXrIcZCVw1VAQUHnWgnW1__oD-CWWXlbJtiubGvyI0hmYJgTlSpFB7pEBpkuBaTbOo-eC1A2ri-CkSssZeVfCkg3DSms7vjYnJnbXrRBO83P5aBuxDtLxfxv4Dg'
  }
];

export const NOTICES: CompanyNotice[] = [
  {
    id: 'notice-1',
    title: 'Orientation Session',
    date: 'Oct 24, 2023',
    category: 'Event',
    description: 'Mandatory virtual orientation for all new staff members via Microsoft Teams.',
    icon: 'event'
  },
  {
    id: 'notice-2',
    title: 'Policy Handbook',
    date: 'Oct 21, 2023',
    category: 'Policy',
    description: 'The 2024 Staff Conduct & Benefits Handbook is now available for download.',
    icon: 'description'
  },
  {
    id: 'notice-3',
    title: 'ID Photo Upload',
    date: 'Action Required',
    category: 'Upload',
    description: 'Please upload a high-resolution portrait for your physical employee ID card.',
    icon: 'priority_high',
    actionRequired: true
  }
];
