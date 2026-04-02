ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_reporter_id_fkey;
ALTER TABLE issues ADD CONSTRAINT issues_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES profiles(user_id);

ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_assigned_to_fkey;
ALTER TABLE issues ADD CONSTRAINT issues_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES profiles(user_id);

ALTER TABLE issue_photos DROP CONSTRAINT IF EXISTS issue_photos_uploader_id_fkey;
ALTER TABLE issue_photos ADD CONSTRAINT issue_photos_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES profiles(user_id);

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;
ALTER TABLE tasks ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES profiles(user_id);

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assigned_by_fkey;
ALTER TABLE tasks ADD CONSTRAINT tasks_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES profiles(user_id);

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(user_id);

ALTER TABLE issue_upvotes DROP CONSTRAINT IF EXISTS issue_upvotes_user_id_fkey;
ALTER TABLE issue_upvotes ADD CONSTRAINT issue_upvotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(user_id);