-- Create ENUM types for roles, categories, statuses, and priorities
CREATE TYPE user_role AS ENUM ('citizen', 'technician', 'manager', 'admin', 'super_admin');
CREATE TYPE issue_category AS ENUM ('Roads & Potholes', 'Street Lighting', 'Water & Drainage', 'Waste Management', 'Parks', 'Other');
CREATE TYPE issue_status AS ENUM ('open', 'assigned', 'in_progress', 'resolved', 'closed');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE photo_type AS ENUM ('evidence', 'resolution');
CREATE TYPE notification_type AS ENUM ('status_change', 'comment', 'assignment', 'escalation');

-- Create departments table
CREATE TABLE departments (
  dept_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category issue_category NOT NULL,
  manager_id UUID REFERENCES auth.users(id)
);

-- Create users table (profiles)
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  role user_role NOT NULL DEFAULT 'citizen',
  department_id UUID REFERENCES departments(dept_id),
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issues table
CREATE TABLE issues (
  issue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(user_id),
  category issue_category NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location GEOMETRY(Point, 4326),
  address TEXT NOT NULL,
  status issue_status DEFAULT 'open',
  priority issue_priority DEFAULT 'medium',
  priority_score FLOAT DEFAULT 0,
  upvote_count INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES profiles(user_id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue_photos table
CREATE TABLE issue_photos (
  photo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES issues(issue_id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES profiles(user_id),
  photo_url TEXT NOT NULL,
  photo_type photo_type NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES issues(issue_id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(user_id),
  assigned_by UUID REFERENCES profiles(user_id),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE notifications (
  notif_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  issue_id UUID REFERENCES issues(issue_id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue_upvotes table
CREATE TABLE issue_upvotes (
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  issue_id UUID REFERENCES issues(issue_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, issue_id)
);
