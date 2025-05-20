import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для базы данных
export type User = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
};

export type Lesson = {
  id: string;
  title: string;
  content: string;
  course_id: string;
  order: number;
  created_at: string;
};

export type Test = {
  id: string;
  title: string;
  description: string;
  course_id: string | null;
  created_at: string;
  user_id: string;
};

export type Question = {
  id: string;
  test_id: string;
  content: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'matching';
  options: string[] | null;
  correct_answer: string | string[];
  explanation: string | null;
  points: number;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string | null;
  test_id: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number | null;
  last_accessed: string;
};

export type StudyPlan = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
};

export type StudyPlanItem = {
  id: string;
  study_plan_id: string;
  course_id: string | null;
  lesson_id: string | null;
  test_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
};

// Функции для работы с базой данных
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as User;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) throw error;
  return data;
}

export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Course[];
}

export async function getCourse(courseId: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();
  
  if (error) throw error;
  return data as Course;
}

export async function getLessons(courseId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data as Lesson[];
}

export async function getTests(courseId?: string) {
  let query = supabase.from('tests').select('*');
  
  if (courseId) {
    query = query.eq('course_id', courseId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Test[];
}

export async function getQuestions(testId: string) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('test_id', testId);
  
  if (error) throw error;
  return data as Question[];
}

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data as UserProgress[];
}

export async function getStudyPlans(userId: string) {
  const { data, error } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as StudyPlan[];
}

export async function getStudyPlanItems(studyPlanId: string) {
  const { data, error } = await supabase
    .from('study_plan_items')
    .select('*')
    .eq('study_plan_id', studyPlanId);
  
  if (error) throw error;
  return data as StudyPlanItem[];
}
