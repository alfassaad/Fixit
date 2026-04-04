--
-- FixIt Platform Chat Schema Migration
--
-- This migration script creates tables for chat_rooms, 
-- chat_room_participants, and chat_messages to support the new chatting interface.
--

-- Create chat_room_type enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_room_type') THEN
    CREATE TYPE public.chat_room_type AS ENUM ('channel', 'dm', 'issue');
  END IF;
END$$;

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  "roomId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text,
  "type" public.chat_room_type NOT NULL DEFAULT 'channel',
  "createdAt" timestamptz DEFAULT now()
);

-- Enable RLS for chat_rooms
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

-- Note: Depending on rules, you might want logic to let any user view 'channel' rooms, 
-- but that depends on implementation. We'll default to explicit participation.

-- Create chat_room_participants table
CREATE TABLE IF NOT EXISTS public.chat_room_participants (
  "roomId" uuid NOT NULL REFERENCES public.chat_rooms("roomId") ON DELETE CASCADE,
  "userId" uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  "joinedAt" timestamptz DEFAULT now(),
  "lastReadAt" timestamptz DEFAULT now(),
  PRIMARY KEY ("roomId", "userId")
);

-- Allow users to view rooms they are participants of
CREATE POLICY "Users can view rooms they are in"
ON public.chat_rooms
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_participants
    WHERE "chat_room_participants"."roomId" = "chat_rooms"."roomId"
    AND "chat_room_participants"."userId" = auth.uid()
  )
);

-- Note: Depending on rules, you might want logic to let any user view 'channel' rooms, 
-- but that depends on implementation. We'll default to explicit participation.

-- Enable RLS for chat_room_participants
ALTER TABLE public.chat_room_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants of their rooms"
ON public.chat_room_participants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_participants p2
    WHERE p2."roomId" = "chat_room_participants"."roomId"
    AND p2."userId" = auth.uid()
  )
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  "messageId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "roomId" uuid NOT NULL REFERENCES public.chat_rooms("roomId") ON DELETE CASCADE,
  "senderId" uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  "message" text NOT NULL,
  "isSystemMessage" boolean DEFAULT false,
  "createdAt" timestamptz DEFAULT now()
);

-- Enable RLS for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their rooms"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_participants
    WHERE "chat_room_participants"."roomId" = "chat_messages"."roomId"
    AND "chat_room_participants"."userId" = auth.uid()
  )
);

CREATE POLICY "Users can insert messages in their rooms"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_room_participants
    WHERE "chat_room_participants"."roomId" = "chat_messages"."roomId"
    AND "chat_room_participants"."userId" = auth.uid()
  )
);
