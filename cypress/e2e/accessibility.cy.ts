describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should have no accessibility violations on home page', () => {
    cy.checkA11y();
  });

  it('should have no accessibility violations on dashboard page', () => {
    cy.get('a[href="/dashboard"]').first().click();
    cy.checkA11y();
  });

  it('should have no accessibility violations on study plan page', () => {
    cy.get('a[href="/study-plan"]').first().click();
    cy.checkA11y();
  });

  it('should have no accessibility violations on tests page', () => {
    cy.get('a[href="/tests"]').first().click();
    cy.checkA11y();
  });

  it('should have no accessibility violations on assistant page', () => {
    cy.get('a[href="/assistant"]').first().click();
    cy.checkA11y();
  });

  it('should have no accessibility violations on recommendations page', () => {
    cy.get('a[href="/recommendations"]').first().click();
    cy.checkA11y();
  });

  it('should have no accessibility violations on achievements page', () => {
    cy.get('a[href="/achievements"]').first().click();
    cy.checkA11y();
  });

  it('should have no accessibility violations on integrations page', () => {
    cy.get('a[href="/integrations"]').first().click();
    cy.checkA11y();
  });

  it('should have skip to content link that works', () => {
    // Проверяем наличие ссылки "Перейти к содержимому"
    cy.get('a[href="#main-content"]').should('exist');
    
    // Фокусируемся на ссылке
    cy.get('a[href="#main-content"]').focus();
    
    // Проверяем, что ссылка стала видимой
    cy.get('a[href="#main-content"]').should('be.visible');
    
    // Кликаем на ссылку
    cy.get('a[href="#main-content"]').click();
    
    // Проверяем, что фокус перешел на main-content
    cy.get('#main-content').should('have.focus');
  });

  it('should have accessibility menu that works', () => {
    // Находим кнопку меню доступности
    cy.contains('Доступность').click();
    
    // Проверяем, что меню открылось
    cy.get('#accessibility-menu').should('be.visible');
    
    // Проверяем наличие элементов управления
    cy.get('#font-size').should('exist');
    cy.get('#contrast').should('exist');
    cy.get('#reduced-motion').should('exist');
    cy.get('#dyslexic-font').should('exist');
    
    // Изменяем размер шрифта
    cy.get('#font-size').invoke('val', 150).trigger('change');
    
    // Изменяем контрастность
    cy.get('#contrast').select('high');
    
    // Включаем режим уменьшенной анимации
    cy.get('#reduced-motion').check();
    
    // Включаем шрифт для людей с дислексией
    cy.get('#dyslexic-font').check();
    
    // Проверяем, что изменения применились
    cy.get('body').should('have.class', 'high-contrast');
    cy.get('body').should('have.class', 'reduced-motion');
    cy.get('body').should('have.class', 'dyslexic-font');
    
    // Сбрасываем настройки
    cy.contains('Сбросить').click();
    
    // Проверяем, что настройки сбросились
    cy.get('body').should('not.have.class', 'high-contrast');
    cy.get('body').should('not.have.class', 'reduced-motion');
    cy.get('body').should('not.have.class', 'dyslexic-font');
  });

  it('should have keyboard navigation that works', () => {
    // Проверяем, что можно перемещаться по ссылкам с помощью клавиши Tab
    cy.get('body').tab();
    cy.focused().should('have.attr', 'href', '#main-content');
    
    cy.get('body').tab();
    cy.focused().should('contain', 'StudyAssistant');
    
    // Проверяем, что можно активировать ссылки с помощью клавиши Enter
    cy.focused().type('{enter}');
    cy.url().should('include', '/dashboard');
  });
});
