-- =================================================================
-- SOILSTACK SEED DATA
-- =================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── COOPERATIVES ────────────────────────────────────────────

INSERT INTO cooperatives (id, name, region, state, country, center_gps, radius_km, member_count, total_tonnes_verified, total_tonnes_available, avg_quality_score, price_per_tonne_usd, season, is_active) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Punjab Biochar Cooperative', 'Ludhiana', 'Punjab', 'IN', ST_SetSRID(ST_MakePoint(75.8573, 30.9010), 4326), 25, 42, 1240, 380, 4.2, 54, 'Rabi 2025', true),
  ('11111111-0000-0000-0000-000000000002', 'Mwea Biochar Network', 'Mwea', 'Kirinyaga', 'KE', ST_SetSRID(ST_MakePoint(37.5500, -0.6600), 4326), 20, 28, 680, 190, 3.8, 48, 'Season A 2025', true),
  ('11111111-0000-0000-0000-000000000003', 'Mekong Green Cooperative', 'Mekong Delta', 'Can Tho', 'VN', ST_SetSRID(ST_MakePoint(105.8500, 10.0450), 4326), 30, 35, 890, 245, 4.0, 51, 'Winter-Spring 2025', true);

-- ─── PROFILES (Punjab farmers) ────────────────────────────────

INSERT INTO profiles (id, role, phone, name, language) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'farmer', '+919876543001', 'Harpreet Singh', 'hi'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'farmer', '+919876543002', 'Gurjeet Kaur', 'hi'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'farmer', '+919876543003', 'Balwinder Singh', 'hi'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'farmer', '+919876543004', 'Sukhdev Pal', 'hi'),
  ('aaaaaaaa-0000-0000-0000-000000000005', 'farmer', '+919876543005', 'Manjeet Kaur', 'hi'),
  -- Mwea farmers
  ('bbbbbbbb-0000-0000-0000-000000000001', 'farmer', '+254712345001', 'Wanjiku Kamau', 'sw'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'farmer', '+254712345002', 'John Mwangi', 'en'),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'farmer', '+254712345003', 'Grace Njeri', 'sw'),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'farmer', '+254712345004', 'Samuel Ochieng', 'en'),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'farmer', '+254712345005', 'Mary Wambui', 'sw'),
  -- Mekong farmers
  ('cccccccc-0000-0000-0000-000000000001', 'farmer', '+84912345001', 'Nguyen Van An', 'vi'),
  ('cccccccc-0000-0000-0000-000000000002', 'farmer', '+84912345002', 'Tran Thi Huong', 'vi'),
  ('cccccccc-0000-0000-0000-000000000003', 'farmer', '+84912345003', 'Le Van Duc', 'vi'),
  ('cccccccc-0000-0000-0000-000000000004', 'farmer', '+84912345004', 'Pham Thi Mai', 'vi'),
  ('cccccccc-0000-0000-0000-000000000005', 'farmer', '+84912345005', 'Hoang Van Minh', 'vi'),
  -- Validators
  ('dddddddd-0000-0000-0000-000000000001', 'validator', '+919876543010', 'Rajesh Kumar', 'en'),
  ('dddddddd-0000-0000-0000-000000000002', 'validator', '+254712345010', 'David Otieno', 'en'),
  -- Buyers
  ('eeeeeeee-0000-0000-0000-000000000001', 'buyer', '+14155551001', 'GreenCore Capital', 'en'),
  ('eeeeeeee-0000-0000-0000-000000000002', 'buyer', '+442071234567', 'CarbonFirst Ltd', 'en');

-- ─── FARMERS (linking to cooperatives) ──────────────────────

INSERT INTO farmers (id, field_gps, field_size_acres, crop_type, region, state, country, cooperative_id, total_credits_earned, total_payment_inr, seasons_active, current_season) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', ST_SetSRID(ST_MakePoint(75.8402, 30.9120), 4326), 4.5, 'Wheat/Rice', 'Ludhiana', 'Punjab', 'IN', '11111111-0000-0000-0000-000000000001', 18.4, 92736, 4, 'Rabi 2025'),
  ('aaaaaaaa-0000-0000-0000-000000000002', ST_SetSRID(ST_MakePoint(75.8510, 30.9080), 4326), 3.2, 'Rice', 'Ludhiana', 'Punjab', 'IN', '11111111-0000-0000-0000-000000000001', 12.1, 61200, 3, 'Rabi 2025'),
  ('aaaaaaaa-0000-0000-0000-000000000003', ST_SetSRID(ST_MakePoint(75.8650, 30.9200), 4326), 5.0, 'Wheat', 'Ludhiana', 'Punjab', 'IN', '11111111-0000-0000-0000-000000000001', 15.5, 78300, 4, 'Rabi 2025'),
  ('aaaaaaaa-0000-0000-0000-000000000004', ST_SetSRID(ST_MakePoint(75.8700, 30.8950), 4326), 2.8, 'Rice/Maize', 'Ludhiana', 'Punjab', 'IN', '11111111-0000-0000-0000-000000000001', 8.2, 41400, 2, 'Rabi 2025'),
  ('aaaaaaaa-0000-0000-0000-000000000005', ST_SetSRID(ST_MakePoint(75.8350, 30.9050), 4326), 6.0, 'Wheat/Mustard', 'Ludhiana', 'Punjab', 'IN', '11111111-0000-0000-0000-000000000001', 22.0, 110000, 4, 'Rabi 2025');

-- ─── VALIDATORS ──────────────────────────────────────────────

INSERT INTO validators (id, current_gps, rating, total_jobs_completed, total_earned_usd, is_available, max_distance_km) VALUES
  ('dddddddd-0000-0000-0000-000000000001', ST_SetSRID(ST_MakePoint(75.8500, 30.9050), 4326), 4.8, 47, 159.80, true, 25),
  ('dddddddd-0000-0000-0000-000000000002', ST_SetSRID(ST_MakePoint(37.5450, -0.6550), 4326), 4.5, 32, 108.80, true, 20);

-- ─── BUYERS ──────────────────────────────────────────────────

INSERT INTO buyers (id, company_name, country, total_tonnes_purchased, total_spent_usd, verification_status) VALUES
  ('eeeeeeee-0000-0000-0000-000000000001', 'GreenCore Capital', 'US', 6.4, 388, 'verified'),
  ('eeeeeeee-0000-0000-0000-000000000002', 'CarbonFirst Ltd', 'GB', 12.8, 742, 'verified');
