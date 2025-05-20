'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudyPlans, getStudyPlanItems, StudyPlan, StudyPlanItem } from '@/utils/supabase';

// Хук для получения всех учебных планов пользователя
export function useStudyPlans(userId: string) {
  return useQuery({
    queryKey: ['study-plans', userId],
    queryFn: () => getStudyPlans(userId),
    enabled: !!userId, // Запрос выполняется только если есть userId
  });
}

// Хук для получения элементов учебного плана
export function useStudyPlanItems(studyPlanId: string) {
  return useQuery({
    queryKey: ['study-plans', studyPlanId, 'items'],
    queryFn: () => getStudyPlanItems(studyPlanId),
    enabled: !!studyPlanId, // Запрос выполняется только если есть studyPlanId
  });
}

// Хук для создания нового учебного плана
export function useCreateStudyPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPlan: {
      title: string;
      description?: string;
      subject?: string;
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
      estimatedDuration?: number;
      modules: {
        title: string;
        description?: string;
        lessons: {
          title: string;
          description?: string;
          duration: number;
          type: 'theory' | 'practice' | 'test';
        }[];
      }[];
    }) => {
      // Здесь будет логика создания учебного плана через Supabase
      console.log('Создание учебного плана:', newPlan);
      return { id: 'new-plan-id', ...newPlan } as StudyPlan & { items: StudyPlanItem[] };
    },
    onSuccess: (data, variables, context) => {
      // Инвалидация кэша после успешного создания
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
    },
  });
}

// Хук для обновления учебного плана
export function useUpdateStudyPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StudyPlan> & { id: string }) => {
      // Здесь будет логика обновления учебного плана через Supabase
      console.log('Обновление учебного плана:', id, updates);
      return { id, ...updates } as StudyPlan;
    },
    onSuccess: (data) => {
      // Инвалидация кэша после успешного обновления
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      queryClient.invalidateQueries({ queryKey: ['study-plans', data.id] });
    },
  });
}

// Хук для удаления учебного плана
export function useDeleteStudyPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (planId: string) => {
      // Здесь будет логика удаления учебного плана через Supabase
      console.log('Удаление учебного плана:', planId);
      return planId;
    },
    onSuccess: (planId) => {
      // Инвалидация кэша после успешного удаления
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      queryClient.removeQueries({ queryKey: ['study-plans', planId] });
    },
  });
}

// Хук для обновления статуса элемента учебного плана
export function useUpdateStudyPlanItemStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      itemId, 
      status 
    }: { 
      itemId: string; 
      status: 'not_started' | 'in_progress' | 'completed' 
    }) => {
      // Здесь будет логика обновления статуса через Supabase
      console.log('Обновление статуса элемента учебного плана:', itemId, status);
      return { id: itemId, status };
    },
    onSuccess: (data, variables) => {
      // Инвалидация кэша после успешного обновления
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
}
