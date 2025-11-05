/*
 * ==========================================
 * 1. CORE USER & AUTH
 * ==========================================
 */

-- Create the master profiles table, combining all fields
CREATE TABLE IF NOT EXISTS profiles (
  -- Core Auth
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOTT NULL,
  
  -- Profile Info
  full_name text NOT NULL,
  batch_year integer,
  department text,
  current_company text,
  job_title text,
  location text,
  country text DEFAULT 'India',
  bio text,
  profile_image_url text,
  linkedin_url text,
  roll_number text, -- For verification
  
  -- Platform Roles & Features
  is_mentor boolean DEFAULT false,
  skills text[] DEFAULT '{}',
  
  -- Admin & Approval System
  role text DEFAULT 'alumni' NOT NULL CHECK (role IN ('student', 'alumni', 'admin')),
  approval_status text DEFAULT 'pending' NOT NULL CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  approved_by uuid REFERENCES profiles(id), -- Admin who approved
  approved_at timestamptz,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create helper function to check for admin (used in many policies)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


/*
 * ==========================================
 * 2. CORE CONTENT TABLES (Events, Jobs, etc.)
 * ==========================================
 */

-- Memories (Yearbook Photos)
CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  year integer NOT NULL,
  event_type text NOT NULL, -- 'fest', 'graduation', 'sports'
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  event_type text NOT NULL, -- 'reunion', 'networking'
  image_url text,
  max_attendees integer,
  rsvp_count integer DEFAULT 0,
  is_past boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('attending', 'maybe', 'declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract')),
  domain text NOT NULL,
  skills_required text[] DEFAULT '{}',
  apply_url text NOT NULL,
  posted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Stories (Blog Posts)
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  cover_image_url text,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  published_at timestamptz DEFAULT now()
);
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Mentorship
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  topic text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;


/*
 * ==========================================
 * 3. ADMIN & MODERATION TABLES
 * ==========================================
 */

-- Admin Audit Log
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  action text NOT NULL, -- e.g., 'approve_profile', 'reject_photo'
  target_type text NOT NULL, -- 'profile', 'photo'
  target_id uuid NOT NULL,
  details jsonb, -- Can store {'reason': '...'}
  created_at timestamptz DEFAULT now()
);
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Staging table for user photo uploads
CREATE TABLE IF NOT EXISTS photo_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  file_url text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_notes text,
  moderated_by uuid REFERENCES profiles(id),
  moderated_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE photo_uploads ENABLE ROW LEVEL SECURITY;

-- Platform Stats
CREATE TABLE IF NOT EXISTS platform_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_alumni integer DEFAULT 0,
  total_countries integer DEFAULT 0,
  total_events integer DEFAULT 0,
  total_jobs integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

-- Insert initial stats record (idempotent)
INSERT INTO platform_stats (id, total_alumni, total_countries, total_events, total_jobs)
VALUES ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 0, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;


/*
 * ==========================================
 * 4. ROW LEVEL SECURITY (RLS) POLICIES
 * ==========================================
 */

--
-- RLS: profiles
--
CREATE POLICY "Approved profiles are viewable by everyone"
  ON profiles FOR SELECT TO authenticated
  USING (approval_status = 'approved');

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

--
-- RLS: memories
--
CREATE POLICY "Memories are viewable by everyone" ON memories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create memories" ON memories FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can update own memories" ON memories FOR UPDATE TO authenticated USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete own memories" ON memories FOR DELETE TO authenticated USING (auth.uid() = uploaded_by);
CREATE POLICY "Admins can manage all memories" ON memories FOR ALL TO authenticated USING (is_admin());

--
-- RLS: events
--
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Event creators can update/delete their events" ON events FOR ALL TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all events" ON events FOR ALL TO authenticated USING (is_admin());

--
-- RLS: event_rsvps
--
CREATE POLICY "RSVPs are viewable by everyone" ON event_rsvps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create/update/delete their own RSVP" ON event_rsvps FOR ALL TO authenticated USING (auth.uid() = user_id);

--
-- RLS: jobs
--
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create jobs" ON jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Job posters can update/delete their jobs" ON jobs FOR ALL TO authenticated USING (auth.uid() = posted_by);
CREATE POLICY "Admins can manage all jobs" ON jobs FOR ALL TO authenticated USING (is_admin());

--
-- RLS: stories
--
CREATE POLICY "Stories are viewable by everyone" ON stories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create stories" ON stories FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Story authors can update/delete their stories" ON stories FOR ALL TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all stories" ON stories FOR ALL TO authenticated USING (is_admin());

--
-- RLS: mentorship_sessions
--
CREATE POLICY "Users can view their own sessions" ON mentorship_sessions FOR SELECT TO authenticated USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY "Mentees can create session requests" ON mentorship_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = mentee_id);
CREATE POLICY "Mentors/Mentees can update their sessions" ON mentorship_sessions FOR UPDATE TO authenticated USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

--
-- RLS: admin_logs
--
CREATE POLICY "Admins can view logs" ON admin_logs FOR SELECT TO authenticated USING (is_admin());
-- Note: Inserts should be handled by SECURITY DEFINER functions, not policies, for security.

--
-- RLS: photo_uploads (Staging Table)
--
CREATE POLICY "Users can view their own pending photos" ON photo_uploads FOR SELECT TO authenticated USING (auth.uid() = uploader_id);
CREATE POLICY "Users can upload photos" ON photo_uploads FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Admins can view and moderate all photos" ON photo_uploads FOR ALL TO authenticated USING (is_admin());

--
-- RLS: platform_stats
--
CREATE POLICY "Stats are viewable by everyone" ON platform_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update stats" ON platform_stats FOR UPDATE TO authenticated USING (is_admin());

/*
 * ==========================================
 * 5. INDEXES
 * ==========================================
 */

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status ON profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_profiles_batch_year ON profiles(batch_year);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_is_mentor ON profiles(is_mentor);

-- Content
CREATE INDEX IF NOT EXISTS idx_memories_year ON memories(year);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at DESC);

-- Admin
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photo_uploads_status ON photo_uploads(status);