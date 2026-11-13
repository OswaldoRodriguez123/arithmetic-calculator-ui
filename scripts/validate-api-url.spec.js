import { describe, expect, test } from 'vitest';
import { validateApiUrl } from './validate-api-url.mjs';

describe('validateApiUrl', () => {
  test('accepts a plain https URL', () => {
    expect(validateApiUrl('https://api.example.com/', 'build')).toBe('https://api.example.com/');
  });

  test('accepts https URL without trailing slash and normalizes it', () => {
    expect(validateApiUrl('https://api.example.com', 'build')).toBe('https://api.example.com/');
  });

  test('accepts http://localhost with any port', () => {
    expect(validateApiUrl('http://localhost:3001/', 'build')).toBe('http://localhost:3001/');
    expect(validateApiUrl('http://localhost', 'build')).toBe('http://localhost/');
  });

  test('accepts http://127.0.0.1 with any port', () => {
    expect(validateApiUrl('http://127.0.0.1:3001/', 'build')).toBe('http://127.0.0.1:3001/');
  });

  test('rejects http URLs to non-local hosts', () => {
    expect(() => validateApiUrl('http://api.example.com/', 'build')).toThrow(/https/);
    expect(() => validateApiUrl('http://192.168.1.10:3001/', 'build')).toThrow(/https/);
  });

  test('rejects non-http(s) schemes', () => {
    expect(() => validateApiUrl('ftp://api.example.com/', 'build')).toThrow();
    expect(() => validateApiUrl('ws://localhost:3001/', 'build')).toThrow();
  });

  test('rejects credentials embedded in the URL', () => {
    expect(() => validateApiUrl('https://user:pass@api.example.com/', 'build')).toThrow(/credentials/);
  });

  test('rejects query strings and fragments (they break baseURL concatenation)', () => {
    expect(() => validateApiUrl('https://api.example.com/?a=b', 'build')).toThrow();
    expect(() => validateApiUrl('https://api.example.com/#frag', 'build')).toThrow();
  });

  test('rejects unparsable values', () => {
    expect(() => validateApiUrl('not a url', 'build')).toThrow();
    expect(() => validateApiUrl('//api.example.com', 'build')).toThrow();
  });

  test('fails the build when VITE_API_URL is missing', () => {
    expect(() => validateApiUrl(undefined, 'build')).toThrow(/VITE_API_URL/);
    expect(() => validateApiUrl('', 'build')).toThrow(/VITE_API_URL/);
  });

  test('dev server falls back to local API with a warning instead of throwing', () => {
    const warnings = [];
    const result = validateApiUrl(undefined, 'serve', (msg) => warnings.push(msg));
    expect(result).toBe('http://localhost:3001/');
    expect(warnings.length).toBe(1);
  });
});
