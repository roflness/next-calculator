import * as React from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';import MainForm from './MainForm'; 

const Page: NextPage = () => {
    return (
      <Container maxWidth='lg'>
      <Box
        sx={{
          my: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' color='primary'>
          <div>
            <MainForm />
           </div>
        </Typography>
      </Box>
    </Container>
    )
};

export default Page;