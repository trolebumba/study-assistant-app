'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FeedbackForm } from './FeedbackForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface FeedbackButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function FeedbackButton({ 
  variant = 'outline',
  size = 'sm',
  className 
}: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          Обратная связь
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <FeedbackForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
