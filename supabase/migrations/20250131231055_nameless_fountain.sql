/*
  # User Content Schema

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `color` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `activations`
      - `id` (uuid, primary key) 
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `color` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `activation_stats`
      - `activation_id` (uuid, foreign key)
      - `scans_count` (integer)
      - `views_count` (integer)
      - `likes_count` (integer)
      - `updated_at` (timestamptz)

    - `collection_stats`
      - `collection_id` (uuid, foreign key)
      - `scans_count` (integer)
      - `views_count` (integer)
      - `likes_count` (integer)
      - `activations_count` (integer)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own content
*/

-- Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  color text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activations Table
CREATE TABLE IF NOT EXISTS activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  color text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activation Stats Table
CREATE TABLE IF NOT EXISTS activation_stats (
  activation_id uuid REFERENCES activations(id) ON DELETE CASCADE PRIMARY KEY,
  scans_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Collection Stats Table
CREATE TABLE IF NOT EXISTS collection_stats (
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE PRIMARY KEY,
  scans_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  activations_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_stats ENABLE ROW LEVEL SECURITY;

-- Collection Policies
CREATE POLICY "Users can view their own collections"
  ON collections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collections"
  ON collections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
  ON collections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
  ON collections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Activation Policies
CREATE POLICY "Users can view their own activations"
  ON activations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activations"
  ON activations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activations"
  ON activations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activations"
  ON activations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Stats Policies
CREATE POLICY "Users can view stats for their own content"
  ON activation_stats
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM activations
      WHERE id = activation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view stats for their own collections"
  ON collection_stats
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_id
      AND user_id = auth.uid()
    )
  );

-- Triggers for Stats Tables
CREATE OR REPLACE FUNCTION create_activation_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activation_stats (activation_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_collection_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO collection_stats (collection_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_activation_created
  AFTER INSERT ON activations
  FOR EACH ROW
  EXECUTE FUNCTION create_activation_stats();

CREATE TRIGGER on_collection_created
  AFTER INSERT ON collections
  FOR EACH ROW
  EXECUTE FUNCTION create_collection_stats();