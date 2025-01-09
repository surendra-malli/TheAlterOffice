import React, { useState, ReactElement, StrictMode } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Header from './Header';
import SearchFilter, { FilterCategory } from './SearchFilter';
import TaskForm from "../components/Task/TaskForm";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';

interface Task {
  id: string;
  title: string;
  date: string;
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
  category: 'WORK' | 'PERSONAL';
  isChecked: boolean;
  description: string;
  attachments: string[];
}

interface TaskFormData {
  title: string;
  description: string;
  category: 'work' | 'personal';
  dueDate: string;
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
  attachments: string[];
}

interface TaskState {
  todo: Task[];
  inProgress: Task[];
  completed: Task[];
}

interface Filters {
  category: FilterCategory;
  dueDate: string;
  searchQuery: string;
}

const formatDate = (date: string): string => {
  if (date === 'Today') {
    return new Date().toISOString().split('T')[0];
  }
  // Convert date string to ISO format
  const parsedDate = new Date(date);
  return parsedDate.toISOString().split('T')[0];
};

const sampleTasks: TaskState = {
  todo: [
    {
      id: '1',
      title: 'Interview with Design Team',
      date: '2025-01-09', // ISO format
      status: 'TO-DO',
      category: 'WORK',
      isChecked: false,
      description: '',
      attachments: []
    },
    {
      id: '2',
      title: 'Team Meeting',
      date: '2024-12-30', // ISO format
      status: 'TO-DO',
      category: 'PERSONAL',
      isChecked: false,
      description: '',
      attachments: []
    },
    {
      id: '3',
      title: 'Design a Dashboard page along with wireframes',
      date: '2024-12-31', // ISO format
      status: 'TO-DO',
      category: 'WORK',
      isChecked: false,
      description: '',
      attachments: []
    }
  ],
  inProgress: [
    {
      id: '4',
      title: 'Morning Workout',
      date: '2024-12-30', // ISO format
      status: 'IN-PROGRESS',
      category: 'WORK',
      isChecked: false,
      description: '',
      attachments: []
    },
    {
      id: '5',
      title: 'Code Review',
      date: '2024-12-30', // ISO format
      status: 'IN-PROGRESS',
      category: 'PERSONAL',
      isChecked: false,
      description: '',
      attachments: []
    },
    {
      id: '6',
      title: 'Update Task Tracker',
      date: '2024-12-25', // ISO format
      status: 'IN-PROGRESS',
      category: 'WORK',
      isChecked: false,
      description: '',
      attachments: []
    }
  ],
  completed: [
    {
      id: '7',
      title: 'Submit Project Proposal',
      date: '2024-12-30', // ISO format
      status: 'COMPLETED',
      category: 'WORK',
      isChecked: true,
      description: '',
      attachments: []
    },
    {
      id: '8',
      title: 'Birthday Gift Shopping',
      date: '2024-12-30', // ISO format
      status: 'COMPLETED',
      category: 'PERSONAL',
      isChecked: true,
      description: '',
      attachments: []
    },
    {
      id: '9',
      title: 'Client Presentation',
      date: '2024-12-25', // ISO format
      status: 'COMPLETED',
      category: 'WORK',
      isChecked: true,
      description: '',
      attachments: []
    }
  ]
};

