import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Grid,
  TextField,
  Fade,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bookmark } from "../../api/queries/useBookmarks";

// Дефинирање на валидациски шема со Zod
const schema = z.object({
  url: z.string().url(),
  title: z.string().min(3).max(50),
  description: z.string().min(10).max(200),
});

export type Schema = z.infer<typeof schema>;

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  paddingTop: "50px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// Типови на пропсите за компонентата BookmarkModal
type AddBookmarkModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmitData: (title: string, url: string, description: string) => void;
  bookmark?: Bookmark;
};

const BookmarkModal: React.FC<AddBookmarkModalProps> = ({
  open,
  onClose,
  onSubmitData,
  bookmark,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (bookmark) {
      // Ако имаме обележувач, поставуваме неговите вредности во формата
      setValue("url", bookmark.url);
      setValue("title", bookmark.title);
      setValue("description", bookmark.description);
    } else {
      // Ако нема обележувач, рестартирај ја формата
      reset();
    }
  }, [bookmark, setValue, reset]);

  const onSubmit = (data: Schema) => {
    const { title, url, description } = data;
    onSubmitData(title, url, description);
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {bookmark ? "Edit Bookmark" : "Add Bookmark"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("url")}
                  label="URL"
                  fullWidth
                  error={!!errors.url}
                  helperText={errors.url ? errors.url.message?.toString() : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("title")}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={
                    errors.title ? errors.title.message?.toString() : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("description")}
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.description}
                  helperText={
                    errors.description
                      ? errors.description.message?.toString()
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "grid", gap: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onClose();
                    reset();
                  }}
                  variant="contained"
                  sx={{ backgroundColor: "#f44336", color: "#fff" }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export { BookmarkModal };
