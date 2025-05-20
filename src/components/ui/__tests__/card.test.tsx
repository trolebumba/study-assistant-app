import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders correctly with default props', () => {
      render(<Card>Card Content</Card>);
      
      const card = screen.getByText('Card Content');
      expect(card).toBeInTheDocument();
      expect(card.parentElement).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow');
    });
    
    it('accepts and applies additional className', () => {
      render(<Card className="custom-class">Card Content</Card>);
      
      const card = screen.getByText('Card Content');
      expect(card.parentElement).toHaveClass('custom-class');
    });
  });
  
  describe('CardHeader', () => {
    it('renders correctly with default props', () => {
      render(<CardHeader>Header Content</CardHeader>);
      
      const header = screen.getByText('Header Content');
      expect(header).toBeInTheDocument();
      expect(header.parentElement).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });
  });
  
  describe('CardTitle', () => {
    it('renders correctly with default props', () => {
      render(<CardTitle>Card Title</CardTitle>);
      
      const title = screen.getByText('Card Title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight');
    });
  });
  
  describe('CardDescription', () => {
    it('renders correctly with default props', () => {
      render(<CardDescription>Card Description</CardDescription>);
      
      const description = screen.getByText('Card Description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });
  });
  
  describe('CardContent', () => {
    it('renders correctly with default props', () => {
      render(<CardContent>Content</CardContent>);
      
      const content = screen.getByText('Content');
      expect(content).toBeInTheDocument();
      expect(content.parentElement).toHaveClass('p-6', 'pt-0');
    });
  });
  
  describe('CardFooter', () => {
    it('renders correctly with default props', () => {
      render(<CardFooter>Footer Content</CardFooter>);
      
      const footer = screen.getByText('Footer Content');
      expect(footer).toBeInTheDocument();
      expect(footer.parentElement).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });
  });
  
  describe('Card composition', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Example Card</CardTitle>
            <CardDescription>This is a description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content goes here</p>
          </CardContent>
          <CardFooter>
            <p>Footer content</p>
          </CardFooter>
        </Card>
      );
      
      expect(screen.getByText('Example Card')).toBeInTheDocument();
      expect(screen.getByText('This is a description')).toBeInTheDocument();
      expect(screen.getByText('Main content goes here')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });
  });
});
