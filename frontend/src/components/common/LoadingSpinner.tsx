import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: string;
  color?: string;
  thickness?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = '40px',
  color,
  thickness = '4px',
}) => {
  return <Spinner size={size} color={color} thickness={thickness} />;
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div<LoadingSpinnerProps>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border: ${({ thickness }) => thickness} solid rgba(0, 0, 0, 0.1);
  border-top: ${({ thickness }) => thickness} solid ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export default LoadingSpinner; 