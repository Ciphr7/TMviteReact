import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


const Header = ({ title }) => {
  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar style={{background : '#f44336 ', padding: '20px' }}>
       
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        {title} <span style={{fontSize:18}} >&reg;</span>
        </Typography>
       
      </Toolbar>
    </AppBar>
  </Box>
   
    </>
  );
};

Header.defaultProps = {
  title: 'default title',
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
