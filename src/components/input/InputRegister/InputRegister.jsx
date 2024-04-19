import React from 'react';
import TextField from '@mui/material/TextField';
import  makeStyles  from '@mui/styles';

const useStyles = {
  textField: {
    backgroundColor: 'transparent',
    marginBottom: '10px',
    width: '88%',
    height: '3.2rem',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    boxSizing: 'border-box',
    color: '#fff',
    '& input::placeholder': {
      color: '#fff',
      paddingLeft: '7px',
    },
  },
};

function InputRegister(props) {
  const classes = useStyles();

  return (
    <div>
      <div>
        <TextField
          {...props}
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          className={classes.textField}
        />
      </div>
      <div>
        <TextField
          {...props}
          id="outlined-textarea"
          label="Multiline Placeholder"
          placeholder="Placeholder"
          multiline
          className={classes.textField}
        />
      </div>
    </div>
  );
}

export default InputRegister;
