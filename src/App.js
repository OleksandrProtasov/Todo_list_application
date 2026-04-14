import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  CssBaseline,
  Box,
  Card,
  Chip,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ThemeProvider, alpha, createTheme } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddTask from "./components/AddTask";
import UpdateTask from "./components/UpdateTask";
import Todo from "./components/Todo";

const STORAGE_KEY = "todo-list-modern-v1";

const initialSeed = [
  {
    id: crypto.randomUUID(),
    title: "Prepare weekly report",
    priority: "high",
    completed: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: crypto.randomUUID(),
    title: "Refresh task card UI",
    priority: "medium",
    completed: true,
    createdAt: Date.now() - 8600000,
  },
];

const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#8b7bff" },
    secondary: { main: "#3ee3ff" },
    background: {
      default: "#050816",
      paper: "rgba(13, 20, 44, 0.82)",
    },
    text: {
      primary: "#edf3ff",
      secondary: "#aebadd",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "Arial", "sans-serif"].join(","),
    h4: { fontWeight: 700, letterSpacing: 0.2 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: alpha("#9fb2ff", 0.2),
          background: "linear-gradient(155deg, rgba(22, 30, 62, 0.8), rgba(13, 20, 44, 0.8))",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#8ea6ff", 0.08),
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#9fb2ff", 0.24),
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#9fb2ff", 0.4),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8b7bff",
            borderWidth: 1,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        contained: {
          background: "linear-gradient(100deg, #7e6dff, #3ee3ff)",
          color: "#061123",
          "&:hover": {
            background: "linear-gradient(100deg, #7564f8, #35d8f5)",
          },
        },
      },
    },
  },
});

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialSeed;
    } catch (error) {
      return initialSeed;
    }
  });
  const [updateData, setUpdateData] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = ({ title, priority }) => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      title: normalizedTitle,
      priority,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newEntry, ...prev]);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (updateData?.id === id) {
      setUpdateData(null);
    }
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const cancelUpdate = () => {
    setUpdateData(null);
  };

  const saveUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? { ...task, title: updatedTask.title.trim(), priority: updatedTask.priority }
          : task
      )
    );
    setUpdateData(null);
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.completed).length;
    const pending = total - done;
    const highPriority = tasks.filter(
      (task) => task.priority === "high" && !task.completed
    ).length;
    return { total, done, pending, highPriority };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const normalizedQuery = query.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        if (statusFilter === "active" && task.completed) return false;
        if (statusFilter === "completed" && !task.completed) return false;
        if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
        if (normalizedQuery && !task.title.toLowerCase().includes(normalizedQuery)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === "oldest") {
          return a.createdAt - b.createdAt;
        }
        return b.createdAt - a.createdAt;
      });
  }, [tasks, query, statusFilter, priorityFilter, sortBy]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        <Card className="app-surface" sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 1.2 }}>
                Modern productivity stack
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                Todo List / Task Manager
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`Total: ${stats.total}`} variant="outlined" />
              <Chip label={`Active: ${stats.pending}`} color="info" variant="outlined" />
              <Chip label={`Done: ${stats.done}`} color="success" variant="outlined" />
              <Chip label={`High: ${stats.highPriority}`} color="error" variant="outlined" />
            </Stack>
          </Stack>

          {updateData ? (
            <UpdateTask updateData={updateData} saveUpdate={saveUpdate} cancelUpdate={cancelUpdate} />
          ) : (
            <AddTask addTask={addTask} />
          )}

          <Grid container spacing={1.5}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tasks..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <MenuItem value="all">All statuses</MenuItem>
                  <MenuItem value="active">Active only</MenuItem>
                  <MenuItem value="completed">Completed only</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  value={priorityFilter}
                  label="Priority"
                  onChange={(event) => setPriorityFilter(event.target.value)}
                >
                  <MenuItem value="all">All priorities</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortBy}
                  label="Sort"
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <MenuItem value="newest">Newest first</MenuItem>
                  <MenuItem value="oldest">Oldest first</MenuItem>
                  <MenuItem value="priority">By priority</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Todo
            todo={filteredTasks}
            toggleDone={toggleDone}
            setUpdateData={setUpdateData}
            deleteTask={deleteTask}
          />
          </Stack>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
