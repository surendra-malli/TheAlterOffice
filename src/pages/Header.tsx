import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Tab,
  Tabs,
  Button,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import ListIcon from '@mui/icons-material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface HeaderProps {
  value: number;
  onValueChange: (value: number) => void;
}

const Header: React.FC<HeaderProps> = ({ value, onValueChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onValueChange(newValue);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0}
      sx={{
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white'
      }}
    >
      <Toolbar
        sx={{
          height: '56px',
          minHeight: '56px',
          px: 2,
          gap: 2
        }}
      >
        {/* Left section with Logo and Tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              fontWeight: 500,
              color: 'text.primary'
            }}
          >
            TaskBuddy
          </Typography>

          
        </Box>

        {/* Right section with Avatar */}
        <Box 
  sx={{ 
    marginLeft: 'auto', 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1 
  }}
>
  <Avatar
    src={user?.photoURL || undefined}
    sx={{
      width: 32,
      height: 32,
    }}
  />
  <Typography 
    sx={{
      whiteSpace: 'nowrap', 
      overflow: 'hidden',  
      textOverflow: 'ellipsis' 
    }}
  >
    {user?.displayName || 'User'} 
  </Typography>
</Box>

      </Toolbar>
      <Toolbar
        sx={{
          height: '56px',
          minHeight: '56px',
          px: 2,
          gap: 2
        }}
      >
        {/* Left section with Logo and Tabs */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              minHeight: '56px',
              '& .MuiTab-root': {
                minHeight: '56px',
                textTransform: 'none',
                fontWeight: 400,
                fontSize: '0.875rem',
                px: 1,
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab label="List" />
            <Tab label="Board" />
          </Tabs>

          
        </Box> */}

<Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
  <Tabs
    value={value}
    onChange={handleChange}
    sx={{
      minHeight: '56px',
      '& .MuiTab-root': {
        minHeight: '56px',
        textTransform: 'none',
        fontWeight: 400,
        fontSize: '0.875rem',
        px: 1,
        display: 'flex',
        flexDirection: 'row', // Icon and text side by side
        gap: '8px', // Adjust spacing between icon and text
      },
      '& .MuiTabs-indicator': {
        display: 'none',
      },
    }}
  >
    <Tab
      icon={<ListIcon fontSize="medium" sx={{ mt: '5px' }}/>}
      label="List"
    />
    <Tab
      icon={<DashboardIcon fontSize="small" />}
      label="Board"
    />
  </Tabs>
</Box>



        {/* Right section with Avatar */}
        <Box sx={{ marginLeft: 'auto' }}>
         <Button 
           onClick={handleLogout}
           variant="outlined"
           color="primary"
           size="small"
         >
           Logout
         </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;