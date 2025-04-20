import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>LegalAssist</FooterLogo>
          <FooterDescription>
            Simple, accessible tools for analyzing legal documents and generating documents from templates.
          </FooterDescription>
        </FooterSection>
        
        <FooterNav>
          <FooterHeader>Navigation</FooterHeader>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/documents">Documents</FooterLink>
          <FooterLink to="/templates">Templates</FooterLink>
        </FooterNav>
        
        <FooterNav>
          <FooterHeader>Legal</FooterHeader>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </FooterNav>
      </FooterContent>
      
      <FooterCopyright>
        © {currentYear} LegalAssist. All rights reserved.
      </FooterCopyright>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.light};
  padding: ${({ theme }) => theme.spacing.xl} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const FooterSection = styled.div`
  flex: 1;
  max-width: 400px;
`;

const FooterLogo = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: white;
`;

const FooterDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  line-height: 1.6;
  opacity: 0.8;
`;

const FooterNav = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterHeader = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: white;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.light};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
    text-decoration: none;
  }
`;

const FooterCopyright = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.6;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

export default Footer; 