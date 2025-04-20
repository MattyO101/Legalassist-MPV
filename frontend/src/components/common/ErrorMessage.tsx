import React from 'react';
import styled from 'styled-components';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <ErrorContainer>
      <ErrorText>{message}</ErrorText>
      {onClose && <CloseButton onClick={onClose}>×</CloseButton>}
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorText = styled.p`
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: ${({ theme }) => theme.spacing.md};
  padding: 0;
  line-height: 1;
`;

export default ErrorMessage; 