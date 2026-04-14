import React, { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";

const AddTask = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const onSubmit = (event) => {
    event.preventDefault();
    addTask({ title, priority });
    setTitle("");
    setPriority("medium");
  };

  return (
    <Stack component="form" direction={{ xs: "column", md: "row" }} spacing={1.5} onSubmit={onSubmit}>
      <TextField
        fullWidth
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        label="New task"
        placeholder="Add a new task..."
      />
      <FormControl sx={{ minWidth: { xs: "100%", md: 170 } }}>
        <InputLabel id="add-priority-label">Priority</InputLabel>
        <Select
          labelId="add-priority-label"
          value={priority}
          label="Priority"
          onChange={(event) => setPriority(event.target.value)}
        >
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" type="submit" sx={{ minWidth: { xs: "100%", md: 130 } }}>
        Add Task
      </Button>
    </Stack>
  );
};

export default AddTask;
