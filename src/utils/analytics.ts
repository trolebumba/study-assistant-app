// Типы событий для аналитики
export enum AnalyticsEventType {
  // Пользовательские события
  USER_SIGN_UP = 'user_sign_up',
  USER_SIGN_IN = 'user_sign_in',
  USER_SIGN_OUT = 'user_sign_out',
  
  // События курсов
  COURSE_VIEW = 'course_view',
  COURSE_START = 'course_start',
  COURSE_COMPLETE = 'course_complete',
  LESSON_VIEW = 'lesson_view',
  LESSON_COMPLETE = 'lesson_complete',
  
  // События тестов
  TEST_START = 'test_start',
  TEST_COMPLETE = 'test_complete',
  QUESTION_ANSWER = 'question_answer',
  
  // События учебного плана
  STUDY_PLAN_CREATE = 'study_plan_create',
  STUDY_PLAN_UPDATE = 'study_plan_update',
  
  // События ИИ-ассистента
  ASSISTANT_QUERY = 'assistant_query',
  RECOMMENDATION_ACCEPT = 'recommendation_accept',
  RECOMMENDATION_DISMISS = 'recommendation_dismiss',
  
  // События UI
  BUTTON_CLICK = 'button_click',
  MODAL_OPEN = 'modal_open',
  MODAL_CLOSE = 'modal_close',
  THEME_CHANGE = 'theme_change',
}

// Функция для отправки событий в Umami
export function trackEvent(
  eventName: AnalyticsEventType | string,
  eventData?: Record<string, any>
) {
  // Проверяем, доступен ли Umami
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  } else if (process.env.NODE_ENV !== 'production') {
    // В режиме разработки выводим события в консоль
    console.log(`[Analytics] Event: ${eventName}`, eventData);
  }
}

// Функция для отслеживания просмотра страницы
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.trackView(url);
  } else if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] Page view: ${url}`);
  }
}

// Хук для отслеживания кликов по кнопкам
export function trackButtonClick(buttonName: string, additionalData?: Record<string, any>) {
  trackEvent(AnalyticsEventType.BUTTON_CLICK, {
    button_name: buttonName,
    ...additionalData,
  });
}

// Функция для отслеживания прогресса обучения
export function trackLearningProgress(
  userId: string,
  courseId: string,
  progress: number,
  additionalData?: Record<string, any>
) {
  trackEvent('learning_progress', {
    user_id: userId,
    course_id: courseId,
    progress_percentage: progress,
    ...additionalData,
  });
}

// Функция для отслеживания результатов тестов
export function trackTestResult(
  userId: string,
  testId: string,
  score: number,
  maxScore: number,
  timeSpent: number,
  additionalData?: Record<string, any>
) {
  trackEvent(AnalyticsEventType.TEST_COMPLETE, {
    user_id: userId,
    test_id: testId,
    score,
    max_score: maxScore,
    percentage: Math.round((score / maxScore) * 100),
    time_spent_seconds: timeSpent,
    ...additionalData,
  });
}
