import { defineConfig } from '@playwright/test';
import { ENV } from './src/config/env';

/**
 * Configuración de Playwright para testing de API.
 *
 * Diferencia clave con un proyecto de UI: NO hay `projects` de navegadores.
 * El testing de API usa el fixture `request` (APIRequestContext), que hace
 * llamadas HTTP directas sin abrir ningún navegador. Por eso ni siquiera hace
 * falta `npx playwright install`: es mucho más liviano y rápido.
 *
 * Toda decisión está explicada en docs/GUIA-DE-APRENDIZAJE.md
 */
export default defineConfig({
  testDir: './tests',

  // Los tests son independientes → corren en paralelo.
  fullyParallel: true,

  // En CI, falla si quedó un test.only olvidado.
  forbidOnly: !!process.env.CI,

  // 2 reintentos en CI (la API es pública y puede tener latencia); 0 en local.
  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Timeout generoso: la API está en un hosting gratuito y puede responder lento.
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    // URL base de la API: los clients usan rutas relativas ('/booking').
    baseURL: ENV.baseURL,

    // Headers que se envían en TODAS las requests.
    // La API puede devolver XML si no le pedimos JSON explícitamente con Accept.
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

    // Guarda la traza de la request/response solo cuando un test reintenta.
    trace: 'on-first-retry',
  },
});
