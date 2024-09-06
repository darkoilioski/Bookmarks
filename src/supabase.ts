// src/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Bookmark } from './bookmarksService'; // Замени го со точниот пат до типот

const supabaseUrl = 'https://oevyijtoamawmpqiikxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldnlpanRvYW1hd21wcWlpa3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUxMzIzNDksImV4cCI6MjA0MDcwODM0OX0.6FFuyhHwDpKb02oRKawCFIA8799hoOCOIoc0XnlQ4XM';

const supabase = createClient(supabaseUrl, supabaseKey);
supabase.auth.signInWithPassword({
  email: 'darko.iliosky@gmail.com',
  password: 'MagaretoLeta32'
});

// Функција за добивање на обележувачи
export async function getBookmarks(): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*');
  if (error) {
    console.error('Error fetching bookmarks:', error.message);
    return [];
  }
  return data as Bookmark[];
}

// Функција за додавање нов обележувач
export async function addBookmark(bookmark: Omit<Bookmark, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .insert([bookmark]);

  if (error) {
    console.error('Error adding bookmark:', error.message);
  }
}

// Функција за бришење на обележувач
export async function deleteBookmark(id: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting bookmark:', error.message);
  }
}

// Функција за ажурирање на обележувач
export async function updateBookmark(bookmark: Bookmark): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .update({
      title: bookmark.title,
      description: bookmark.description,
      url: bookmark.url
    })
    .eq('id', bookmark.id);

  if (error) {
    console.error('Error updating bookmark:', error.message);
  }
}

export default supabase;
