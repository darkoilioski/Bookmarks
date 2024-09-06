import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotes, addNote, deleteNote, updateNote, getNote } from "../../noteServise"; // Импортирајте ги функциите од noteService

export type Note = {
  id: string;
  title: string;
  content: string;
};

// Функција која се користи за добивање на податоци за забелешките
function useNotesQuery() {
  return useQuery<Note[]>({
    queryKey: ["notes"], // Клуч за кеширање на податоците
    queryFn: getNotes, // Функција која ги добива податоците за забелешките
  });
}

function useNoteQuery(id?: string) {
  return useQuery<Note | null>({
    queryKey: ["note", id],
    queryFn: id !== undefined ? () => getNote(id) : skipToken,
  });
}

// Дефинирање на типот CreateNotePayload со својства title и content, без id
type CreateNotePayload = Pick<Note, "title" | "content">;

// Функција која се користи за креирање на нова забелешка
function useCreateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, CreateNotePayload>({
    mutationFn: addNote, // Функција која додава нова забелешка
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // Инвалидирање на кешот за да се обноват податоците по успешна мутација
    },
  });
}

// Функција која се користи за бришење на забелешка
function useDeleteNoteMutation() {
  const queryClient = useQueryClient(); // Добивање на инстанца на query клиент

  return useMutation<void, unknown, string>({
    mutationFn: deleteNote, // Функција која брише забелешка
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // Инвалидирање на кешот за да се обноват податоците по успешна мутација
    },
  });
}

// Функција која се користи за ажурирање на забелешка
function useUpdateNoteMutation() {
  const queryClient = useQueryClient(); // Добивање на инстанца на query клиент

  return useMutation<void, unknown, Note>({
    mutationFn: updateNote, // Функција која ажурира забелешка
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // Инвалидирање на кешот за да се обноват податоците по успешна мутација
    },
  });
}

export type { CreateNotePayload };
export {
  useNotesQuery,
  useNoteQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
};
