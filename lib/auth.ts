import { supabase } from '../utils/supabase';

/**
 * メールアドレスとパスワードでユーザーを登録する
 * @param email ユーザーのメールアドレス
 * @param password ユーザーのパスワード
 * @returns 登録結果と可能性のあるエラー
 */
export const signUp = async (email: string, password: string) => {
  try {
    console.log('Supabase サインアップ開始:', { email });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log('Supabase API レスポンス:', { 
      data: data ? {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
          confirmed_at: data.user.confirmed_at,
          last_sign_in_at: data.user.last_sign_in_at,
          app_metadata: data.user.app_metadata,
          user_metadata: data.user.user_metadata
        } : null,
        session: data.session ? 'セッション有り' : 'セッション無し'
      } : null,
      error: error ? {
        message: error.message,
        status: error.status
      } : null
    });
    
    return { data, error };
  } catch (error) {
    console.error('サインアップエラー:', error);
    return { data: null, error };
  }
};

/**
 * メールアドレスとパスワードでユーザーをログインさせる
 * @param email ユーザーのメールアドレス
 * @param password ユーザーのパスワード
 * @returns ログイン結果と可能性のあるエラー
 */
export const signIn = async (email: string, password: string) => {
  try {
    console.log('Supabase ログイン開始:', { email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Supabase ログイン API レスポンス:', { 
      data: data ? {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
          confirmed_at: data.user.confirmed_at,
          last_sign_in_at: data.user.last_sign_in_at
        } : null,
        session: data.session ? 'セッション有り' : 'セッション無し'
      } : null,
      error: error ? {
        message: error.message,
        status: error.status
      } : null
    });
    
    return { data, error };
  } catch (error) {
    console.error('ログインエラー:', error);
    return { data: null, error };
  }
};

/**
 * 現在のユーザーをログアウトさせる
 * @returns ログアウト結果と可能性のあるエラー
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('ログアウトエラー:', error);
    return { error };
  }
};

/**
 * 現在のセッションを取得する
 * @returns 現在のセッションと可能性のあるエラー
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (error) {
    console.error('セッション取得エラー:', error);
    return { session: null, error };
  }
};

/**
 * 現在のユーザーを取得する
 * @returns 現在のユーザーと可能性のあるエラー
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return { user: null, error };
  }
};
