/**
 * Утилита для геймификации
 * 
 * Реализует систему достижений, уровней и наград для повышения
 * мотивации пользователей в процессе обучения.
 */

// Типы достижений
export enum AchievementType {
  COMPLETION = 'completion', // Завершение курса, модуля, урока
  STREAK = 'streak', // Серия дней подряд с активностью
  MASTERY = 'mastery', // Достижение определенного уровня владения темой
  SPEED = 'speed', // Быстрое выполнение заданий
  ACCURACY = 'accuracy', // Точность ответов
  EXPLORATION = 'exploration', // Исследование различных тем
  SOCIAL = 'social', // Социальная активность
  SPECIAL = 'special', // Специальные достижения
}

// Уровни редкости достижений
export enum AchievementRarity {
  COMMON = 'common', // Обычное
  UNCOMMON = 'uncommon', // Необычное
  RARE = 'rare', // Редкое
  EPIC = 'epic', // Эпическое
  LEGENDARY = 'legendary', // Легендарное
}

// Структура достижения
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  rarity: AchievementRarity;
  icon: string; // URL или имя иконки
  points: number; // Очки опыта за достижение
  requirements: {
    condition: string; // Описание условия
    value: number; // Требуемое значение
    currentValue?: number; // Текущее значение (для отслеживания прогресса)
  };
  unlockedAt?: number; // Временная метка разблокировки
  hidden: boolean; // Скрытое достижение или нет
}

// Структура уровня
export interface Level {
  level: number;
  name: string;
  minPoints: number; // Минимальное количество очков для уровня
  maxPoints: number; // Максимальное количество очков для уровня
  icon: string; // URL или имя иконки
  rewards: Reward[]; // Награды за достижение уровня
}

// Типы наград
export enum RewardType {
  BADGE = 'badge', // Значок
  THEME = 'theme', // Тема оформления
  AVATAR = 'avatar', // Аватар
  FEATURE = 'feature', // Доступ к функции
  CONTENT = 'content', // Доступ к контенту
  CERTIFICATE = 'certificate', // Сертификат
}

// Структура награды
export interface Reward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  icon: string; // URL или имя иконки
  value: string; // Значение награды (URL, ID и т.д.)
  unlockedAt?: number; // Временная метка разблокировки
}

// Структура профиля геймификации пользователя
export interface GamificationProfile {
  userId: string;
  points: number; // Общее количество очков
  level: number; // Текущий уровень
  achievements: {
    unlocked: Achievement[]; // Разблокированные достижения
    inProgress: Achievement[]; // Достижения в процессе
  };
  rewards: Reward[]; // Полученные награды
  streaks: {
    current: number; // Текущая серия дней
    longest: number; // Самая длинная серия
    lastActivity: number; // Последняя активность (временная метка)
  };
  stats: {
    testsCompleted: number;
    questionsAnswered: number;
    correctAnswers: number;
    topicsExplored: string[];
    totalStudyTime: number; // в минутах
  };
}

/**
 * Создает новый профиль геймификации для пользователя
 * @param userId ID пользователя
 * @returns Новый профиль геймификации
 */
export function createGamificationProfile(userId: string): GamificationProfile {
  return {
    userId,
    points: 0,
    level: 1,
    achievements: {
      unlocked: [],
      inProgress: [],
    },
    rewards: [],
    streaks: {
      current: 0,
      longest: 0,
      lastActivity: Date.now(),
    },
    stats: {
      testsCompleted: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      topicsExplored: [],
      totalStudyTime: 0,
    },
  };
}

/**
 * Получает все доступные достижения
 * @returns Массив всех достижений
 */
