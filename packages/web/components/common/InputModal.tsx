import { Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  onSubmit: (string) => void;
  label: string;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const InputModal = ({ open, setOpen, title, onSubmit, label }: Props) => {
  const [input, setInput] = useState("");
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(input);
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Stack spacing={2} sx={style}>
        <Typography variant="h5">{title}</Typography>
        <TextField
          label={label}
          value={input}
          multiline
          onChange={handleChangeInput}
        />
        <Button variant="contained" disabled={!input} onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Modal>
  );
};

export default InputModal;
