'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTests, getQuestions, Test, Question } from '@/utils/supabase';

// Хук для получения всех тестов
export function useTests(courseId?: string) {
  return useQuery({
    queryKey: courseId ? ['tests', 'course', courseId] : ['tests'],
    queryFn: () => getTests(courseId),
  });
}

// Хук для получения вопросов теста
export function useTestQuestions(testId: string) {
  return useQuery({
    queryKey: ['tests', testId, 'questions'],
    queryFn: () => getQuestions(testId),
    enabled: !!testId, // Запрос выполняется только если есть testId
  });
}

// Хук для создания нового теста
export function useCreateTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTest: {
      title: string;
      description: string;
      courseId?: string;
      timeLimit?: number;
      difficulty: 'easy' | 'medium' | 'hard';
      tags: string[];
      questions: Omit<Question, 'id' | 'test_id' | 'created_at'>[];
    }) => {
      // Здесь будет логика создания теста через Supabase
      console.log('Создание теста:', newTest);
      return { id: 'new-test-id', ...newTest } as Test & { questions: Question[] };
    },
    onSuccess: (data) => {
      // Инвалидация кэша после успешного создания
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      if (data.courseId) {
        queryClient.invalidateQueries({ queryKey: ['tests', 'course', data.courseId] });
      }
    },
  });
}

// Хук для обновления теста
export function useUpdateTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Test> & { id: string }) => {
      // Здесь будет логика обновления теста через Supabase
      console.log('Обновление теста:', id, updates);
      return { id, ...updates } as Test;
    },
    onSuccess: (data) => {
      // Инвалидация кэша после успешного обновления
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      if (data.course_id) {
        queryClient.invalidateQueries({ queryKey: ['tests', 'course', data.course_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['tests', data.id] });
    },
  });
}

// Хук для удаления теста
export function useDeleteTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (testId: string) => {
      // Здесь будет логика удаления теста через Supabase
      console.log('Удаление теста:', testId);
      return testId;
    },
    onSuccess: (testId) => {
      // Инвалидация кэша после успешного удаления
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      queryClient.removeQueries({ queryKey: ['tests', testId] });
    },
  });
}

// Хук для сохранения результатов теста
export function useSaveTestResult() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (result: {
      testId: string;
      score: number;
      maxScore: number;
      timeSpent: number;
      answers: Record<string, any>;
    }) => {
      // Здесь будет логика сохранения результатов теста через Supabase
      console.log('Сохранение результатов теста:', result);
      return { id: 'new-result-id', ...result };
    },
    onSuccess: (data) => {
      // Инвалидация кэша после успешного сохранения
      queryClient.invalidateQueries({ queryKey: ['test-results', data.testId] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
}
