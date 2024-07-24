// src/styles/myComponentStyles.ts
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';


export const Msform = styled(Box)(({ theme }) => ({
    width: 450,
    margin: '50px auto',
    textAlign: 'center',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      width: '80%',
      margin: '20px auto',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      margin: '10px auto',
    },
  }));
  
  export const Fieldset = styled('fieldset')(({ theme }) => ({
    background: 'white',
    border: 'none',
    borderRadius: '3px',
    boxShadow: '0 0 15px 1px rgba(0, 0, 0, 0.4)',
    padding: '20px 30px',
    boxSizing: 'border-box',
    width: '80%',
    margin: '0 10%',
    position: 'relative',
    '&:not(:first-of-type)': {
      display: 'none',
    },
  }));

  export const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2), // Adjust the spacing as needed
    width: '100%',
  }));

  export const Fieldset2 = styled('fieldset')(({ theme }) => ({
    background: 'white',
    border: 'none',
    borderRadius: '3px',
    // boxShadow: '0 0 15px 1px rgba(0, 0, 0, 0.4)',
    padding: '20px 30px',
    boxSizing: 'border-box',
    width: '80%',
    margin: '0 10%',
    position: 'relative',
    '&:not(:first-of-type)': {
      display: 'none',
    },
  }));

  export const StyledTextField2 = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2), // Adjust the spacing as needed
    width: '100%',
  }));
  
  export const Input = styled('input')(({ theme }) => ({
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'montserrat',
    color: '#2C3E50',
    fontSize: '13px',
    '&:focus': {
      outline: 'none',
      border: '2px solid #031281',
    },
  }));
  
  export const Textarea = styled('textarea')(({ theme }) => ({
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'montserrat',
    color: '#2C3E50',
    fontSize: '13px',
  }));
  
  export const Select = styled('select')(({ theme }) => ({
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'montserrat',
    color: '#2C3E50',
    fontSize: '13px',
  }));
  
  export const ActionButton = styled(Button)(({ theme }) => ({
    width: '100px',
    background: '#031281',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    borderRadius: '1px',
    cursor: 'pointer',
    padding: '10px',
    margin: '10px 5px',
    textDecoration: 'none',
    fontSize: '14px',
    '&:hover, &:focus': {
      boxShadow: '0 0 0 2px white, 0 0 0 3px #031281',
    },
  }));
  
  export const SecondaryButton = styled(Button)(({ theme }) => ({
    width: 'auto',
    background: '#ffffff',
    color: '#031281',
    fontWeight: 'bold',
    border: '2px solid #031281',
    borderRadius: '3px',
    cursor: 'pointer',
    padding: '10px',
    margin: '10px 5px',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background-color 0.3s, color 0.3s',
    '&:hover, &:focus': {
      backgroundColor: '#031281',
      color: 'white',
      boxShadow: '0 0 0 2px white, 0 0 0 3px #031281',
    },
  }));
  
  export const RemoveButton = styled(Button)(({ theme }) => ({
    width: 'auto',
    background: '#ffffff',
    color: '#ff0000',
    fontWeight: 'bold',
    border: '2px solid #ff0000',
    borderRadius: '3px',
    cursor: 'pointer',
    padding: '10px',
    margin: '10px 5px',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background-color 0.3s, color 0.3s',
    '&:hover, &:focus': {
      backgroundColor: '#ff0000',
      color: 'white',
      boxShadow: '0 0 0 2px white, 0 0 0 3px #ff0000',
    },
  }));
  
  export const FsHeader = styled(Typography)(({ theme }) => ({
    fontSize: '32px',
    textTransform: 'uppercase',
    color: '#031281',
    marginBottom: '10px',
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      fontSize: '28px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px',
    },
  }));
  
  export const FsTitle = styled(Typography)(({ theme }) => ({
    fontSize: '15px',
    color: '#2C3E50',
    marginBottom: '10px',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '13px',
    },
  }));
  
  export const FsSecondTitle = styled(Typography)(({ theme }) => ({
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: '10px',
  }));
  
  export const FsSubtitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'normal',
    fontSize: '13px',
    color: '#666',
    marginBottom: '20px',
    [theme.breakpoints.down('md')]: {
      fontSize: '12px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '11px',
    },
  }));
  
  export const Progressbar = styled('div')({
    marginBottom: '30px',
    overflow: 'hidden',
    counterReset: 'step',
  });
  
  export const ProgressbarItem = styled('div')({
    listStyleType: 'none',
    color: '#5D627E',
    textTransform: 'uppercase',
    fontSize: '9px',
    width: '25%',
    float: 'left',
    position: 'relative',
  
    '&:before': {
      content: 'counter(step)',
      counterIncrement: 'step',
      width: '20px',
      lineHeight: '20px',
      display: 'block',
      fontSize: '10px',
      color: '#FFFFFF',
      background: '#D9D9D9',
      borderRadius: '3px',
      margin: '0 auto 5px auto',
    },
  
    '&:after': {
      content: '""',
      width: '100%',
      height: '2px',
      background: 'white',
      position: 'absolute',
      left: '-50%',
      top: '9px',
      zIndex: '-1',
    },
  
    '&:first-of-type:after': {
      content: 'none',
    },
  
    '&.active:before, &.active:after': {
      background: '#5D627E',
      color: 'white',
    },
  });
  
  export const ChargerSelectionContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: '20px',
    '& label': {
      width: '100%',
      fontSize: '14px',
      color: '#2C3E50',
      marginBottom: '10px',
      textAlign: 'left',
    },
    '& .charger-pair': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: '10px',
    },
    '& .charger-type, & .charger-count': {
      padding: '15px',
      border: '1px solid #ccc',
      borderRadius: '3px',
      fontFamily: 'montserrat',
      color: '#2C3E50',
      fontSize: '13px',
      textAlign: 'center',
      width: '48%',
      boxSizing: 'border-box',
    },
    '& .charger-type': {
      cursor: 'pointer',
    },
    '& .charger-type.active': {
      border: '2px solid #031281',
      fontWeight: 'bold',
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      '& .charger-type, & .charger-count': {
        width: '100%',
      },
    },
  }));
  
  export const ChargerEntry = styled(Box)(({ theme }) => ({
    marginTop: '10px', // Spacing between charger entries
    '&:first-of-type hr': {
      display: 'none', // Hide the separator for the first charger entry
    },
  }));
  
  export const Label = styled('label')(({ theme }) => ({
    display: 'block',
    marginBottom: '5px', // Space between label and input
    }));
    
    export const ErrorMessage = styled(Typography)(({ theme }) => ({
    color: 'red',
    fontSize: '0.8em',
    height: '20px',
    }));
    
    export const InvalidInput = styled(Input)(({ theme }) => ({
    border: '2px solid red',
    }));
    
    export const DisabledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    }));