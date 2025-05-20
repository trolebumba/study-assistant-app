/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Команда для входа в систему
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Команда для проверки доступности
Cypress.Commands.add('checkA11y', (context = null, options = {}) => {
  const runA11yCheck = () => {
    cy.injectAxe();
    cy.checkA11y(context, options);
  };

  // Если axe уже загружен, используем его, иначе загружаем
  cy.window().then((win) => {
    if (win.axe) {
      runA11yCheck();
    } else {
      cy.injectAxe();
      runA11yCheck();
    }
  });
});

// Команда для проверки производительности
Cypress.Commands.add('checkPerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance;
    if (performance) {
      const navigationStart = performance.timing.navigationStart;
      const loadEventEnd = performance.timing.loadEventEnd;
      const loadTime = loadEventEnd - navigationStart;
      
      cy.log(`Page load time: ${loadTime}ms`);
      
      // Проверяем, что время загрузки меньше 3 секунд
      expect(loadTime).to.be.lessThan(3000);
    }
  });
});

// Объявление типов для TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      checkA11y(context?: any, options?: any): Chainable<void>;
      checkPerformance(): Chainable<void>;
    }
  }
}
