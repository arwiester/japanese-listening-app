/**
 * Unit Tests for Utils
 */

import { describe, it, expect } from 'vitest';
import { 
  getRandomNumber,
  getRandomElement,
  calculateAccuracy,
  debounce
} from '../js/utils.js';

describe('getRandomNumber', () => {
  it('should generate number within range', () => {
    for (let i = 0; i < 100; i++) {
      const num = getRandomNumber(0, 10);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(10);
    }
  });

  it('should handle single value range', () => {
    const num = getRandomNumber(5, 5);
    expect(num).toBe(5);
  });

  it('should handle negative ranges', () => {
    const num = getRandomNumber(-10, -5);
    expect(num).toBeGreaterThanOrEqual(-10);
    expect(num).toBeLessThanOrEqual(-5);
  });

  it('should include max value', () => {
    const results = new Set();
    for (let i = 0; i < 1000; i++) {
      results.add(getRandomNumber(0, 2));
    }
    expect(results.has(2)).toBe(true);
  });
});

describe('getRandomElement', () => {
  it('should return element from array', () => {
    const arr = [1, 2, 3, 4, 5];
    const element = getRandomElement(arr);
    expect(arr).toContain(element);
  });

  it('should handle single element array', () => {
    const arr = ['only'];
    expect(getRandomElement(arr)).toBe('only');
  });

  it('should eventually return all elements', () => {
    const arr = ['a', 'b', 'c'];
    const results = new Set();
    for (let i = 0; i < 100; i++) {
      results.add(getRandomElement(arr));
    }
    expect(results.size).toBe(3);
  });
});

describe('calculateAccuracy', () => {
  it('should calculate correct percentage', () => {
    expect(calculateAccuracy(8, 10)).toBe(80);
    expect(calculateAccuracy(1, 2)).toBe(50);
    expect(calculateAccuracy(7, 10)).toBe(70);
  });

  it('should return 0 for no attempts', () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
  });

  it('should return 100 for all correct', () => {
    expect(calculateAccuracy(10, 10)).toBe(100);
  });

  it('should return 0 for all incorrect', () => {
    expect(calculateAccuracy(0, 10)).toBe(0);
  });

  it('should round correctly', () => {
    expect(calculateAccuracy(1, 3)).toBe(33); // 33.333... rounds to 33
    expect(calculateAccuracy(2, 3)).toBe(67); // 66.666... rounds to 67
  });
});

describe('debounce', () => {
  it('should delay function execution', async () => {
    let callCount = 0;
    const debouncedFn = debounce(() => callCount++, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(callCount).toBe(0);

    await new Promise(resolve => setTimeout(resolve, 150));
    expect(callCount).toBe(1);
  });

  it('should only call function once after multiple rapid calls', async () => {
    let callCount = 0;
    const debouncedFn = debounce(() => callCount++, 50);

    for (let i = 0; i < 10; i++) {
      debouncedFn();
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(callCount).toBe(1);
  });

  it('should pass arguments correctly', async () => {
    let result = '';
    const debouncedFn = debounce((a, b) => { result = a + b; }, 50);

    debouncedFn('hello', 'world');

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(result).toBe('helloworld');
  });

  it('should preserve "this" context', async () => {
    const testObject = {
      value: 42,
      debouncedMethod: null
    };
    
    let capturedValue = null;
    testObject.debouncedMethod = debounce(function() {
      capturedValue = this.value;
    }, 50);

    testObject.debouncedMethod();

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(capturedValue).toBe(42);
  });
});
