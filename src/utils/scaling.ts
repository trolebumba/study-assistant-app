/**
 * Утилиты для масштабирования приложения
 */

import { monitoring, MonitoringEventType } from './monitoring';

/**
 * Типы ресурсов для масштабирования
 */
export enum ResourceType {
  CPU = 'cpu',
  MEMORY = 'memory',
  STORAGE = 'storage',
  DATABASE = 'database',
  NETWORK = 'network',
}

/**
 * Интерфейс для метрик ресурсов
 */
export interface ResourceMetrics {
  usage: number; // Текущее использование в процентах (0-100)
  limit: number; // Лимит ресурса (в соответствующих единицах)
  available: number; // Доступное количество ресурса
  unit: string; // Единица измерения (CPU: cores, Memory: MB, Storage: GB, etc.)
}

/**
 * Интерфейс для метрик масштабирования
 */
export interface ScalingMetrics {
  resources: Record<ResourceType, ResourceMetrics>;
  activeUsers: number;
  requestsPerMinute: number;
  averageResponseTime: number; // в миллисекундах
  errorRate: number; // в процентах (0-100)
  timestamp: string;
}

/**
 * Класс для управления масштабированием приложения
 */
export class ScalingManager {
  private static instance: ScalingManager;
  private isInitialized: boolean = false;
  private metrics: ScalingMetrics | null = null;
  private thresholds: Record<ResourceType, number> = {
    [ResourceType.CPU]: 80, // 80% использования CPU
    [ResourceType.MEMORY]: 75, // 75% использования памяти
    [ResourceType.STORAGE]: 90, // 90% использования хранилища
    [ResourceType.DATABASE]: 70, // 70% использования базы данных
    [ResourceType.NETWORK]: 60, // 60% использования сети
  };
  
  private constructor() {}
  
  /**
   * Получение экземпляра класса (Singleton)
   */
  public static getInstance(): ScalingManager {
    if (!ScalingManager.instance) {
      ScalingManager.instance = new ScalingManager();
    }
    return ScalingManager.instance;
  }
  
  /**
   * Инициализация менеджера масштабирования
   */
  public initialize(): void {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    
    // В реальном приложении здесь была бы инициализация мониторинга ресурсов
    // и настройка автоматического масштабирования
    
    console.log('ScalingManager initialized');
  }
  
  /**
   * Установка пороговых значений для автоматического масштабирования
   * @param resourceType Тип ресурса
   * @param threshold Пороговое значение в процентах (0-100)
   */
  public setThreshold(resourceType: ResourceType, threshold: number): void {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }
    
    this.thresholds[resourceType] = threshold;
    
    console.log(`Threshold for ${resourceType} set to ${threshold}%`);
  }
  
  /**
   * Получение текущих метрик ресурсов
   * @returns Текущие метрики ресурсов
   */
  public getMetrics(): ScalingMetrics {
    // В реальном приложении здесь был бы запрос к API для получения метрик
    // Для демонстрации возвращаем моковые данные
    
    if (!this.metrics) {
      this.metrics = this.generateMockMetrics();
    }
    
    return this.metrics;
  }
  
  /**
   * Проверка необходимости масштабирования
   * @returns Объект с информацией о необходимости масштабирования
   */
  public checkScalingNeeded(): Record<ResourceType, boolean> {
    const metrics = this.getMetrics();
    const result: Record<ResourceType, boolean> = {} as Record<ResourceType, boolean>;
    
    for (const resourceType of Object.values(ResourceType)) {
      const usage = metrics.resources[resourceType].usage;
      const threshold = this.thresholds[resourceType];
      
      result[resourceType] = usage >= threshold;
      
      if (result[resourceType]) {
        monitoring.trackEvent(MonitoringEventType.SCALING_NEEDED, {
          resource_type: resourceType,
          usage,
          threshold,
        });
      }
    }
    
    return result;
  }
  
  /**
   * Масштабирование ресурса
   * @param resourceType Тип ресурса
   * @param scale Коэффициент масштабирования (например, 1.5 для увеличения на 50%)
   */
  public scaleResource(resourceType: ResourceType, scale: number): void {
    if (scale <= 0) {
      throw new Error('Scale factor must be greater than 0');
    }
    
    // В реальном приложении здесь был бы код для масштабирования ресурса
    // (например, увеличение количества инстансов, увеличение размера базы данных и т.д.)
    
    console.log(`Scaling ${resourceType} by factor ${scale}`);
    
    monitoring.trackEvent(MonitoringEventType.RESOURCE_SCALED, {
      resource_type: resourceType,
      scale_factor: scale,
    });
  }
  
  /**
   * Автоматическое масштабирование на основе текущих метрик
   */
  public autoScale(): void {
    const scalingNeeded = this.checkScalingNeeded();
    
    for (const [resourceType, needed] of Object.entries(scalingNeeded)) {
      if (needed) {
        // Масштабируем ресурс на 50%
        this.scaleResource(resourceType as ResourceType, 1.5);
      }
    }
  }
  
  /**
   * Генерация моковых метрик для демонстрации
   * @returns Моковые метрики ресурсов
   */
  private generateMockMetrics(): ScalingMetrics {
    return {
      resources: {
        [ResourceType.CPU]: {
          usage: Math.floor(Math.random() * 100),
          limit: 8,
          available: 2,
          unit: 'cores',
        },
        [ResourceType.MEMORY]: {
          usage: Math.floor(Math.random() * 100),
          limit: 16384,
          available: 4096,
          unit: 'MB',
        },
        [ResourceType.STORAGE]: {
          usage: Math.floor(Math.random() * 100),
          limit: 1000,
          available: 250,
          unit: 'GB',
        },
        [ResourceType.DATABASE]: {
          usage: Math.floor(Math.random() * 100),
          limit: 100,
          available: 30,
          unit: 'connections',
        },
        [ResourceType.NETWORK]: {
          usage: Math.floor(Math.random() * 100),
          limit: 1000,
          available: 400,
          unit: 'Mbps',
        },
      },
      activeUsers: Math.floor(Math.random() * 1000),
      requestsPerMinute: Math.floor(Math.random() * 10000),
      averageResponseTime: Math.floor(Math.random() * 500),
      errorRate: Math.random() * 5,
      timestamp: new Date().toISOString(),
    };
  }
}

// Экспортируем экземпляр для использования в приложении
export const scalingManager = ScalingManager.getInstance();
