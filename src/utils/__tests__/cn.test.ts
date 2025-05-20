import { cn } from '../cn';

describe('cn utility', () => {
  it('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });
  
  it('handles conditional classes', () => {
    const condition = true;
    expect(cn('always', condition && 'conditional')).toBe('always conditional');
    expect(cn('always', !condition && 'conditional')).toBe('always');
  });
  
  it('handles objects', () => {
    expect(cn('base', { conditional1: true, conditional2: false })).toBe('base conditional1');
  });
  
  it('handles arrays', () => {
    expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2');
  });
  
  it('handles complex combinations', () => {
    const condition1 = true;
    const condition2 = false;
    
    expect(
      cn(
        'base',
        condition1 && 'active',
        { 'is-disabled': condition2, 'is-enabled': !condition2 },
        ['fixed', condition1 && 'visible']
      )
    ).toBe('base active is-enabled fixed visible');
  });
  
  it('handles falsy values', () => {
    expect(cn('base', false, null, undefined, 0, '')).toBe('base');
  });
  
  it('merges tailwind classes correctly', () => {
    expect(cn('p-4 text-red-500', 'p-6')).toBe('text-red-500 p-6');
    expect(cn('text-sm text-gray-500', 'text-lg')).toBe('text-gray-500 text-lg');
  });
});
