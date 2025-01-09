import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export type FilterCategory = 'all' | 'work' | 'personal';

interface Filters {
  category: FilterCategory;
  dueDate: string;
  searchQuery: string;
}

interface SearchFilterProps {
  onAddTask: () => void;
  onFilterChange: (filters: Filters) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onAddTask, onFilterChange }) => {
  const [category, setCategory] = useState<FilterCategory>('all');
  const [dueDate, setDueDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleFilterChange = (
    newCategory?: FilterCategory,
    newDueDate?: string,
    newSearchQuery?: string
  ) => {
    const updatedFilters: Filters = {
      category: newCategory ?? category,
      dueDate: newDueDate ?? dueDate,
      searchQuery: newSearchQuery ?? searchQuery,
    };
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    setCategory('all');
    setDueDate('');
    setSearchQuery('');
    onFilterChange({
      category: 'all',
      dueDate: '',
      searchQuery: '',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        padding: 2,
        backgroundColor: 'white',
        boxShadow: 1,
      }}
    >
      {/* First Row - Filters */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: 'wrap',
          width: '100%'
        }}
      >
        <span style={{ color: '#6B7280', marginRight: '8px' }}>Filter by:</span>

        {/* Category Filter */}
        <FormControl size="small" sx={{ minWidth: 120, flexGrow: { xs: 1, sm: 0 } }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => {
              const newCategory = e.target.value as FilterCategory;
              setCategory(newCategory);
              handleFilterChange(newCategory);
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="personal">Personal</MenuItem>
          </Select>
        </FormControl>

        {/* Due Date Filter */}
        <TextField
          type="date"
          size="small"
          label="Due Date"
          value={dueDate}
          onChange={(e) => {
            const newDueDate = e.target.value;
            setDueDate(newDueDate);
            handleFilterChange(undefined, newDueDate);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ flexGrow: { xs: 1, sm: 0 } }}
        />
      </Box>

      {/* Second Row - Search, Reset, and Add */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          width: '100%'
        }}
      >
        {/* Search Field */}
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => {
            const newSearchQuery = e.target.value;
            setSearchQuery(newSearchQuery);
            handleFilterChange(undefined, undefined, newSearchQuery);
          }}
          sx={{ flexGrow: 1 }}
        />

        {/* Reset Button */}
        <Tooltip title="Reset Filters">
          <IconButton onClick={handleReset} size="small">
            <RestartAltIcon />
          </IconButton>
        </Tooltip>

        {/* Add Task Button */}
        <Button
          variant="contained"
          onClick={onAddTask}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Add Task
        </Button>
      </Box>
    </Box>
  );
};

export default SearchFilter;