export function getAllAchievements(): Achievement[] {
  return [
    // Достижения за завершение
    {
      id: 'complete_first_test',
      name: 'Первый шаг',
      description: 'Завершите свой первый тест',
      type: AchievementType.COMPLETION,
      rarity: AchievementRarity.COMMON,
      icon: 'test_icon',
      points: 10,
      requirements: {
        condition: 'Завершить тест',
        value: 1,
      },
      hidden: false,
    },
    {
      id: 'complete_10_tests',
      name: 'Тестировщик',
      description: 'Завершите 10 тестов',
      type: AchievementType.COMPLETION,
      rarity: AchievementRarity.UNCOMMON,
      icon: 'tests_icon',
      points: 50,
      requirements: {
        condition: 'Завершить тестов',
        value: 10,
      },
      hidden: false,
    },
    {
      id: 'complete_first_course',
      name: 'Выпускник',
      description: 'Завершите свой первый курс',
      type: AchievementType.COMPLETION,
      rarity: AchievementRarity.RARE,
      icon: 'course_icon',
      points: 100,
      requirements: {
        condition: 'Завершить курс',
        value: 1,
      },
      hidden: false,
    },
    
    // Достижения за серию дней
    {
      id: 'streak_3_days',
      name: 'Постоянство',
      description: 'Занимайтесь 3 дня подряд',
      type: AchievementType.STREAK,
      rarity: AchievementRarity.COMMON,
      icon: 'streak_icon',
      points: 15,
      requirements: {
        condition: 'Дней подряд',
        value: 3,
      },
      hidden: false,
    },
    {
      id: 'streak_7_days',
      name: 'Недельный марафон',
      description: 'Занимайтесь 7 дней подряд',
      type: AchievementType.STREAK,
      rarity: AchievementRarity.UNCOMMON,
      icon: 'streak_icon',
      points: 30,
      requirements: {
        condition: 'Дней подряд',
        value: 7,
      },
      hidden: false,
    },
    {
      id: 'streak_30_days',
      name: 'Месяц дисциплины',
      description: 'Занимайтесь 30 дней подряд',
      type: AchievementType.STREAK,
      rarity: AchievementRarity.EPIC,
      icon: 'streak_icon',
      points: 150,
      requirements: {
        condition: 'Дней подряд',
        value: 30,
      },
      hidden: false,
    },
    
    // Достижения за мастерство
    {
      id: 'mastery_50',
      name: 'Ученик',
      description: 'Достигните 50% владения любой темой',
      type: AchievementType.MASTERY,
      rarity: AchievementRarity.COMMON,
      icon: 'mastery_icon',
      points: 20,
      requirements: {
        condition: 'Уровень владения',
        value: 0.5,
      },
      hidden: false,
    },
    {
      id: 'mastery_80',
      name: 'Эксперт',
      description: 'Достигните 80% владения любой темой',
      type: AchievementType.MASTERY,
      rarity: AchievementRarity.RARE,
      icon: 'mastery_icon',
      points: 80,
      requirements: {
        condition: 'Уровень владения',
        value: 0.8,
      },
      hidden: false,
    },
    {
      id: 'mastery_95',
      name: 'Мастер',
      description: 'Достигните 95% владения любой темой',
      type: AchievementType.MASTERY,
      rarity: AchievementRarity.LEGENDARY,
      icon: 'mastery_icon',
      points: 200,
      requirements: {
        condition: 'Уровень владения',
        value: 0.95,
      },
      hidden: false,
    },
    
    // Достижения за точность
    {
      id: 'accuracy_80',
      name: 'Точность',
      description: 'Достигните 80% правильных ответов в тесте',
      type: AchievementType.ACCURACY,
      rarity: AchievementRarity.UNCOMMON,
      icon: 'accuracy_icon',
      points: 30,
      requirements: {
        condition: 'Процент правильных ответов',
        value: 0.8,
      },
      hidden: false,
    },
    {
      id: 'accuracy_100',
      name: 'Безупречность',
      description: 'Получите 100% в тесте с не менее чем 10 вопросами',
      type: AchievementType.ACCURACY,
      rarity: AchievementRarity.EPIC,
      icon: 'accuracy_icon',
      points: 100,
      requirements: {
        condition: 'Процент правильных ответов',
        value: 1.0,
      },
      hidden: false,
    },
    
    // Достижения за исследование
    {
      id: 'explore_3_topics',
      name: 'Исследователь',
      description: 'Изучите 3 разные темы',
      type: AchievementType.EXPLORATION,
      rarity: AchievementRarity.COMMON,
      icon: 'explore_icon',
      points: 20,
      requirements: {
        condition: 'Изучено тем',
        value: 3,
      },
      hidden: false,
    },
    {
      id: 'explore_10_topics',
      name: 'Путешественник',
      description: 'Изучите 10 разных тем',
      type: AchievementType.EXPLORATION,
      rarity: AchievementRarity.RARE,
      icon: 'explore_icon',
      points: 70,
      requirements: {
        condition: 'Изучено тем',
        value: 10,
      },
      hidden: false,
    },
    
    // Скрытые достижения
    {
      id: 'night_owl',
      name: 'Ночная сова',
      description: 'Занимайтесь после полуночи',
      type: AchievementType.SPECIAL,
      rarity: AchievementRarity.UNCOMMON,
      icon: 'night_icon',
      points: 25,
      requirements: {
        condition: 'Занятия после полуночи',
        value: 1,
      },
      hidden: true,
    },
    {
      id: 'early_bird',
      name: 'Ранняя пташка',
      description: 'Занимайтесь до 6 утра',
      type: AchievementType.SPECIAL,
      rarity: AchievementRarity.UNCOMMON,
      icon: 'morning_icon',
      points: 25,
      requirements: {
        condition: 'Занятия до 6 утра',
        value: 1,
      },
      hidden: true,
    },
  ];
}

