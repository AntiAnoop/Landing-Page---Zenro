-- SQL Schema for Zenro TPP Leads
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.tpp_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    email TEXT,
    phone TEXT UNIQUE,
    language_willingness TEXT,
    education TEXT,
    job_role TEXT,
    investment_comfort TEXT,
    achievement TEXT,
    why_japan TEXT,
    state TEXT,
    city TEXT,
    class_timing TEXT,
    status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'qualified', 'enrolled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tpp_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous upsert based on phone number for real-time lead capture
-- Note: In production, you might want more restrictive policies
CREATE POLICY "Allow anonymous upsert" ON public.tpp_leads
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tpp_leads_updated_at
    BEFORE UPDATE ON public.tpp_leads
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