const Home = () => {
  const [tasks, setTasks] = useState<TaskState>(sampleTasks);
  const [tabValue, setTabValue] = useState(0);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData | null>(null);
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    dueDate: '',
    searchQuery: '',
  });

  const filterTasks = (taskList: Task[]): Task[] => {
    return taskList.filter(task => {
      // Category filter
      if (filters.category !== 'all' && task.category.toLowerCase() !== filters.category) {
        return false;
      }

      // Due date filter
      if (filters.dueDate && task.date !== filters.dueDate) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  const getFilteredTasks = (): TaskState => {
    return {
      todo: filterTasks(tasks.todo),
      inProgress: filterTasks(tasks.inProgress),
      completed: filterTasks(tasks.completed),
    };
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
    setEditingTask(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit = [...tasks.todo, ...tasks.inProgress, ...tasks.completed]
      .find(task => task.id === taskId);
    
    if (taskToEdit) {
      const taskForEdit: TaskFormData = {
        title: taskToEdit.title,
        description: taskToEdit.description,
        category: taskToEdit.category.toLowerCase() as 'work' | 'personal',
        dueDate: taskToEdit.date,
        status: taskToEdit.status,
        attachments: taskToEdit.attachments
      };
      setEditingTask(taskToEdit);
      setFormData(taskForEdit);
      setShowTaskForm(true);
    }
    handleMenuClose();
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = {
      todo: tasks.todo.filter(task => task.id !== taskId),
      inProgress: tasks.inProgress.filter(task => task.id !== taskId),
      completed: tasks.completed.filter(task => task.id !== taskId)
    };
    setTasks(newTasks);
    handleMenuClose();
  };

  const handleToggleTask = (taskId: string) => {
    const updateTaskList = (taskList: Task[]) => 
      taskList.map(task => 
        task.id === taskId ? { ...task, isChecked: !task.isChecked } : task
      );

    setTasks({
      todo: updateTaskList(tasks.todo),
      inProgress: updateTaskList(tasks.inProgress),
      completed: updateTaskList(tasks.completed)
    });
  };

  const handleAddTask = () => {
    const newTask = prompt('Enter a task:');
    if (newTask) {
      setTasks((prev) => ({
        ...prev,
        todo: [...prev.todo, { id: Math.random().toString(), title: newTask, date: 'Today', status: 'TO-DO', category: 'WORK', isChecked: false, description: '', attachments: [] }],
      }));
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Convert droppableId to the correct key for our state
    const sourceKey = source.droppableId as keyof TaskState;
    const destinationKey = destination.droppableId as keyof TaskState;

    // Create a new tasks object
    const newTasks = { ...tasks };

    // Remove task from source
    const [removedTask] = newTasks[sourceKey].splice(source.index, 1);

    // Update task status based on destination
    const newStatus = destinationKey === 'todo' ? 'TO-DO' 
                   : destinationKey === 'inProgress' ? 'IN-PROGRESS'
                   : 'COMPLETED';
    
    removedTask.status = newStatus;

    // Add task to destination
    newTasks[destinationKey].splice(destination.index, 0, removedTask);

    // Update state
    setTasks(newTasks);
  };

  const handleTaskSubmit = (taskData: TaskFormData) => {
    if (editingTask) {
      // Update existing task
      const updatedTask: Task = {
        id: editingTask.id,
        title: taskData.title,
        date: taskData.dueDate,
        status: taskData.status,
        category: taskData.category.toUpperCase() as 'WORK' | 'PERSONAL',
        isChecked: editingTask.isChecked,
        description: taskData.description || '',
        attachments: taskData.attachments || []
      };

      // Find which list contains the task and update it
      const listKey = editingTask.status === 'TO-DO' ? 'todo' : 
                     editingTask.status === 'IN-PROGRESS' ? 'inProgress' : 'completed';
      const newListKey = taskData.status === 'TO-DO' ? 'todo' :
                        taskData.status === 'IN-PROGRESS' ? 'inProgress' : 'completed';

      setTasks(prev => {
        // Remove from old list
        const newState = {
          todo: [...prev.todo],
          inProgress: [...prev.inProgress],
          completed: [...prev.completed]
        };
        
        // Remove from old list
        newState[listKey] = newState[listKey].filter(task => task.id !== editingTask.id);
        
        // Add to new list
        newState[newListKey] = [...newState[newListKey], updatedTask];

        return newState;
      });

      setEditingTask(null);
    } else {
      // Create new task
      const taskId = Math.random().toString();
      const task: Task = {
        id: taskId,
        title: taskData.title,
        date: taskData.dueDate,
        status: 'TO-DO',
        category: taskData.category.toUpperCase() as 'WORK' | 'PERSONAL',
        isChecked: false,
        description: taskData.description || '',
        attachments: taskData.attachments || []
      };
      setTasks(prev => ({
        ...prev,
        todo: [...prev.todo, task]
      }));
    }
    setShowTaskForm(false);
  };

  const handleShowTaskForm = (task?: Task) => {
    if (task) {
      // Editing existing task
      const taskForEdit: TaskFormData = {
        title: task.title,
        description: task.description,
        category: task.category.toLowerCase() as 'work' | 'personal',
        dueDate: task.date,
        status: task.status,
        attachments: task.attachments
      };
      setEditingTask(task);
      setFormData(taskForEdit);
    } else {
      // Creating new task
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        category: 'work',
        dueDate: '',
        status: 'TO-DO',
        attachments: []
      });
    }
    setShowTaskForm(true);
  };

  const renderTaskSection = (
    title: string,
    color: string,
    taskList: Task[]
  ) => (
    <Accordion 
      sx={{
        marginTop: 2,
        '& .MuiAccordionSummary-root': {
          backgroundColor: color,
          '&:hover': {
            backgroundColor: color
          }
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h6">{title} ({taskList.length})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {title === 'To-Do' && (
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleShowTaskForm()}
            sx={{ mb: 2 }}
          >
            ADD TASK
          </Button>
        )}
        {taskList.length === 0 ? (
          <Typography>No Tasks in {title}</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {taskList.map((task) => (
              <Box
                key={task.id}
                onClick={() => {
                  // Only trigger edit on mobile view
                  if (window.innerWidth < 900) { // md breakpoint is 900px
                    handleEditTask(task.id);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  cursor: { xs: 'pointer', md: 'default' },
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: {
                    xs: '40px auto 48px', // Mobile: checkbox, title, menu
                    md: '40px auto 120px 120px 120px 48px' // Desktop: full layout
                  },
                  alignItems: 'center',
                  gap: { xs: 1, md: 2 },
                  width: '100%'
                }}>
                  <input
                    type="checkbox"
                    checked={task.isChecked}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent edit dialog from opening
                      handleToggleTask(task.id);
                    }}
                  />
                  <Typography 
                    sx={{ 
                      textDecoration: task.isChecked ? 'line-through' : 'none',
                      color: task.isChecked ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {task.title}
                  </Typography>
                  {/* Hide these on mobile */}
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ display: { xs: 'none', md: 'block' } }}
                  >
                    {formatDate(task.date)}
                  </Typography>
                  <Box 
                    sx={{ 
                      display: { xs: 'none', md: 'block' },
                      bgcolor: task.status === 'TO-DO' ? '#F8BBD0' : 
                             task.status === 'IN-PROGRESS' ? '#B3E5FC' : '#C8E6C9',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="caption">
                      {task.status}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: { xs: 'none', md: 'block' },
                      textAlign: 'center' 
                    }}
                  >
                    {task.category}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent edit dialog from opening
                      handleMenuOpen(e, task.id);
                    }}
                    sx={{ ml: 'auto' }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };
console.log(tabValue,"tabValue")
  return (
    <Box sx={{ height: '100vh', backgroundColor: '#F3F4F6' }}>
      <Header value={tabValue} onValueChange={handleTabChange} />
      <Box sx={{ padding: 3 }}>
        <SearchFilter 
          onAddTask={() => handleShowTaskForm()}
          onFilterChange={handleFilterChange}
        />
        
        {/* On mobile: always show list view. On desktop: show based on tab value */}
        <Box sx={{ display: { xs: 'block', md: tabValue === 0 ? 'block' : 'none' } }}>
          <Box sx={{ padding: 2 }}>
            {renderTaskSection('To-Do', '#FCE4EC', getFilteredTasks().todo)}
            {renderTaskSection('In Progress', '#E3F2FD', getFilteredTasks().inProgress)}
            {renderTaskSection('Completed', '#C8E6C9', getFilteredTasks().completed)}
          </Box>
        </Box>

        {/* Board view - only visible on desktop */}
        <Box sx={{ display: { xs: 'none', md: tabValue === 1 ? 'block' : 'none' } }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Box display="flex" justifyContent="space-between" padding={2} sx={{ flex: 1, overflowY: 'auto' }}>
              {/* TO-DO Column */}
              <Card sx={{ width: "32%", backgroundColor: "#f8f8f8", boxShadow: 'none', borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    mb: 2,
                    bgcolor: '#FCE4EC',
                    p: 1,
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    TO-DO
                  </Typography>
                  <StrictModeDroppable droppableId="todo">
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: 100 }}
                      >
                        {getFilteredTasks().todo.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ mb: 2, bgcolor: 'white' }}
                              >
                                <CardContent>
                                  <Typography>{task.title}</Typography>
                                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(task.date)}
                                    </Typography>
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, task.id)}>
                                      <MoreVertIcon />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </StrictModeDroppable>
                </CardContent>
              </Card>

              {/* IN PROGRESS Column */}
              <Card sx={{ width: "32%", backgroundColor: "#f8f8f8", boxShadow: 'none', borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    mb: 2,
                    bgcolor: '#E3F2FD',
                    p: 1,
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    IN PROGRESS
                  </Typography>
                  <StrictModeDroppable droppableId="inProgress">
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: 100 }}
                      >
                        {getFilteredTasks().inProgress.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ mb: 2, bgcolor: 'white' }}
                              >
                                <CardContent>
                                  <Typography>{task.title}</Typography>
                                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(task.date)}
                                    </Typography>
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, task.id)}>
                                      <MoreVertIcon />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </StrictModeDroppable>
                </CardContent>
              </Card>

              {/* COMPLETED Column */}
              <Card sx={{ width: "32%", backgroundColor: "#f8f8f8", boxShadow: 'none', borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    mb: 2,
                    bgcolor: '#C8E6C9',
                    p: 1,
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    COMPLETED
                  </Typography>
                  <StrictModeDroppable droppableId="completed">
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: 100 }}
                      >
                        {getFilteredTasks().completed.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ mb: 2, bgcolor: 'white' }}
                              >
                                <CardContent>
                                  <Typography>{task.title}</Typography>
                                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(task.date)}
                                    </Typography>
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, task.id)}>
                                      <MoreVertIcon />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </StrictModeDroppable>
                </CardContent>
              </Card>
            </Box>
          </DragDropContext>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedTaskId && handleEditTask(selectedTaskId)}>
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => selectedTaskId && handleDeleteTask(selectedTaskId)}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>

      <TaskForm 
        open={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
          setFormData(null);
        }}
        onSubmit={handleTaskSubmit}
        initialData={formData || undefined}
        isEditing={!!editingTask}
      />
    </Box>
  );
};

export default Home;
