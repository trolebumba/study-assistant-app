'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses, getCourse, Course } from '@/utils/supabase';

// Хук для получения всех курсов
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });
}

// Хук для получения конкретного курса по ID
export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId, // Запрос выполняется только если есть courseId
  });
}

// Хук для создания нового курса
export function useCreateCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newCourse: Omit<Course, 'id' | 'created_at' | 'user_id'>) => {
      // Здесь будет логика создания курса через Supabase
      console.log('Создание курса:', newCourse);
      return { id: 'new-course-id', ...newCourse } as Course;
    },
    onSuccess: () => {
      // Инвалидация кэша после успешного создания
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

// Хук для обновления курса
export function useUpdateCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Course> & { id: string }) => {
      // Здесь будет логика обновления курса через Supabase
      console.log('Обновление курса:', id, updates);
      return { id, ...updates } as Course;
    },
    onSuccess: (data) => {
      // Инвалидация кэша после успешного обновления
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', data.id] });
    },
  });
}

// Хук для удаления курса
export function useDeleteCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseId: string) => {
      // Здесь будет логика удаления курса через Supabase
      console.log('Удаление курса:', courseId);
      return courseId;
    },
    onSuccess: (courseId) => {
      // Инвалидация кэша после успешного удаления
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.removeQueries({ queryKey: ['courses', courseId] });
    },
  });
}
