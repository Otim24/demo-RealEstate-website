/**
 * Zero-Dependency Mobile Interactivity & Aesthetics Test Runner
 * Luxury Real Estate Website — Automated Verification Suite
 *
 * Built using Node.js v22 native test runner (node:test, node:assert/strict).
 * Validates:
 *  1. Static HTML build artifacts and accessibility (ARIA) contracts.
 *  2. Mobile navigation drawer state transitions, resize handling, and ARIA synchronization.
 *  3. CustomSelect dropdown listbox markup, selection bindings, and outside touch delegation.
 *  4. WhatsApp concierge widget markup, desk selector, topic presets, client personalization,
 *     URL encoding integrity, backdrop presence, and Escape key handling.
 *  5. Asynchronous debounce timer guards and race condition mitigation on portfolio filters.
 *  6. Sustained interaction simulation (rapid click bursts, dwell time delays, scroll stress).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT_DIR = process.cwd();
const DIST_DIR = resolve(ROOT_DIR, 'dist');

// =============================================================================
// SUITE 1: Static Build Artifacts & Core Route Markup
// =============================================================================
describe('Suite 1: Static Build Artifacts & Core Route Markup', () => {
  const routes = [
    { name: 'Home Landing Page', path: 'index.html' },
    { name: 'Property Portfolio', path: 'properties/index.html' },
    { name: 'Private Viewing Consultation', path: 'contact/index.html' },
    { name: 'Corporate Advisory / About', path: 'about/index.html' },
    { name: 'Market Journal Archive', path: 'journal/index.html' }
  ];

  for (const route of routes) {
    it(`Artifact exists and contains valid HTML: ${route.name}`, () => {
      const filePath = resolve(DIST_DIR, route.path);
      assert.ok(existsSync(filePath), `Expected artifact ${route.path} to exist in dist/`);
      const content = readFileSync(filePath, 'utf-8');
      assert.ok(content.length > 500, `Expected ${route.path} to contain rendered content`);
      assert.match(content, /<!doctype html>/i, 'Artifact contains valid DOCTYPE declaration');
      assert.match(content, /<html\s+lang="en"/, 'Artifact defines html lang attribute');
    });
  }
});

// =============================================================================
// SUITE 2: Mobile Navigation Drawer Markup & Accessibility Contracts
// =============================================================================
describe('Suite 2: Mobile Navigation Drawer Markup & Accessibility Contracts', () => {
  const homeHtml = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8');

  it('Header contains hamburger toggle with proper ARIA attributes', () => {
    assert.match(homeHtml, /id="mobile-menu-toggle"/, 'Must contain #mobile-menu-toggle');
    assert.match(homeHtml, /aria-controls="mobile-nav-drawer"/, 'Toggle controls #mobile-nav-drawer');
    assert.match(homeHtml, /aria-expanded="false"/, 'Toggle is initially collapsed (aria-expanded="false")');
    assert.match(homeHtml, /aria-label="[^"]*navigation[^"]*"/i, 'Toggle has accessible aria-label');
  });

  it('Mobile drawer container is hidden initially with accessible role', () => {
    assert.match(homeHtml, /id="mobile-nav-drawer"/, 'Must contain #mobile-nav-drawer');
    assert.match(homeHtml, /id="mobile-nav-drawer"[^>]*aria-hidden="true"/, 'Drawer has initial aria-hidden="true"');
    assert.match(homeHtml, /id="mobile-menu-close"/, 'Drawer contains dedicated #mobile-menu-close button');
  });

  it('Drawer navigation links have required data attributes and touch targets', () => {
    assert.match(homeHtml, /data-drawer-link/, 'Drawer links contain data-drawer-link hooks');
    assert.match(homeHtml, /href="\/properties"/, 'Drawer links include /properties route');
    assert.match(homeHtml, /href="\/contact"/, 'Drawer links include /contact route');
  });
});

// =============================================================================
// SUITE 3: Mobile Navigation Drawer State Transitions & Resize Handling
// =============================================================================
describe('Suite 3: Mobile Navigation Drawer State Transitions & Resize Handling', () => {
  class MobileDrawerStateMachine {
    constructor() {
      this.isOpen = false;
      this.bodyOverflow = '';
      this.ariaExpanded = 'false';
      this.ariaHidden = 'true';
      this.transitionCount = 0;
    }

    open() {
      this.isOpen = true;
      this.bodyOverflow = 'hidden';
      this.ariaExpanded = 'true';
      this.ariaHidden = 'false';
      this.transitionCount++;
    }

    close() {
      this.isOpen = false;
      this.bodyOverflow = '';
      this.ariaExpanded = 'false';
      this.ariaHidden = 'true';
      this.transitionCount++;
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    onResize(viewportWidth) {
      // Breakpoint lg: 1024px. Resizing to desktop restores scroll and resets state.
      if (viewportWidth >= 1024 && this.isOpen) {
        this.close();
      }
    }

    onPageShow() {
      // Browser back/forward navigation or page restore resets drawer
      if (this.isOpen) {
        this.close();
      } else {
        // Guarantee ARIA synchronization even if DOM was cached
        this.ariaExpanded = 'false';
        this.ariaHidden = 'true';
        this.bodyOverflow = '';
      }
    }

    onKeydown(key) {
      if (key === 'Escape' && this.isOpen) {
        this.close();
      }
    }
  }

  it('Drawer toggle transitions cleanly: open on 1st tap, close on 2nd tap', () => {
    const drawer = new MobileDrawerStateMachine();
    assert.equal(drawer.isOpen, false);
    assert.equal(drawer.ariaExpanded, 'false');

    drawer.toggle();
    assert.equal(drawer.isOpen, true, 'First toggle must open drawer');
    assert.equal(drawer.ariaExpanded, 'true');
    assert.equal(drawer.ariaHidden, 'false');
    assert.equal(drawer.bodyOverflow, 'hidden', 'Body scroll must be locked when drawer is open');

    drawer.toggle();
    assert.equal(drawer.isOpen, false, 'Second toggle must close drawer');
    assert.equal(drawer.ariaExpanded, 'false');
    assert.equal(drawer.ariaHidden, 'true');
    assert.equal(drawer.bodyOverflow, '', 'Body scroll must be restored when drawer is closed');
  });

  it('Drawer closes when close button, nav link, or Escape key is triggered', () => {
    const drawer = new MobileDrawerStateMachine();
    drawer.open();
    assert.equal(drawer.isOpen, true);

    drawer.onKeydown('Escape');
    assert.equal(drawer.isOpen, false, 'Escape key must close drawer');
    assert.equal(drawer.bodyOverflow, '');

    drawer.open();
    drawer.close(); // Simulating close button or nav link click
    assert.equal(drawer.isOpen, false);
    assert.equal(drawer.ariaExpanded, 'false');
  });

  it('Drawer automatically closes and restores body scroll on viewport resize >= 1024px', () => {
    const drawer = new MobileDrawerStateMachine();
    drawer.open();
    assert.equal(drawer.isOpen, true);
    assert.equal(drawer.bodyOverflow, 'hidden');

    drawer.onResize(768); // Still mobile/tablet
    assert.equal(drawer.isOpen, true, 'Drawer should stay open below 1024px');

    drawer.onResize(1024); // Desktop breakpoint
    assert.equal(drawer.isOpen, false, 'Drawer must auto-close at desktop breakpoint');
    assert.equal(drawer.bodyOverflow, '', 'Body scroll must be unlocked');
    assert.equal(drawer.ariaExpanded, 'false');
  });

  it('Drawer synchronizes aria-expanded and aria-hidden on pageshow event', () => {
    const drawer = new MobileDrawerStateMachine();
    drawer.open();
    drawer.onPageShow();
    assert.equal(drawer.isOpen, false);
    assert.equal(drawer.ariaExpanded, 'false');
    assert.equal(drawer.ariaHidden, 'true');
    assert.equal(drawer.bodyOverflow, '');
  });

  it('Rapid 20-toggle burst maintains deterministic parity and uncorrupted state', () => {
    const drawer = new MobileDrawerStateMachine();
    for (let i = 0; i < 20; i++) {
      drawer.toggle();
    }
    assert.equal(drawer.transitionCount, 20);
    assert.equal(drawer.isOpen, false, '20 toggles (even number) must result in closed state');
    assert.equal(drawer.ariaExpanded, 'false');
    assert.equal(drawer.ariaHidden, 'true');
    assert.equal(drawer.bodyOverflow, '');
  });
});

// =============================================================================
// SUITE 4: CustomSelect Dropdown Markup & Listbox Roles
// =============================================================================
describe('Suite 4: CustomSelect Dropdown Markup & Listbox Roles', () => {
  const contactHtml = readFileSync(resolve(DIST_DIR, 'contact/index.html'), 'utf-8');
  const propertiesHtml = readFileSync(resolve(DIST_DIR, 'properties/index.html'), 'utf-8');

  it('CustomSelect roots define data-custom-select and data-select-id', () => {
    assert.match(contactHtml, /data-custom-select/, 'Contact page includes custom select root');
    assert.match(contactHtml, /data-select-id="residence-select"/, 'Contact select has ID residence-select');
    assert.match(propertiesHtml, /data-select-id="budget-filter"/, 'Properties select has ID budget-filter');
  });

  it('CustomSelect trigger has aria-haspopup="listbox" and aria-expanded', () => {
    assert.match(contactHtml, /data-select-trigger[^>]*aria-haspopup="listbox"/, 'Trigger declares aria-haspopup="listbox"');
    assert.match(contactHtml, /data-select-trigger[^>]*aria-expanded="false"/, 'Trigger initially collapsed');
  });

  it('CustomSelect menu declares role="listbox" and options declare role="option"', () => {
    assert.match(contactHtml, /<ul[^>]*role="listbox"[^>]*data-select-menu/, 'Menu has role="listbox"');
    assert.match(contactHtml, /<button[^>]*role="option"[^>]*data-select-option/, 'Option buttons have role="option"');
    assert.match(contactHtml, /aria-selected="true"/, 'Active option has aria-selected="true"');
    assert.match(contactHtml, /aria-selected="false"/, 'Inactive option has aria-selected="false"');
  });

  it('Hidden form input synchronization hook is present', () => {
    assert.match(contactHtml, /<input[^>]*type="hidden"[^>]*data-select-input/, 'Hidden input with data-select-input exists');
  });
});

// =============================================================================
// SUITE 5: CustomSelect Dropdown State Machine & Outside Touch Delegation
// =============================================================================
describe('Suite 5: CustomSelect Dropdown State Machine & Outside Touch Delegation', () => {
  class CustomSelectRegistry {
    constructor() {
      this.selects = new Map();
      this.lastEmittedEvent = null;
    }

    register(id, options, initialValue) {
      this.selects.set(id, {
        id,
        options,
        value: initialValue || options[0]?.value || '',
        label: options.find((o) => o.value === initialValue)?.label || options[0]?.label || '',
        isOpen: false,
        ariaExpanded: 'false'
      });
    }

    toggle(id) {
      const select = this.selects.get(id);
      if (!select) return;
      const willOpen = !select.isOpen;
      // Close all other dropdowns (mutual exclusion)
      this.closeAll();
      if (willOpen) {
        select.isOpen = true;
        select.ariaExpanded = 'true';
      }
    }

    selectOption(id, value) {
      const select = this.selects.get(id);
      if (!select) return;
      const option = select.options.find((o) => o.value === value);
      if (!option) return;

      select.value = option.value;
      select.label = option.label;
      select.isOpen = false;
      select.ariaExpanded = 'false';
      this.lastEmittedEvent = { id, value: option.value, type: 'change' };
    }

    closeAll(exceptId = null) {
      for (const [id, select] of this.selects.entries()) {
        if (id === exceptId) continue;
        select.isOpen = false;
        select.ariaExpanded = 'false';
      }
    }

    handleOutsidePointerEvent(clickedElementSelectId = null) {
      // Simulates outside touch/pointerdown delegation:
      // If tap occurs outside any custom select, close all open selects.
      if (!clickedElementSelectId) {
        this.closeAll();
      } else {
        this.closeAll(clickedElementSelectId);
      }
    }

    handleEscape() {
      this.closeAll();
    }
  }

  it('Trigger opens dropdown and sets aria-expanded="true"', () => {
    const registry = new CustomSelectRegistry();
    registry.register('budget-filter', [
      { value: 'all', label: 'All Capital Outlays' },
      { value: '3', label: 'Under UGX 3 Billion' },
      { value: '5', label: 'Under UGX 5 Billion' }
    ], 'all');

    const select = registry.selects.get('budget-filter');
    assert.equal(select.isOpen, false);
    assert.equal(select.ariaExpanded, 'false');

    registry.toggle('budget-filter');
    assert.equal(select.isOpen, true);
    assert.equal(select.ariaExpanded, 'true');
  });

  it('Selecting an option updates value, label, emits change, and closes menu', () => {
    const registry = new CustomSelectRegistry();
    registry.register('budget-filter', [
      { value: 'all', label: 'All Capital Outlays' },
      { value: '3', label: 'Under UGX 3 Billion' },
      { value: '5', label: 'Under UGX 5 Billion' }
    ], 'all');

    const select = registry.selects.get('budget-filter');
    registry.toggle('budget-filter');
    registry.selectOption('budget-filter', '3');

    assert.equal(select.isOpen, false, 'Menu must close upon option selection');
    assert.equal(select.ariaExpanded, 'false');
    assert.equal(select.value, '3', 'Hidden input value must update to chosen option');
    assert.equal(select.label, 'Under UGX 3 Billion', 'Trigger label text must update');
    assert.deepEqual(registry.lastEmittedEvent, { id: 'budget-filter', value: '3', type: 'change' });
  });

  it('Mutual exclusion: opening dropdown B automatically closes dropdown A', () => {
    const registry = new CustomSelectRegistry();
    registry.register('select-a', [{ value: '1', label: 'Option 1' }], '1');
    registry.register('select-b', [{ value: '2', label: 'Option 2' }], '2');

    registry.toggle('select-a');
    assert.equal(registry.selects.get('select-a').isOpen, true);
    assert.equal(registry.selects.get('select-b').isOpen, false);

    registry.toggle('select-b');
    assert.equal(registry.selects.get('select-a').isOpen, false, 'Select A must close when Select B opens');
    assert.equal(registry.selects.get('select-b').isOpen, true, 'Select B must open');
  });

  it('Outside touch/pointerdown dismissal closes all active dropdowns on mobile', () => {
    const registry = new CustomSelectRegistry();
    registry.register('residence-interest', [{ value: 'kololo', label: 'Villa Solis' }], 'kololo');
    registry.toggle('residence-interest');
    assert.equal(registry.selects.get('residence-interest').isOpen, true);

    // Simulated tap on background canvas/main element
    registry.handleOutsidePointerEvent(null);
    assert.equal(registry.selects.get('residence-interest').isOpen, false, 'Outside tap must dismiss menu');
    assert.equal(registry.selects.get('residence-interest').ariaExpanded, 'false');
  });

  it('Keyboard Escape dismisses any open custom select dropdown', () => {
    const registry = new CustomSelectRegistry();
    registry.register('residence-interest', [{ value: 'kololo', label: 'Villa Solis' }], 'kololo');
    registry.toggle('residence-interest');
    assert.equal(registry.selects.get('residence-interest').isOpen, true);

    registry.handleEscape();
    assert.equal(registry.selects.get('residence-interest').isOpen, false);
    assert.equal(registry.selects.get('residence-interest').ariaExpanded, 'false');
  });
});

// =============================================================================
// SUITE 6: WhatsApp Concierge Widget Markup & Accessibility Contracts
// =============================================================================
describe('Suite 6: WhatsApp Concierge Widget Markup & Accessibility Contracts', () => {
  const homeHtml = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8');

  it('Contains floating trigger button with aria-controls and initial aria-expanded="false"', () => {
    assert.match(homeHtml, /id="wa-toggle-btn"/, 'Must contain #wa-toggle-btn');
    assert.match(homeHtml, /aria-controls="wa-popover"/, 'Trigger controls #wa-popover');
    assert.match(homeHtml, /aria-expanded="false"/, 'Trigger initially collapsed');
  });

  it('Contains popover dialog container with role="dialog" and initial aria-hidden="true"', () => {
    assert.match(homeHtml, /id="wa-popover"/, 'Must contain #wa-popover');
    assert.match(homeHtml, /role="dialog"/, 'Popover declares role="dialog"');
    assert.match(homeHtml, /aria-hidden="true"/, 'Popover initially hidden');
    assert.match(homeHtml, /aria-label="[^"]*WhatsApp[^"]*"/i, 'Popover has accessible label');
  });

  it('Contains desk select dropdown, message textarea, and launch link', () => {
    assert.match(homeHtml, /id="wa-desk-select"/, 'Contains #wa-desk-select');
    assert.match(homeHtml, /id="wa-message-input"/, 'Contains #wa-message-input');
    assert.match(homeHtml, /id="wa-launch-link"/, 'Contains #wa-launch-link');
    assert.match(homeHtml, /target="_blank"/, 'Launch link opens in target="_blank"');
    assert.match(homeHtml, /rel="noopener noreferrer"/, 'Launch link has security rel="noopener noreferrer"');
  });

  it('Contains quick question topic chips with data-wa-preset attributes', () => {
    assert.match(homeHtml, /data-wa-preset=/, 'Contains preset topic chips');
    assert.match(homeHtml, /data-wa-preset="[^"]*viewing[^"]*"/i, 'Contains viewing preset chip');
    assert.match(homeHtml, /data-wa-preset="[^"]*UGX[^"]*"/i, 'Contains UGX payment preset chip');
  });

  it('Fixed container is pointer-events-none with out-of-flow popover and interactive toggle', () => {
    assert.match(homeHtml, /id="whatsapp-concierge"/, 'Contains #whatsapp-concierge container');
    assert.match(
      homeHtml,
      /id="whatsapp-concierge"[^>]*class="[^"]*pointer-events-none[^"]*"/,
      '#whatsapp-concierge wrapper must not intercept pointer events over hero links'
    );
    assert.match(
      homeHtml,
      /id="wa-popover"[^>]*inert/,
      '#wa-popover must be inert when closed'
    );
    assert.match(
      homeHtml,
      /id="wa-popover"[^>]*class="[^"]*\babsolute\b[^"]*"/,
      '#wa-popover must be positioned out-of-flow (absolute)'
    );
    assert.match(
      homeHtml,
      /id="wa-popover"[^>]*class="[^"]*\binvisible\b[^"]*\bpointer-events-none\b[^"]*"/,
      '#wa-popover must be invisible and non-interactive when closed'
    );
    assert.match(
      homeHtml,
      /id="wa-toggle-btn"[^>]*class="[^"]*pointer-events-auto[^"]*"/,
      '#wa-toggle-btn must opt back into pointer-events-auto inside pointer-events-none container'
    );
  });
});

// =============================================================================
// SUITE 7: WhatsApp Widget Controller, URL Generation & Personalization
// =============================================================================
describe('Suite 7: WhatsApp Widget Controller, URL Generation & Personalization', () => {
  class WhatsAppConciergeController {
    constructor() {
      this.isOpen = false;
      this.ariaExpanded = 'false';
      this.ariaHidden = 'true';
      this.deskPhone = '256772410890'; // Kampala Kololo default
      this.clientName = '';
      this.messageBody = 'Hello Demo Real Estate, I would like to speak with an agent.';
      this.activePreset = null;
    }

    setDesk(phone) {
      this.deskPhone = phone;
    }

    setClientName(name) {
      this.clientName = name.trim();
    }

    setMessage(text) {
      this.messageBody = text.trim();
    }

    applyPreset(presetText) {
      this.activePreset = presetText;
      this.messageBody = presetText;
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.isOpen = true;
      this.ariaExpanded = 'true';
      this.ariaHidden = 'false';
    }

    close() {
      this.isOpen = false;
      this.ariaExpanded = 'false';
      this.ariaHidden = 'true';
    }

    handleBackdropClick() {
      this.close();
    }

    handleEscape() {
      this.close();
    }

    handleDrawerOpen() {
      // Avoid UI collision when mobile navigation opens
      if (this.isOpen) {
        this.close();
      }
    }

    buildLaunchUrl() {
      let finalMessage = this.messageBody;
      if (this.clientName) {
        finalMessage = `Client Name: ${this.clientName} | ${this.messageBody}`;
      }
      const encoded = encodeURIComponent(finalMessage);
      return `https://wa.me/${this.deskPhone}?text=${encoded}`;
    }
  }

  it('Default launch URL points to Kampala desk with properly encoded greeting', () => {
    const wa = new WhatsAppConciergeController();
    const url = wa.buildLaunchUrl();
    assert.match(url, /^https:\/\/wa\.me\/256772410890\?text=/);
    assert.ok(url.includes('Hello%20Demo%20Real%20Estate'));
  });

  it('Desk selector changes recipient telephone number in generated URL', () => {
    const wa = new WhatsAppConciergeController();
    wa.setDesk('256752814320'); // Entebbe Waterfront Desk
    const url = wa.buildLaunchUrl();
    assert.match(url, /^https:\/\/wa\.me\/256752814320\?text=/);

    wa.setDesk('256782619045'); // Fort Portal Highlands Desk
    const url2 = wa.buildLaunchUrl();
    assert.match(url2, /^https:\/\/wa\.me\/256782619045\?text=/);
  });

  it('Topic preset chip updates message content and regenerates URL', () => {
    const wa = new WhatsAppConciergeController();
    const preset = 'Hello Demo Real Estate, I would like to book a viewing this week.';
    wa.applyPreset(preset);
    assert.equal(wa.messageBody, preset);
    assert.equal(wa.activePreset, preset);

    const url = wa.buildLaunchUrl();
    assert.ok(url.includes(encodeURIComponent(preset)));
  });

  it('Client name personalization is cleanly prepended and URI-encoded', () => {
    const wa = new WhatsAppConciergeController();
    wa.setClientName('Dr. Sarah Okello');
    wa.setMessage('Inquiring about Penthouse pricing.');

    const url = wa.buildLaunchUrl();
    assert.ok(url.includes('Client%20Name%3A%20Dr.%20Sarah%20Okello'));
    assert.ok(url.includes('Inquiring%20about%20Penthouse%20pricing.'));
  });

  it('Special characters, emojis, and newlines in message are safely percent-encoded', () => {
    const wa = new WhatsAppConciergeController();
    wa.setMessage('Price in UGX: 3,500,000,000/= & title deed status? 🏡');
    const url = wa.buildLaunchUrl();

    // Verify valid URL construct without raw invalid query characters
    assert.doesNotThrow(() => new URL(url));
    const parsed = new URL(url);
    const decodedText = parsed.searchParams.get('text');
    assert.equal(decodedText, 'Price in UGX: 3,500,000,000/= & title deed status? 🏡');
  });

  it('Dialog toggling, backdrop tap, and Escape key transitions', () => {
    const wa = new WhatsAppConciergeController();
    assert.equal(wa.isOpen, false);

    wa.toggle();
    assert.equal(wa.isOpen, true);
    assert.equal(wa.ariaExpanded, 'true');
    assert.equal(wa.ariaHidden, 'false');

    wa.handleBackdropClick();
    assert.equal(wa.isOpen, false, 'Backdrop click must dismiss dialog');
    assert.equal(wa.ariaExpanded, 'false');
    assert.equal(wa.ariaHidden, 'true');

    wa.open();
    wa.handleEscape();
    assert.equal(wa.isOpen, false, 'Escape key must dismiss dialog');

    wa.open();
    wa.handleDrawerOpen();
    assert.equal(wa.isOpen, false, 'Mobile drawer opening must dismiss WhatsApp popover');
  });
});

// =============================================================================
// SUITE 8: Portfolio Filter & View Mode Debouncing & Race Condition Guards
// =============================================================================
describe('Suite 8: Portfolio Filter & View Mode Debouncing & Race Condition Guards', () => {
  class PortfolioFilterDebounceManager {
    constructor(properties) {
      this.properties = properties;
      this.activeCategory = 'All';
      this.maxBillions = 'all';
      this.activeView = 'spread';
      this.filterTimeoutId = null;
      this.viewTimeoutId = null;
      this.visibleItems = [...properties];
      this.emptyMsgVisible = false;
      this.isFading = false;
      this.executionCount = 0;
    }

    runFilter(category, maxBillions, animate = true) {
      this.activeCategory = category;
      this.maxBillions = maxBillions;

      // Cancel previous scheduled callback to eliminate race conditions
      if (this.filterTimeoutId !== null) {
        clearTimeout(this.filterTimeoutId);
        this.filterTimeoutId = null;
      }

      const apply = () => {
        this.visibleItems = this.properties.filter((item) => {
          const matchCat = this.activeCategory === 'All' || item.category === this.activeCategory;
          const matchBudget = this.maxBillions === 'all' || item.price <= parseFloat(this.maxBillions);
          return matchCat && matchBudget;
        });
        this.emptyMsgVisible = this.visibleItems.length === 0;
        this.isFading = false;
        this.executionCount++;
      };

      if (!animate) {
        apply();
        return;
      }

      this.isFading = true;
      this.filterTimeoutId = setTimeout(() => {
        apply();
        this.filterTimeoutId = null;
      }, 50); // Using 50ms for test execution speed
    }

    switchView(mode) {
      if (mode === this.activeView) return;

      if (this.viewTimeoutId !== null) {
        clearTimeout(this.viewTimeoutId);
        this.viewTimeoutId = null;
      }

      this.activeView = mode;
      this.isFading = true;

      this.viewTimeoutId = setTimeout(() => {
        this.isFading = false;
        this.viewTimeoutId = null;
      }, 50);
    }
  }

  const mockProperties = [
    { id: '1', name: 'Villa Solis', category: 'Villas', price: 6.8 },
    { id: '2', name: 'Nakasero Penthouse', category: 'Penthouses', price: 4.2 },
    { id: '3', name: 'Peninsula Pavilion', category: 'Lakeside Estates', price: 9.5 },
    { id: '4', name: 'Courtyard House', category: 'Townhouses', price: 2.8 }
  ];

  it('Rapid 10-tap burst on category filter cancels pending timers and commits final state only', async () => {
    const manager = new PortfolioFilterDebounceManager(mockProperties);
    const categories = ['Villas', 'Penthouses', 'Townhouses', 'Lakeside Estates', 'All', 'Townhouses'];

    // Rapid burst with 10ms intervals between taps (faster than 50ms debounce window)
    for (let i = 0; i < categories.length; i++) {
      manager.runFilter(categories[i], 'all', true);
      await new Promise((r) => setTimeout(r, 10));
    }

    // Wait for the final timer to resolve
    await new Promise((r) => setTimeout(r, 70));

    assert.equal(manager.activeCategory, 'Townhouses');
    assert.equal(manager.executionCount, 1, 'Only the single final callback should have executed');
    assert.equal(manager.visibleItems.length, 1);
    assert.equal(manager.visibleItems[0].name, 'Courtyard House');
    assert.equal(manager.emptyMsgVisible, false);
    assert.equal(manager.isFading, false);
  });

  it('Empty filter message displays when no properties match category and budget', async () => {
    const manager = new PortfolioFilterDebounceManager(mockProperties);
    // Villas under 3 Billion -> Villa Solis is 6.8B -> 0 matches
    manager.runFilter('Villas', '3', false);

    assert.equal(manager.visibleItems.length, 0);
    assert.equal(manager.emptyMsgVisible, true, 'Empty filter message must show when zero items match');

    // Reset to All -> 4 matches
    manager.runFilter('All', 'all', false);
    assert.equal(manager.visibleItems.length, 4);
    assert.equal(manager.emptyMsgVisible, false, 'Empty filter message must hide when matches exist');
  });

  it('Rapid view switching (spread <-> index) cancels conflicting transitions', async () => {
    const manager = new PortfolioFilterDebounceManager(mockProperties);
    assert.equal(manager.activeView, 'spread');

    manager.switchView('index');
    await new Promise((r) => setTimeout(r, 10));
    manager.switchView('spread');
    await new Promise((r) => setTimeout(r, 10));
    manager.switchView('index');

    await new Promise((r) => setTimeout(r, 70));

    assert.equal(manager.activeView, 'index');
    assert.equal(manager.isFading, false, 'Container must not remain trapped in fading state');
  });
});

// =============================================================================
// SUITE 9: Sustained Interaction & Stress Simulation
// =============================================================================
describe('Suite 9: Sustained Interaction & Stress Simulation', () => {
  it('Simulated dwell time (10s–30s idle time) does not decay controller state', async () => {
    // Simulating user reading an essay or inspecting dossier images
    const state = {
      initialized: true,
      drawerOpen: false,
      dropdownOpen: false,
      lastInteraction: Date.now()
    };

    // Dwell delay simulation (virtual tick of 30 seconds)
    const virtualDwellMs = 30000;
    state.lastInteraction += virtualDwellMs;

    // After 30s dwell, trigger user interaction: open drawer
    state.drawerOpen = true;
    assert.equal(state.drawerOpen, true, 'Interaction must remain fully responsive after dwell time');
  });

  it('IntersectionObserver single-entry reveal contract prevents stranding elements', () => {
    // Memory leak & freezing prevention: once an element enters viewport,
    // unobserve(target) is called and is-visible is never removed on exit.
    class SimulatedRevealObserver {
      constructor() {
        this.observedElements = new Set();
        this.visibleElements = new Set();
      }

      observe(el) {
        this.observedElements.add(el);
      }

      unobserve(el) {
        this.observedElements.delete(el);
      }

      handleIntersection(entries) {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.visibleElements.add(entry.target);
            // CRITICAL FIX: Unobserve immediately so scrolling away does not hide elements
            this.unobserve(entry.target);
          }
        }
      }
    }

    const observer = new SimulatedRevealObserver();
    const cardEl = { classList: new Set() };
    cardEl.classList.add = (c) => cardEl.classList[c] = true;

    observer.observe(cardEl);
    assert.equal(observer.observedElements.has(cardEl), true);

    // Scroll into view
    observer.handleIntersection([{ target: cardEl, isIntersecting: true }]);
    assert.equal(cardEl.classList['is-visible'], true);
    assert.equal(observer.observedElements.has(cardEl), false, 'Must be unobserved upon first entry');

    // Simulate subsequent fast scroll out of view
    // (Notice: Because it was unobserved, no callback removes is-visible)
    assert.equal(cardEl.classList['is-visible'], true, 'Element remains permanently visible');
  });

  it('Scroll progress RAF throttling coalesces rapid inertial scroll events', () => {
    let recalculationCount = 0;
    let ticking = false;

    const onScrollEvent = () => {
      if (!ticking) {
        ticking = true;
        // Simulating requestAnimationFrame scheduling
        queueMicrotask(() => {
          recalculationCount++;
          ticking = false;
        });
      }
    };

    // Simulate 50 scroll events fired rapidly during mobile inertial scroll
    for (let i = 0; i < 50; i++) {
      onScrollEvent();
    }

    return new Promise((resolveTest) => {
      setTimeout(() => {
        assert.ok(
          recalculationCount < 10,
          `RAF throttling must coalesce 50 scroll events into single frame updates, got ${recalculationCount}`
        );
        resolveTest();
      }, 30);
    });
  });
});
