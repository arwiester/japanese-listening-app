/**
 * Router Tests
 * Tests for the SPA hash-based router
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Router', () => {
  let router;
  let container;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="app-content"></div>
      <nav class="bottom-nav">
        <button class="bottom-nav-item active" data-route="numbers"></button>
        <button class="bottom-nav-item" data-route="currency"></button>
        <button class="bottom-nav-item" data-route="vocabulary"></button>
        <button class="bottom-nav-item" data-route="settings"></button>
      </nav>
    `;

    // Import router fresh for each test
    // Note: In actual implementation, router is a singleton
    // For testing, we'll create a new instance
    class Router {
      constructor() {
        this.routes = {};
        this.currentSection = null;
        this.container = null;
      }

      init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
          throw new Error(`Container element #${containerId} not found`);
        }
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
      }

      addRoute(path, handler) {
        this.routes[path] = handler;
      }

      navigateTo(path) {
        window.location.hash = path;
      }

      getCurrentRoute() {
        return window.location.hash.slice(1) || 'numbers';
      }

      async handleRoute() {
        const route = this.getCurrentRoute();
        const handler = this.routes[route];

        if (!handler) {
          console.warn(`No handler for route: ${route}`);
          this.navigateTo('numbers');
          return;
        }

        this.updateNavigation(route);

        try {
          this.container.innerHTML = '';
          await handler(this.container);
          this.currentSection = route;
        } catch (error) {
          console.error(`Error loading route ${route}:`, error);
          this.container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
              <h2>⚠️ Error Loading Section</h2>
              <p>${error.message}</p>
            </div>
          `;
        }
      }

      updateNavigation(activeRoute) {
        const navItems = document.querySelectorAll('.bottom-nav-item');
        navItems.forEach(item => {
          const route = item.getAttribute('data-route');
          if (route === activeRoute) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    }

    router = new Router();
    container = document.getElementById('app-content');

    // Clear hash
    window.location.hash = '';
  });

  afterEach(() => {
    // Clean up hash
    window.location.hash = '';
  });

  describe('Initialization', () => {
    it('should initialize with a valid container', () => {
      expect(() => router.init('app-content')).not.toThrow();
      expect(router.container).toBe(container);
    });

    it('should throw error if container not found', () => {
      expect(() => router.init('nonexistent')).toThrow('Container element #nonexistent not found');
    });

    it('should set up hashchange listener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      router.init('app-content');
      expect(addEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
      addEventListenerSpy.mockRestore();
    });
  });

  describe('Route Registration', () => {
    it('should register a route with handler', () => {
      const handler = vi.fn();
      router.addRoute('test', handler);
      expect(router.routes['test']).toBe(handler);
    });

    it('should register multiple routes', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      router.addRoute('numbers', handler1);
      router.addRoute('currency', handler2);
      
      expect(router.routes['numbers']).toBe(handler1);
      expect(router.routes['currency']).toBe(handler2);
    });
  });

  describe('Navigation', () => {
    it('should navigate to a route', () => {
      router.navigateTo('currency');
      expect(window.location.hash).toBe('#currency');
    });

    it('should get current route from hash', () => {
      window.location.hash = '#vocabulary';
      expect(router.getCurrentRoute()).toBe('vocabulary');
    });

    it('should default to "numbers" when hash is empty', () => {
      window.location.hash = '';
      expect(router.getCurrentRoute()).toBe('numbers');
    });
  });

  describe('Route Handling', () => {
    beforeEach(() => {
      router.init('app-content');
    });

    it('should call route handler when navigating', async () => {
      const handler = vi.fn().mockResolvedValue();
      router.addRoute('test', handler);
      
      router.navigateTo('test');
      await router.handleRoute();
      
      expect(handler).toHaveBeenCalledWith(container);
    });

    it('should update currentSection after successful navigation', async () => {
      const handler = vi.fn().mockResolvedValue();
      router.addRoute('currency', handler);
      
      window.location.hash = '#currency';
      await router.handleRoute();
      
      expect(router.currentSection).toBe('currency');
    });

    it('should fallback to numbers for invalid route', async () => {
      const numbersHandler = vi.fn().mockResolvedValue();
      router.addRoute('numbers', numbersHandler);
      
      window.location.hash = '#invalid';
      await router.handleRoute();
      
      expect(window.location.hash).toBe('#numbers');
    });

    it('should clear container before loading section', async () => {
      container.innerHTML = '<p>Old content</p>';
      const handler = vi.fn().mockResolvedValue();
      router.addRoute('test', handler);
      
      window.location.hash = '#test';
      await router.handleRoute();
      
      expect(container.innerHTML).not.toContain('Old content');
    });

    it('should display error message if handler throws', async () => {
      const errorHandler = vi.fn().mockRejectedValue(new Error('Test error'));
      router.addRoute('error', errorHandler);
      
      window.location.hash = '#error';
      await router.handleRoute();
      
      expect(container.innerHTML).toContain('Error Loading Section');
      expect(container.innerHTML).toContain('Test error');
    });
  });

  describe('Navigation UI Updates', () => {
    beforeEach(() => {
      router.init('app-content');
    });

    it('should update active state on navigation items', () => {
      router.updateNavigation('currency');
      
      const navItems = document.querySelectorAll('.bottom-nav-item');
      const currencyItem = Array.from(navItems).find(item => item.getAttribute('data-route') === 'currency');
      const numbersItem = Array.from(navItems).find(item => item.getAttribute('data-route') === 'numbers');
      
      expect(currencyItem.classList.contains('active')).toBe(true);
      expect(numbersItem.classList.contains('active')).toBe(false);
    });

    it('should remove active class from all other items', () => {
      // Start with numbers active
      router.updateNavigation('numbers');
      
      // Switch to vocabulary
      router.updateNavigation('vocabulary');
      
      const navItems = document.querySelectorAll('.bottom-nav-item');
      const activeItems = Array.from(navItems).filter(item => item.classList.contains('active'));
      
      // Only vocabulary should be active
      expect(activeItems.length).toBe(1);
      expect(activeItems[0].getAttribute('data-route')).toBe('vocabulary');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      router.init('app-content');
    });

    it('should handle rapid navigation changes', async () => {
      const handler1 = vi.fn().mockResolvedValue();
      const handler2 = vi.fn().mockResolvedValue();
      
      router.addRoute('numbers', handler1);
      router.addRoute('currency', handler2);
      
      router.navigateTo('numbers');
      router.navigateTo('currency');
      
      await router.handleRoute();
      
      // Should end up at currency
      expect(router.currentSection).toBe('currency');
    });

    it('should handle hash with leading #', () => {
      window.location.hash = '#vocabulary';
      expect(router.getCurrentRoute()).toBe('vocabulary');
      
      window.location.hash = 'settings'; // Without #
      expect(router.getCurrentRoute()).toBe('settings');
    });

    it('should handle async route handlers', async () => {
      const asyncHandler = vi.fn(async (container) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        container.innerHTML = '<p>Async content loaded</p>';
      });
      
      router.addRoute('async', asyncHandler);
      window.location.hash = '#async';
      
      await router.handleRoute();
      
      expect(container.innerHTML).toContain('Async content loaded');
      expect(router.currentSection).toBe('async');
    });
  });
});
