import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearningStatistics from '../LearningStatistics';

// Mock the Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('LearningStatistics Component', () => {
  it('renders with subjects tab active by default', () => {
    render(<LearningStatistics />);
    
    // Check if the component renders
    expect(screen.getByText('Предметы')).toBeInTheDocument();
    expect(screen.getByText('Активность')).toBeInTheDocument();
    expect(screen.getByText('Тесты')).toBeInTheDocument();
    
    // Check if the subjects tab is active by default
    expect(screen.getByText('Прогресс по предметам')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
  
  it('switches to activity tab when clicked', () => {
    render(<LearningStatistics />);
    
    // Click on the activity tab
    fireEvent.click(screen.getByText('Активность'));
    
    // Check if the activity content is displayed
    expect(screen.getByText('Активность по дням недели')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
  
  it('switches to tests tab when clicked', () => {
    render(<LearningStatistics />);
    
    // Click on the tests tab
    fireEvent.click(screen.getByText('Тесты'));
    
    // Check if the tests content is displayed
    expect(screen.getByText('Результаты тестов')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
  
  it('has the correct tab styling for active and inactive tabs', () => {
    render(<LearningStatistics />);
    
    // Get the tab elements
    const subjectsTab = screen.getByText('Предметы').closest('button');
    const activityTab = screen.getByText('Активность').closest('button');
    const testsTab = screen.getByText('Тесты').closest('button');
    
    // Check initial state (subjects tab active)
    expect(subjectsTab).toHaveClass('border-blue-500');
    expect(activityTab).toHaveClass('border-transparent');
    expect(testsTab).toHaveClass('border-transparent');
    
    // Click on the activity tab
    fireEvent.click(screen.getByText('Активность'));
    
    // Check updated state (activity tab active)
    expect(subjectsTab).toHaveClass('border-transparent');
    expect(activityTab).toHaveClass('border-blue-500');
    expect(testsTab).toHaveClass('border-transparent');
    
    // Click on the tests tab
    fireEvent.click(screen.getByText('Тесты'));
    
    // Check updated state (tests tab active)
    expect(subjectsTab).toHaveClass('border-transparent');
    expect(activityTab).toHaveClass('border-transparent');
    expect(testsTab).toHaveClass('border-blue-500');
  });
});
