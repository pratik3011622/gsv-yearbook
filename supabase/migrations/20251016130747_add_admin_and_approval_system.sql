
CREATE OR REPLACE FUNCTION approve_user_profile(profile_id_to_approve uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id uuid := auth.uid();
BEGIN
  
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized: Must be an admin';
  END IF;

  UPDATE profiles
  SET 
    approval_status = 'approved',
    approved_by = admin_user_id,
    approved_at = now(),
    rejection_reason = NULL
  WHERE id = profile_id_to_approve;

  INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (admin_user_id, 'approve_profile', 'profile', profile_id_to_approve, null);
END;
$$;

CREATE OR REPLACE FUNCTION reject_user_profile(
  profile_id_to_reject uuid, 
  reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id uuid := auth.uid();
BEGIN
  
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized: Must be an admin';
  END IF;

  
  UPDATE profiles
  SET 
    approval_status = 'rejected',
    rejection_reason = reason,
    approved_by = admin_user_id,
    approved_at = now()
  WHERE id = profile_id_to_reject;

  
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (admin_user_id, 'reject_profile', 'profile', profile_id_to_reject, jsonb_build_object('reason', reason));
END;
$$;


INSERT INTO storage.buckets (id, name, public)
VALUES ('yearbook_photos', 'yearbook_photos', false)
ON CONFLICT (id) DO NOTHING;


CREATE POLICY "Users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'yearbook_photos' 
    
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

--
CREATE POLICY "Admins can manage all photos"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'yearbook_photos'
    AND is_admin()
  );
  

CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING ( bucket_id = 'yearbook_photos' );

CREATE OR REPLACE FUNCTION handle_photo_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    
    INSERT INTO memories (title, image_url, year, event_type, uploaded_by)
    VALUES (
      'Untitled Memory', 
      NEW.file_url,
      EXTRACT(YEAR FROM NEW.created_at)::integer,
      'user_upload', 
      NEW.uploader_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_photo_approved
  AFTER UPDATE ON photo_uploads
  FOR EACH ROW
  EXECUTE FUNCTION handle_photo_approval();