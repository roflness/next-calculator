// src/components/FormStepper.tsx

import React from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import {
    Progressbar,
    ProgressbarItem,
  } from '../../styles/myComponentStyles';

interface FormStepperProps {
  steps: string[];
  activeStep: number;
}

const FormStepper: React.FC<FormStepperProps> = ({ steps, activeStep }) => {
    return (
      <Box sx={{ width: '100%' }}>
        {/* <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper> */}
        <Progressbar>
          {steps.map((label, index) => (
            <ProgressbarItem key={index} className={activeStep >= index ? 'active' : ''}>
              {label}
            </ProgressbarItem>
          ))}
        </Progressbar>
      </Box>
    );
  }

export default FormStepper;