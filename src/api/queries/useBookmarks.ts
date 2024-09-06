import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBookmark,
  getBookmarks,
  deleteBookmark,
  updateBookmark,
} from "../../supabase";

export type Bookmark = {
  id: string; // ID треба да биде string
  title: string;
  description: string;
  url: string;
};

// Функција која се користи за добивање на податоци за обележувачи
function useBookmarksQuery() {
  return useQuery<Bookmark[]>({
    queryKey: ["bookmarks"], // Клуч за кеширање на податоците
    queryFn: getBookmarks, // Функција која ги добива податоците за обележувачите
  });
}

// Дефинирање на типот CreateBookmarkPayload со својства description, title и url, без id
type CreateBookmarkPayload = Pick<Bookmark, "description" | "title" | "url">;

// Функција која се користи за креирање на нов обележувач
function useCreateBookmarkMutation() {
  const queryClient = useQueryClient(); // Добивање на инстанца на query клиент

  return useMutation<void, unknown, CreateBookmarkPayload>({
    mutationFn: addBookmark, // Функција која додава нов обележувач
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] }); // Инвалидирање на кешот за да се обноват податоците по успешна мутација
    },
  });
}

// Функција која се користи за бришење на обележувач
function useDeleteBookmarkMutation() {
  const queryClient = useQueryClient(); // Добивање на инстанца на query клиент

  return useMutation<void, unknown, string>({
    mutationFn: deleteBookmark, // Функција која брише обележувач
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] }); // Инвалидирање на кешот за да се обноват податоците по успешна мутација
    },
  });
}

// Функција која се користи за ажурирање на обележувач
function useUpdateBookmarkMutation() {
  const queryClient = useQueryClient(); // Добивање на инстанца на query клиент

  return useMutation<void, unknown, Bookmark>({
    mutationFn: updateBookmark, // Функција која ажурира обележувач
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] }); // Инвалидирање на кешот за да се обноват податоците по успешна мутација
    },
  });
}
export type { CreateBookmarkPayload };
export {
  useBookmarksQuery,
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
  useUpdateBookmarkMutation,
};
