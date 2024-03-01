import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import NewLabelForm from "../forms/NewLabelForm";

export default function AddLabel() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = searchParams.get("label") === "1";
  function closeModal() {
    setSearchParams((state) => {
      state.delete("label");
      return state;
    });
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={closeModal}
      PaperProps={{
        style: { background: "#0d0d0d" },
      }}
    >
      <DialogTitle>Add new label</DialogTitle>
      <DialogContent>
        <NewLabelForm />
      </DialogContent>
    </Dialog>
  );
}
