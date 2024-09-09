// src/noteService.ts
import supabase from "./supabase"; // Импортирај ја инстанцата на Supabase
import { Note, CreateNotePayload } from "./api/queries/useNotes"; // Замени го со патот до типови

// Функција за додавање нова забелешка
const addNote = async ({ title, content }: CreateNotePayload) => {
  try {
    // Добијте го тековниот аутентициран корисник
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("notes")
      .insert([{ title, content, user_id: user.id }]); // Додадете го user_id во новиот запис

    if (error) throw new Error(error.message);
    console.log("Note added successfully");
  } catch (e) {
    console.error("Error adding note: ", e);
  }
};

// Функција за бришење на забелешка
const deleteNote = async (noteId: string) => {
  try {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) throw new Error(error.message);
    console.log("Note deleted successfully");
  } catch (e) {
    console.error("Error deleting note: ", e);
  }
};

// Функција за ажурирање на забелешка
const updateNote = async ({ id, title, content }: Note) => {
  try {
    const { error } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", id);

    if (error) throw new Error(error.message);
    console.log("Note updated successfully");
  } catch (e) {
    console.error("Error updating note: ", e);
  }
};

// Функција за земање на забелешки
const getNotes = async (): Promise<Note[]> => {
  try {
    const { data, error } = await supabase.from("notes").select("*");

    if (error) throw new Error(error.message);
    console.log("Fetched notes:", data);
    return data as Note[];
  } catch (e) {
    console.error("Error getting notes: ", e);
    return [];
  }
};

// Функција за земање на забелешки
const getNote = async (id: string): Promise<Note | null> => {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    console.log("Fetched notes:", data);
    return data as Note;
  } catch (e) {
    console.error("Error getting notes: ", e);
    return null;
  }
};

export { addNote, updateNote, getNotes, getNote, deleteNote };
