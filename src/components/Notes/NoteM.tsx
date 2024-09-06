import React, { useEffect } from "react";
import { Box, Button, Typography, Modal, TextField, Grid, Fade } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Note } from "../../api/queries/useNotes";

// Define validation schema with Zod
const schema = z.object({
  title: z.string().min(3).max(50),
  content: z.string().min(10).max(200),
});

export type Schema = z.infer<typeof schema>;

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type NoteModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmitData: (title: string, content: string) => void;
  note?: Note;
};

const NoteModal: React.FC<NoteModalProps> = ({
  open,
  onClose,
  onSubmitData,
  note,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,

  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || ""
    }
  });

  useEffect(() => {
    if (note) {
      setValue("title", note.title);
      setValue("content", note.content);
    } else {
      reset();
    }
  }, [note, setValue, reset]);

  const onSubmit = (data: Schema) => {
    const { title, content } = data;
    onSubmitData(title, content);
    onClose();
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {note ? "Edit Note" : "Add Note"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("title")}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message?.toString() : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("content")}
                  label="Content"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.content}
                  helperText={errors.content ? errors.content.message?.toString() : ""}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  {note ? "Update" : "Add"}
                </Button>
                <Button onClick={onClose} variant="outlined" color="secondary">
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

export { NoteModal };
