import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import Logo from '~/public/icvcm_logo.png';

type Props = {}

const Navbar = (props: Props) => {
  return <Box sx={{ flexGrow: 1 }}>
    <AppBar position='static' sx={{}}>
      <Toolbar >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, flexGrow: 1, justifyContent: 'flex-start' }}
        >
          <Image src="/icvcm_logo.svg" width={200} height={50} />
        </IconButton>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  </Box>;

};

export default Navbar;