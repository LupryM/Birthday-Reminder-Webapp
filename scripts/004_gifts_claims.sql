-- Add column to track who's buying/claiming a gift
ALTER TABLE public.gift_ideas 
ADD COLUMN claimed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policy to allow friends to see and claim gifts
DROP POLICY IF EXISTS "Users can view gift ideas for their birthdays" ON public.gift_ideas;

CREATE POLICY "Users can view gift ideas for their birthdays and friends' gifts"
  ON public.gift_ideas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.birthdays
      WHERE birthdays.id = gift_ideas.birthday_id
      AND birthdays.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.birthdays b
      INNER JOIN public.friendships f ON (
        (f.requester_id = auth.uid() AND f.recipient_id = b.user_id) OR
        (f.recipient_id = auth.uid() AND f.requester_id = b.user_id)
      )
      WHERE b.id = gift_ideas.birthday_id
      AND f.status = 'accepted'
    )
  );

-- Create index for claiming performance
CREATE INDEX IF NOT EXISTS idx_gift_ideas_claimed_by ON public.gift_ideas(claimed_by_user_id);
