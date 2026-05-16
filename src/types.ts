export enum AppView {
  FORM_QUALIFICATION = 'VIEW_FORM_1',
  SUCCESS_BROCHURE = 'VIEW_SUCCESS_BROCHURE',
  ENROLL_FORM = 'VIEW_ENROLL_FORM',
  PAYMENT_MOCK = 'VIEW_PAYMENT_MOCK'
}

export interface TppLead {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  language_willingness?: string;
  education?: string;
  job_role?: string;
  investment_comfort?: string;
  achievement?: string;
  why_japan?: string;
  state?: string;
  city?: string;
  class_timing?: string;
  status: 'lead' | 'qualified' | 'enrolled';
  created_at?: string;
  updated_at?: string;
}
