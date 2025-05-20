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

  // События обратной связи
  FEEDBACK_OPEN = 'feedback_open',
  FEEDBACK_SUBMIT = 'feedback_submit',

  // События бета-программы
  BETA_PAGE_VIEW = 'beta_page_view',
  BETA_SIGNUP = 'beta_signup',
  BETA_INVITE_CODE = 'beta_invite_code',

  // События интеграций
  INTEGRATION_CONNECT = 'integration_connect',
  INTEGRATION_DISCONNECT = 'integration_disconnect',
  COURSE_IMPORT = 'course_import',

  // События мониторинга
  USER_FEEDBACK = 'user_feedback',
  PERFORMANCE_ISSUE = 'performance_issue',
  ERROR_OCCURRED = 'error_occurred',

  // События дорожной карты
  ROADMAP_SUGGESTION = 'roadmap_suggestion',
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

// Функция для отслеживания обратной связи
export function trackFeedback(
  feedbackType: string,
  message: string,
  userId?: string,
  additionalData?: Record<string, any>
) {
  trackEvent(AnalyticsEventType.FEEDBACK_SUBMIT, {
    feedback_type: feedbackType,
    message_length: message.length,
    user_id: userId,
    ...additionalData,
  });
}

// Функция для отслеживания регистрации в бета-программе
export function trackBetaSignup(
  email: string,
  inviteCode: string,
  hasFeedback: boolean,
  additionalData?: Record<string, any>
) {
  trackEvent(AnalyticsEventType.BETA_SIGNUP, {
    has_feedback: hasFeedback,
    has_invite_code: !!inviteCode,
    ...additionalData,
  });
}

// Функция для отслеживания интеграций с образовательными платформами
export function trackIntegration(
  action: 'connect' | 'disconnect' | 'import',
  platform: string,
  userId: string,
  additionalData?: Record<string, any>
) {
  const eventType = action === 'connect'
    ? AnalyticsEventType.INTEGRATION_CONNECT
    : action === 'disconnect'
    ? AnalyticsEventType.INTEGRATION_DISCONNECT
    : AnalyticsEventType.COURSE_IMPORT;

  trackEvent(eventType, {
    platform,
    user_id: userId,
    ...additionalData,
  });
}

// Функция для отслеживания ошибок
export function trackError(
  errorType: string,
  errorMessage: string,
  userId?: string,
  additionalData?: Record<string, any>
) {
  trackEvent(AnalyticsEventType.ERROR_OCCURRED, {
    error_type: errorType,
    error_message: errorMessage,
    user_id: userId,
    ...additionalData,
  });
}

// Функция для отслеживания проблем с производительностью
export function trackPerformanceIssue(
  issueType: string,
  duration: number,
  url: string,
  additionalData?: Record<string, any>
) {
  trackEvent(AnalyticsEventType.PERFORMANCE_ISSUE, {
    issue_type: issueType,
    duration_ms: duration,
    url,
    ...additionalData,
  });
}
