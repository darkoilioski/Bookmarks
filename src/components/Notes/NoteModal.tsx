import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Note,
  useCreateNoteMutation,
  useNoteQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../../api/queries/useNotes";

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(3000, "Content must be at most 3000 characters"),
});

export type Schema = z.infer<typeof schema>;

type NoteEditorProps = {
  note?: Note;
};

const NoteEditor: React.FC<NoteEditorProps> = ({ note }: NoteEditorProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      content: note?.content ?? "",
      title: note?.title ?? "",
    },
    resolver: zodResolver(schema),
  });

  const updateNoteMutation = useUpdateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);
  const navigate = useNavigate();
  const createNoteMutation = useCreateNoteMutation();

  useEffect(() => {
    if (note) {
      setValue("title", note.title);
      setValue("content", note.content);
      setContent(note.content);
      setTitle(note.title);
    } else {
      reset();
    }
  }, [note, setValue, reset]);

  const onSubmit = (data: Schema) => {
    const { title, content } = data;

    if (note === undefined) {
      createNoteMutation.mutate(
        { title, content },
        {
          onSuccess: () => {
            navigate("/notes");
          },
        }
      );
    } else {
      updateNoteMutation.mutate(
        {
          id: note.id,
          title,
          content,
        },
        {
          onSuccess: () => {
            navigate("/notes");
          },
        }
      );
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (confirmed && note) {
      deleteNoteMutation.mutate(note.id, {
        onSuccess: () => {
          navigate("/notes");
        },
      });
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: "100%",
        margin: "0",
        backgroundColor: "#e3f2fd",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "54px",
          backgroundColor: "#3f98e5",
          padding: "0 16px",
          color: "#fff",
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <IconButton
          onClick={() => navigate("/notes")}
          sx={{ position: "absolute", left: 0, color: "#fff" }}
          title="Back"
        >
          <ArrowBackIcon />
        </IconButton>

        {!isTitleEditing ? (
          <Typography
            onClick={() => setIsTitleEditing(true)}
            sx={{
              flex: 1,
              textAlign: "center",
              fontSize: "1.25rem",
              lineHeight: "54px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              cursor: "pointer",
              color: errors.title ? "red" : "inherit",
            }}
          >
            {title || "Untitled"}
          </Typography>
        ) : (
          <TextField
            {...register("title")}
            value={title}
            onChange={handleTitleChange}
            onBlur={() => {
              setIsTitleEditing(false);
              setValue("title", title);
            }}
            autoFocus
            sx={{
              backgroundColor: "#fff",
              borderRadius: "4px",
              width: "100%",
              margin: 0,
              "& input": {
                textAlign: "center",
                fontSize: "1.25rem",
              },
            }}
            placeholder="Title"
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ""}
          />
        )}

        <Box sx={{ position: "absolute", right: 0, display: "flex", gap: 1 }}>
          {note && (
            <IconButton
              sx={{ color: "#fff" }}
              onClick={handleDelete}
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ReactQuill
              value={content}
              onChange={(value) => {
                setContent(value);
                setValue("content", value);
              }}
              placeholder="Content"
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  [{ header: 1 }, { header: 2 }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                ],
              }}
            />
            {errors.content && (
              <Typography color="error">{errors.content.message}</Typography>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button type="submit" variant="contained" color="primary">
              {note ? "Update" : "Add"}
            </Button>
            <Button
              onClick={() => navigate("/notes")}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

function NoteEditorWrapper() {
  const { noteId } = useParams();
  const noteQuery = useNoteQuery(noteId);

  if (noteId !== undefined && noteQuery.isPending) {
    return <div>Loading ...</div>;
  }

  if (noteId !== undefined && noteQuery.isError) {
    return <div style={{ color: "red" }}>Error: {noteQuery.error.message}</div>;
  }

  return <NoteEditor note={noteQuery.data ?? undefined} />;
}

export default NoteEditorWrapper;
