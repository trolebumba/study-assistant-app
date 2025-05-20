describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to dashboard page', () => {
    cy.get('a[href="/dashboard"]').first().click();
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Дашборд');
  });

  it('should navigate to study plan page', () => {
    cy.get('a[href="/study-plan"]').first().click();
    cy.url().should('include', '/study-plan');
    cy.get('h1').should('contain', 'Учебный план');
  });

  it('should navigate to tests page', () => {
    cy.get('a[href="/tests"]').first().click();
    cy.url().should('include', '/tests');
    cy.get('h1').should('contain', 'Тесты');
  });

  it('should navigate to assistant page', () => {
    cy.get('a[href="/assistant"]').first().click();
    cy.url().should('include', '/assistant');
    cy.get('h1').should('contain', 'Ассистент');
  });

  it('should navigate to recommendations page', () => {
    cy.get('a[href="/recommendations"]').first().click();
    cy.url().should('include', '/recommendations');
    cy.get('h1').should('contain', 'Рекомендации');
  });

  it('should navigate to achievements page', () => {
    cy.get('a[href="/achievements"]').first().click();
    cy.url().should('include', '/achievements');
    cy.get('h1').should('contain', 'Достижения');
  });

  it('should navigate to integrations page', () => {
    cy.get('a[href="/integrations"]').first().click();
    cy.url().should('include', '/integrations');
    cy.get('h1').should('contain', 'Интеграции');
  });

  it('should open profile menu when clicking on profile button', () => {
    // Находим кнопку профиля и кликаем по ней
    cy.contains('Пользователь').click();
    
    // Проверяем, что меню профиля открылось
    cy.get('#profile-menu').should('be.visible');
    cy.contains('Профиль').should('be.visible');
    cy.contains('Настройки').should('be.visible');
    cy.contains('Выйти').should('be.visible');
  });

  it('should navigate to profile page from profile menu', () => {
    // Открываем меню профиля
    cy.contains('Пользователь').click();
    
    // Кликаем на пункт "Профиль"
    cy.get('#profile-menu').contains('Профиль').click();
    
    // Проверяем, что перешли на страницу профиля
    cy.url().should('include', '/profile');
  });

  it('should navigate to settings page from profile menu', () => {
    // Открываем меню профиля
    cy.contains('Пользователь').click();
    
    // Кликаем на пункт "Настройки"
    cy.get('#profile-menu').contains('Настройки').click();
    
    // Проверяем, что перешли на страницу настроек
    cy.url().should('include', '/settings');
  });

  it('should check accessibility on main pages', () => {
    // Проверяем доступность на главной странице
    cy.checkA11y();
    
    // Проверяем доступность на странице дашборда
    cy.get('a[href="/dashboard"]').first().click();
    cy.checkA11y();
    
    // Проверяем доступность на странице учебного плана
    cy.get('a[href="/study-plan"]').first().click();
    cy.checkA11y();
    
    // Проверяем доступность на странице тестов
    cy.get('a[href="/tests"]').first().click();
    cy.checkA11y();
  });

  it('should check performance on main pages', () => {
    // Проверяем производительность на главной странице
    cy.checkPerformance();
    
    // Проверяем производительность на странице дашборда
    cy.get('a[href="/dashboard"]').first().click();
    cy.checkPerformance();
    
    // Проверяем производительность на странице учебного плана
    cy.get('a[href="/study-plan"]').first().click();
    cy.checkPerformance();
    
    // Проверяем производительность на странице тестов
    cy.get('a[href="/tests"]').first().click();
    cy.checkPerformance();
  });
});
