CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLSポリシーを設定（必要に応じて）
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分のプロファイルのみアクセス可能" 
  ON public.profiles 
  FOR ALL 
  USING (auth.uid() = id);