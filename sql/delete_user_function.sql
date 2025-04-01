create or replace function public.delete_user()
returns void
language plpgsql
security definer
as $$
declare 
  user_id uuid := auth.uid();
begin
  -- プロファイルテーブルが存在しないのでスキップ
  -- プロファイルテーブルに関連する処理をコメントアウト
  -- delete from public.profiles where id = user_id;
  
  -- ユーザーの削除
  delete from auth.users where id = user_id;
end;
$$;