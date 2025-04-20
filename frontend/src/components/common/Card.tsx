import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  margin?: string;
  width?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  padding, 
  margin, 
  width,
  ...props 
}) => {
  return (
    <StyledCard 
      padding={padding} 
      margin={margin} 
      width={width}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

const StyledCard = styled.div<Omit<CardProps, 'children'>>`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ padding, theme }) => padding || theme.spacing.lg};
  margin: ${({ margin }) => margin || '0'};
  width: ${({ width }) => width || 'auto'};
`;

export default Card; 