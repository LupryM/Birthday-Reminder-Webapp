-- Create profiles table with user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create birthdays table
CREATE TABLE IF NOT EXISTS public.birthdays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  relationship TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gift_ideas table
CREATE TABLE IF NOT EXISTS public.gift_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  birthday_id UUID NOT NULL REFERENCES public.birthdays(id) ON DELETE CASCADE,
  gift_name TEXT NOT NULL,
  gift_url TEXT,
  price_range TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  is_purchased BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- RLS Policies for birthdays
CREATE POLICY "Users can view their own birthdays"
  ON public.birthdays FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own birthdays"
  ON public.birthdays FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own birthdays"
  ON public.birthdays FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own birthdays"
  ON public.birthdays FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for gift_ideas
CREATE POLICY "Users can view gift ideas for their birthdays"
  ON public.gift_ideas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.birthdays
      WHERE birthdays.id = gift_ideas.birthday_id
      AND birthdays.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert gift ideas for their birthdays"
  ON public.gift_ideas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.birthdays
      WHERE birthdays.id = gift_ideas.birthday_id
      AND birthdays.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update gift ideas for their birthdays"
  ON public.gift_ideas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.birthdays
      WHERE birthdays.id = gift_ideas.birthday_id
      AND birthdays.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete gift ideas for their birthdays"
  ON public.gift_ideas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.birthdays
      WHERE birthdays.id = gift_ideas.birthday_id
      AND birthdays.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_birthdays_user_id ON public.birthdays(user_id);
CREATE INDEX IF NOT EXISTS idx_birthdays_birth_date ON public.birthdays(birth_date);
CREATE INDEX IF NOT EXISTS idx_gift_ideas_birthday_id ON public.gift_ideas(birthday_id);