/**
 * Получает все уровни
 * @returns Массив всех уровней
 */
export function getAllLevels(): Level[] {
  return [
    {
      level: 1,
      name: 'Новичок',
      minPoints: 0,
      maxPoints: 99,
      icon: 'level1_icon',
      rewards: [],
    },
    {
      level: 2,
      name: 'Ученик',
      minPoints: 100,
      maxPoints: 249,
      icon: 'level2_icon',
      rewards: [
        {
          id: 'badge_level2',
          name: 'Значок ученика',
          description: 'Значок, показывающий ваш статус ученика',
          type: RewardType.BADGE,
          icon: 'badge_icon',
          value: 'badge_level2',
        },
      ],
    },
    {
      level: 3,
      name: 'Студент',
      minPoints: 250,
      maxPoints: 499,
      icon: 'level3_icon',
      rewards: [
        {
          id: 'theme_dark',
          name: 'Темная тема',
          description: 'Разблокирует темную тему оформления',
          type: RewardType.THEME,
          icon: 'theme_icon',
          value: 'dark_theme',
        },
      ],
    },
    {
      level: 4,
      name: 'Исследователь',
      minPoints: 500,
      maxPoints: 999,
      icon: 'level4_icon',
      rewards: [
        {
          id: 'avatar_scholar',
          name: 'Аватар "Ученый"',
          description: 'Эксклюзивный аватар для вашего профиля',
          type: RewardType.AVATAR,
          icon: 'avatar_icon',
          value: 'avatar_scholar',
        },
      ],
    },
    {
      level: 5,
      name: 'Эксперт',
      minPoints: 1000,
      maxPoints: 1999,
      icon: 'level5_icon',
      rewards: [
        {
          id: 'feature_advanced_stats',
          name: 'Расширенная статистика',
          description: 'Доступ к расширенной статистике обучения',
          type: RewardType.FEATURE,
          icon: 'feature_icon',
          value: 'advanced_stats',
        },
      ],
    },
    {
      level: 10,
      name: 'Мастер',
      minPoints: 2000,
      maxPoints: 4999,
      icon: 'level10_icon',
      rewards: [
        {
          id: 'certificate_master',
          name: 'Сертификат мастера',
          description: 'Сертификат, подтверждающий ваш уровень мастерства',
          type: RewardType.CERTIFICATE,
          icon: 'certificate_icon',
          value: 'certificate_master',
        },
      ],
    },
  ];
}

/**
 * Проверяет достижения пользователя и разблокирует новые
 * @param profile Профиль геймификации пользователя
 * @param event Событие для проверки (например, 'test_completed', 'streak_updated')
 * @param data Данные события
 * @returns Обновленный профиль и массив новых достижений
 */
