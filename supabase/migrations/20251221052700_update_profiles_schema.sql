-- Update profiles table to align with task schema
-- Change current_company to company
-- Change batch_year to TEXT
-- Change profile_image_url to avatar_url
-- Rename current_company to company
ALTER TABLE profiles
    RENAME COLUMN current_company TO company;
-- Change batch_year from integer to text
ALTER TABLE profiles
ALTER COLUMN batch_year TYPE TEXT;
-- Rename profile_image_url to avatar_url
ALTER TABLE profiles
    RENAME COLUMN profile_image_url TO avatar_url;