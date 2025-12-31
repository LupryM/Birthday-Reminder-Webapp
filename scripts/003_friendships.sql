-- Create friendships/connections table for friend system
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- Enable RLS for friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friendships
CREATE POLICY "Users can view their friendship requests"
  ON public.friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send friendship requests"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their friendship status"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can delete friendship records"
  ON public.friendships FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_friendships_requester_id ON public.friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_recipient_id ON public.friendships(recipient_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON public.friendships(status);
