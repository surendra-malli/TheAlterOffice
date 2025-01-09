import React, { useState, ChangeEvent, DragEvent, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  FormHelperText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (taskData: TaskFormData) => void;
  initialData?: {
    title: string;
    description: string;
    category: 'work' | 'personal';
    dueDate: string;
    attachments: string[];
    status?: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
  };
  isEditing?: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  category: 'work' | 'personal';
  dueDate: string;
  attachments: string[];
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
}

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

interface TextFormatting {
  bold: boolean;
  italic: boolean;
  bulletList: boolean;
  numberList: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  open, 
  onClose, 
  onSubmit,
  initialData,
  isEditing = false 
}) => {
  // Form state
  const [formData, setFormData] = useState<TaskFormData>(() => {
    // Format the initial date if it exists
    const initialDate = initialData?.dueDate 
      ? new Date(initialData.dueDate).toISOString().split('T')[0]
      : '';

    return {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'work',
      dueDate: initialDate,
      attachments: initialData?.attachments || [],
      status: initialData?.status || 'TO-DO'
    };
  });

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'category' ? (value as 'work' | 'personal') : field === 'status' ? (value as 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED') : value
    }));
  };

  // Validation errors state
  const [errors, setErrors] = useState<FormErrors>({});

  // Text formatting state
  const [textFormatting, setTextFormatting] = useState<TextFormatting>({
    bold: false,
    italic: false,
    bulletList: false,
    numberList: false,
  });

  // Drag state
  const [isDragging, setIsDragging] = useState(false);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.dueDate 
        ? new Date(initialData.dueDate).toISOString().split('T')[0]
        : '';

      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        category: initialData.category,
        dueDate: formattedDate,
        attachments: initialData.attachments || [],
        status: initialData.status || 'TO-DO'
      });
    }
  }, [initialData]);

  // Handle text formatting
  const handleFormatting = (format: keyof TextFormatting) => {
    setTextFormatting(prev => ({

      ...prev,
      [format]: !prev[format]
    }));

    // Apply formatting to description text
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = formData.description.substring(start, end);
      let formattedText = selectedText;

      switch(format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'bulletList':
          formattedText = selectedText.split('\n').map(line => `• ${line}`).join('\n');
          break;
        case 'numberList':
          formattedText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
          break;
      }

      const newDescription = formData.description.substring(0, start) + formattedText + formData.description.substring(end);
      setFormData(prev => ({ ...prev, description: newDescription }));
    }
  };

  // Handle file drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  // Handle file input
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    const fileNames = validFiles.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileNames]
    }));
  };

  // Remove attachment
  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm() && onSubmit) {
      onSubmit({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        dueDate: formData.dueDate,
        attachments: formData.attachments,
        status: formData.status
      });
      handleClose();
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'work',
      dueDate: '',
      attachments: [],
      status: 'TO-DO'
    });
    setErrors({});
    setTextFormatting({
      bold: false,
      italic: false,
      bulletList: false,
      numberList: false,
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEditing ? 'Edit Task' : 'Create New Task'}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
          />

          {/* Status Dropdown - Only show when editing */}
          {isEditing && (
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="TO-DO">To Do</MenuItem>
                <MenuItem value="IN-PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
            </Select>
          </FormControl>

          {/* Due Date Field */}
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
            InputLabelProps={{ shrink: true }}
          />

          {/* Description Field */}
          <Box sx={{ mb: 2 }}>
            <ToggleButtonGroup
              size="small"
              aria-label="text formatting"
              sx={{ mb: 1 }}
            >
              <ToggleButton 
                value="bold" 
                selected={textFormatting.bold}
                onChange={() => handleFormatting('bold')}
              >
                <FormatBoldIcon />
              </ToggleButton>
              <ToggleButton 
                value="italic" 
                selected={textFormatting.italic}
                onChange={() => handleFormatting('italic')}
              >
                <FormatItalicIcon />
              </ToggleButton>
              <ToggleButton 
                value="bullet-list" 
                selected={textFormatting.bulletList}
                onChange={() => handleFormatting('bulletList')}
              >
                <FormatListBulletedIcon />
              </ToggleButton>
              <ToggleButton 
                value="number-list" 
                selected={textFormatting.numberList}
                onChange={() => handleFormatting('numberList')}
              >
                <FormatListNumberedIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              fullWidth
              placeholder="Description"
              multiline
              rows={4}
              variant="outlined"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>

          {/* Attachment Field */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Attachment</Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? '#9c27b0' : '#ccc',
                borderRadius: '4px',
                p: 2,
                textAlign: 'center',
                color: '#666',
                bgcolor: isDragging ? 'rgba(156, 39, 176, 0.08)' : 'transparent',
                transition: 'all 0.3s ease',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input">
                <Typography variant="body2">
                  Drop your files here or{' '}
                  <Button
                    component="span"
                    sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                  >
                    Update
                  </Button>
                </Typography>
              </label>
            </Box>

            {formData.attachments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {formData.attachments.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon sx={{ fontSize: 20 }} />
                      <Typography variant="body2">{file}</Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <DeleteIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '16px' }}>
        <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            textTransform: 'none',
            bgcolor: '#9c27b0',
            '&:hover': {
              bgcolor: '#7b1fa2'
            }
          }}
        >
          {isEditing ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;