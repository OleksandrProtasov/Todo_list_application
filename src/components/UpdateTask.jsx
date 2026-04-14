import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

const UpdateTask = ({ updateData, saveUpdate, cancelUpdate }) => {
  const [title, setTitle] = useState(updateData.title);
  const [priority, setPriority] = useState(updateData.priority);

  const onSubmit = (event) => {
    event.preventDefault();
    saveUpdate({ ...updateData, title, priority });
  };

  return (
    <Stack component="form" direction={{ xs: "column", md: "row" }} spacing={1.5} onSubmit={onSubmit}>
      <TextField
        fullWidth
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        label="Task"
        placeholder="Edit task..."
      />
      <FormControl sx={{ minWidth: { xs: "100%", md: 170 } }}>
        <InputLabel id="edit-priority-label">Priority</InputLabel>
        <Select
          labelId="edit-priority-label"
          value={priority}
          label="Priority"
          onChange={(event) => setPriority(event.target.value)}
        >
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" type="submit" sx={{ minWidth: { xs: "100%", md: 110 } }}>
        Save
      </Button>
      <Button
        variant="outlined"
        type="button"
        onClick={cancelUpdate}
        sx={{ minWidth: { xs: "100%", md: 110 } }}
      >
        Cancel
      </Button>
    </Stack>
  );
};

export default UpdateTask;
