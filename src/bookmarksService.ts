// bookmarksService.ts
import supabase from "./supabase"; // Импортирај го конфигурираниот Supabase клиент
// src/bookmarksService.ts
export type Bookmark = {
  id: string;
  title: string;
  description: string;
  url: string;
};

// Функција за додавање нов документ
const addBookmark = async (bookmark: {
  title: string;
  url: string;
  description: string;
}) => {
  const { data, error } = await supabase.from("bookmarks").insert([bookmark]);

  if (error) {
    console.error("Error adding document:", error);
  } else {
    console.log("Document added:", data);
  }
};

// Функција за бришење на документ
const deleteBookmark = async (id: string) => {
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting document:", error);
  } else {
    console.log("Document deleted:", data);
  }
};

// Функција за ажурирање на документ
const updateBookmark = async (
  id: string,
  updates: { title?: string; url?: string; description?: string }
) => {
  const { data, error } = await supabase
    .from("bookmarks")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating document:", error);
  } else {
    console.log("Document updated:", data);
  }
};

// Функција за земање на документи
const getBookmarks = async () => {
  const { data, error } = await supabase.from("bookmarks").select("*");

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  } else {
    console.log("Fetched bookmarks:", data);
    return data;
  }
};

export { addBookmark, updateBookmark, getBookmarks, deleteBookmark };