export function checkAchievements(
  profile: GamificationProfile,
  event: string,
  data: any
): { profile: GamificationProfile; newAchievements: Achievement[] } {
  const allAchievements = getAllAchievements();
  const newAchievements: Achievement[] = [];
  
  // Получаем ID уже разблокированных достижений
  const unlockedIds = profile.achievements.unlocked.map(a => a.id);
  
  // Проверяем каждое достижение
  allAchievements.forEach(achievement => {
    // Пропускаем уже разблокированные достижения
    if (unlockedIds.includes(achievement.id)) {
      return;
    }
    
    let unlocked = false;
    
    // Проверяем достижение в зависимости от события
    switch (event) {
      case 'test_completed':
        if (achievement.type === AchievementType.COMPLETION && 
            achievement.id === 'complete_first_test' && 
            profile.stats.testsCompleted === 0) {
          unlocked = true;
        } else if (achievement.type === AchievementType.COMPLETION && 
                  achievement.id === 'complete_10_tests' && 
                  profile.stats.testsCompleted === 9) {
          unlocked = true;
        } else if (achievement.type === AchievementType.ACCURACY && 
                  achievement.id === 'accuracy_80' && 
                  data.accuracy >= 0.8) {
          unlocked = true;
        } else if (achievement.type === AchievementType.ACCURACY && 
                  achievement.id === 'accuracy_100' && 
                  data.accuracy === 1.0 && 
                  data.totalQuestions >= 10) {
          unlocked = true;
        }
        break;
        
      case 'streak_updated':
        if (achievement.type === AchievementType.STREAK && 
            achievement.id === 'streak_3_days' && 
            profile.streaks.current === 3) {
          unlocked = true;
        } else if (achievement.type === AchievementType.STREAK && 
                  achievement.id === 'streak_7_days' && 
                  profile.streaks.current === 7) {
          unlocked = true;
        } else if (achievement.type === AchievementType.STREAK && 
                  achievement.id === 'streak_30_days' && 
                  profile.streaks.current === 30) {
          unlocked = true;
        }
        break;
        
      case 'mastery_updated':
        if (achievement.type === AchievementType.MASTERY && 
            achievement.id === 'mastery_50' && 
            data.level >= 0.5) {
          unlocked = true;
        } else if (achievement.type === AchievementType.MASTERY && 
                  achievement.id === 'mastery_80' && 
                  data.level >= 0.8) {
          unlocked = true;
        } else if (achievement.type === AchievementType.MASTERY && 
                  achievement.id === 'mastery_95' && 
                  data.level >= 0.95) {
          unlocked = true;
        }
        break;
        
      case 'topic_explored':
        if (achievement.type === AchievementType.EXPLORATION && 
            achievement.id === 'explore_3_topics' && 
            profile.stats.topicsExplored.length === 2 && 
            !profile.stats.topicsExplored.includes(data.topic)) {
          unlocked = true;
        } else if (achievement.type === AchievementType.EXPLORATION && 
                  achievement.id === 'explore_10_topics' && 
                  profile.stats.topicsExplored.length === 9 && 
                  !profile.stats.topicsExplored.includes(data.topic)) {
          unlocked = true;
        }
        break;
        
      case 'time_check':
        const hour = new Date().getHours();
        if (achievement.type === AchievementType.SPECIAL && 
            achievement.id === 'night_owl' && 
            hour >= 0 && hour < 4) {
          unlocked = true;
        } else if (achievement.type === AchievementType.SPECIAL && 
                  achievement.id === 'early_bird' && 
                  hour >= 4 && hour < 6) {
          unlocked = true;
        }
        break;
    }
    
    // Если достижение разблокировано
    if (unlocked) {
      const newAchievement = {
        ...achievement,
        unlockedAt: Date.now(),
      };
      
      // Добавляем в список разблокированных
      profile.achievements.unlocked.push(newAchievement);
      
      // Добавляем очки
      profile.points += newAchievement.points;
      
      // Добавляем в список новых достижений
      newAchievements.push(newAchievement);
    }
  });
  
  // Обновляем уровень пользователя
  profile = updateLevel(profile);
  
  return { profile, newAchievements };
}

/**
 * Обновляет уровень пользователя на основе количества очков
 * @param profile Профиль геймификации пользователя
 * @returns Обновленный профиль
 */
export function updateLevel(profile: GamificationProfile): GamificationProfile {
  const levels = getAllLevels();
  const currentLevel = profile.level;
  
  // Находим новый уровень
  let newLevel = 1;
  let newRewards: Reward[] = [];
  
  for (const level of levels) {
    if (profile.points >= level.minPoints) {
      newLevel = level.level;
      
      // Если уровень повысился, добавляем награды
      if (newLevel > currentLevel) {
        // Получаем ID уже полученных наград
        const rewardIds = profile.rewards.map(r => r.id);
        
        // Добавляем новые награды
        for (const reward of level.rewards) {
          if (!rewardIds.includes(reward.id)) {
            const newReward = {
              ...reward,
              unlockedAt: Date.now(),
            };
            newRewards.push(newReward);
          }
        }
      }
    } else {
      break;
    }
  }
  
  // Обновляем профиль
  return {
    ...profile,
    level: newLevel,
    rewards: [...profile.rewards, ...newRewards],
  };
}
