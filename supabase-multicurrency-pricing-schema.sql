-- ========================================================================
-- MULTI-CURRENCY PRICING SCHEMA MIGRATION
-- Supports:
-- 1. Gulf / GCC (AED)
-- 2. Europe & UK (GBP)
-- 3. Other Countries / US (USD)
-- ========================================================================

-- Add multi-currency price columns to pricing_plans
ALTER TABLE public.pricing_plans
  ADD COLUMN IF NOT EXISTS price_usd TEXT,
  ADD COLUMN IF NOT EXISTS price_gbp TEXT,
  ADD COLUMN IF NOT EXISTS price_aed TEXT;

-- Update existing default pricing plans with initial values
UPDATE public.pricing_plans
SET 
  price_usd = COALESCE(price_usd, price, '8.00'),
  price_gbp = COALESCE(price_gbp, '6.50'),
  price_aed = COALESCE(price_aed, '30.00')
WHERE id = 1 OR name = 'Basic';

UPDATE public.pricing_plans
SET 
  price_usd = COALESCE(price_usd, price, '9.00'),
  price_gbp = COALESCE(price_gbp, '7.50'),
  price_aed = COALESCE(price_aed, '35.00')
WHERE id = 2 OR name = 'Essentials';

UPDATE public.pricing_plans
SET 
  price_usd = COALESCE(price_usd, price, '11.00'),
  price_gbp = COALESCE(price_gbp, '9.00'),
  price_aed = COALESCE(price_aed, '40.00')
WHERE id = 3 OR name = 'Premium';

UPDATE public.pricing_plans
SET 
  price_usd = COALESCE(price_usd, price, '14.00'),
  price_gbp = COALESCE(price_gbp, '11.50'),
  price_aed = COALESCE(price_aed, '50.00')
WHERE id = 4 OR name = 'Platinum';

-- Also add currency column to student_applications table if not exists
ALTER TABLE public.student_applications
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
