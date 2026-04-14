import React from "react";
import { Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const priorityLabel = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const Todo = ({ todo, toggleDone, setUpdateData, deleteTask }) => {
  if (!todo.length) {
    return (
      <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderStyle: "dashed" }}>
        <Typography color="text.secondary">
          No tasks found. Add your first task above.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={1.2}>
      {todo.map((task) => (
        <Paper
          key={task.id}
          variant="outlined"
          sx={{
            p: 1.5,
            display: "grid",
            gridTemplateColumns: { xs: "36px 1fr", md: "36px 1fr auto" },
            gap: 1.5,
            alignItems: "center",
            opacity: task.completed ? 0.7 : 1,
          }}
        >
          <Checkbox
            checked={task.completed}
            onChange={() => toggleDone(task.id)}
            icon={<RadioButtonUncheckedRoundedIcon />}
            checkedIcon={<CheckCircleRoundedIcon />}
            className="task-check"
            inputProps={{ "aria-label": "toggle done" }}
          />

          <Stack spacing={0.5}>
            <Typography
              sx={{
                textDecoration: task.completed ? "line-through" : "none",
                wordBreak: "break-word",
                fontWeight: 500,
              }}
            >
              {task.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                label={priorityLabel[task.priority]}
                color={
                  task.priority === "high"
                    ? "error"
                    : task.priority === "medium"
                    ? "warning"
                    : "success"
                }
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {new Date(task.createdAt).toLocaleDateString("en-US")}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.5} justifySelf={{ md: "end" }}>
            <IconButton
              onClick={() => setUpdateData(task)}
              disabled={task.completed}
              aria-label="edit task"
              color="primary"
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => deleteTask(task.id)}
              aria-label="delete task"
              color="error"
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default Todo;
