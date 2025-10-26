/**
 * Simple Hash-based Router for SPA
 * No dependencies, no build step needed
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentSection = null;
    this.container = null;
  }

  /**
   * Initialize router
   */
  init(containerId) {
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      throw new Error(`Container element #${containerId} not found`);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle initial route
    this.handleRoute();
  }

  /**
   * Register a route
   */
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Navigate to a route programmatically
   */
  navigateTo(path) {
    window.location.hash = path;
  }

  /**
   * Get current route from hash
   */
  getCurrentRoute() {
    return window.location.hash.slice(1) || 'numbers'; // Default to numbers
  }

  /**
   * Handle route change
   */
  async handleRoute() {
    const route = this.getCurrentRoute();
    const handler = this.routes[route];

    if (!handler) {
      console.warn(`No handler for route: ${route}`);
      // Fallback to numbers
      this.navigateTo('numbers');
      return;
    }

    // Update active nav state
    this.updateNavigation(route);

    try {
      // Clear container
      this.container.innerHTML = '';
      
      // Load section
      await handler(this.container);
      
      this.currentSection = route;
      console.log(`Navigated to: ${route}`);
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

  /**
   * Update navigation active state
   */
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

// Export singleton instance
const router = new Router();
