import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = '1200px', 
  padding,
  ...props 
}) => {
  return (
    <StyledContainer 
      maxWidth={maxWidth} 
      padding={padding}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

const StyledContainer = styled.div<Omit<ContainerProps, 'children'>>`
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth};
  margin: 0 auto;
  padding: ${({ padding, theme }) => padding || `0 ${theme.spacing.xl}`};
`;

export default Container; 