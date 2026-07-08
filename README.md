# Framework de Testing de API — Playwright + TypeScript + Zod (Restful-Booker)

Framework de automatización de **pruebas de API** construido con **Playwright**, **TypeScript** y **Zod**, sobre la API pública [Restful-Booker](https://restful-booker.herokuapp.com). Cubre autenticación, CRUD completo, **validación de contratos** (schema), casos negativos, **encadenamiento** de requests y el patrón de **setup por API**.

Es el **Proyecto 2** de un portfolio para perfil **QA Automation Semi-Senior / Senior**, y es la pieza que le faltaba a la [pirámide de testing](https://github.com/fercarballo/playwright-e2e-framework-saucedemo): la capa de API, más rápida y estable que la de UI.

---

## Qué demuestra este proyecto

| Capacidad | Cómo se ve en el código |
|---|---|
| **Testing de API sin UI** | Fixture `request` de Playwright; **no** se instalan navegadores |
| **API Clients** | `AuthClient`, `BookingClient` (el POM del mundo API) |
| **Contract testing** | Schemas de **Zod** validan la forma de cada respuesta |
| **Tipos derivados del schema** | `z.infer` → una sola fuente de verdad para tipos y validación |
| **CRUD end-to-end** | Encadenamiento: crear → leer → actualizar → borrar → 404 |
| **Setup por API** | Fixture `createdBooking` crea datos por API como precondición |
| **Casos negativos** | Auth inválida, 404, 403 sin token |
| **Autenticación** | Token vía header `Cookie`, probado en updates protegidos |
| **Datos con Builder** | `BookingBuilder` con deep clone |
| **Config por ambiente** | `API_BASE_URL` y credenciales por variable de entorno |
| **Type safety** | `tsc --noEmit` en verde, `strict: true` |
| **CI/CD** | Workflow de GitHub Actions (más liviano que el de UI) |

---

## Stack

- **[Playwright Test](https://playwright.dev/docs/api-testing)** — runner + cliente HTTP (`request` / `APIRequestContext`).
- **[Zod](https://zod.dev)** — validación de schemas en runtime (contract testing) y tipos derivados.
- **TypeScript** (`strict`) — tipado estático.
- **Node.js** — entorno de ejecución.

---

## Estructura del proyecto

```
proyecto-2-api-testing/
├── src/
│   ├── config/
│   │   └── env.ts                  # baseURL + credenciales desde variables de entorno
│   ├── schemas/                    # CONTRATOS (Zod) — validación + tipos
│   │   ├── auth.schema.ts
│   │   └── booking.schema.ts
│   ├── clients/                    # API Clients (encapsulan los endpoints)
│   │   ├── AuthClient.ts
│   │   └── BookingClient.ts
│   ├── data/
│   │   └── booking.builder.ts      # Builder de payloads de reserva
│   └── fixtures/
│       └── api.fixture.ts          # Fixtures: clients + token + setup-por-API
├── tests/
│   ├── health/ping.spec.ts         # Health check
│   ├── auth/auth.spec.ts           # Autenticación (+ caso negativo)
│   └── booking/
│       ├── create.spec.ts          # POST + contract testing
│       ├── read.spec.ts            # GET + 404
│       ├── update.spec.ts          # PUT/PATCH + auth + 403
│       └── crud-e2e.spec.ts        # Ciclo completo encadenado ⭐
├── docs/
│   ├── GUIA-DE-APRENDIZAJE.md      # Documento de estudio (el "por qué" de todo)
│   └── Guia-de-Aprendizaje.pdf
├── .github/workflows/ci.yml
├── playwright.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

> El detalle de **por qué** cada decisión está en **[docs/GUIA-DE-APRENDIZAJE.md](docs/GUIA-DE-APRENDIZAJE.md)**.

---

## Requisitos previos

- **Node.js** 18 o superior.
- Conexión a internet (la API es pública).

---

## Instalación

```bash
npm install
```

> **No hace falta `npx playwright install`.** El testing de API no usa navegadores. Una de las ventajas de esta capa.

---

## Cómo correr los tests

```bash
npm test                 # Toda la suite
npm run test:smoke       # Solo los tests críticos (@smoke)
npm run test:regression  # La regresión completa (@regression)
npm run test:debug       # Modo debug
npm run typecheck        # Verificación de tipos (sin correr tests)
npm run report           # Abre el último reporte HTML
```

---

## Configuración por ambiente

```bash
# Apuntar a otra instancia de la API
API_BASE_URL=https://otra-api.com npm test

# O con archivo .env
cp .env.example .env
```

---

## Documentación de estudio

**[docs/GUIA-DE-APRENDIZAJE.md](docs/GUIA-DE-APRENDIZAJE.md)** explica, con alternativas y pros/contras: por qué testear API, la pirámide, contract testing con Zod, API Clients, fixtures, setup por API, encadenamiento, autenticación, casos negativos, idempotencia y CI.

---

## Roadmap (portfolio QA Automation Sr)

1. [Framework E2E web (Playwright)](https://github.com/fercarballo/playwright-e2e-framework-saucedemo) — ✅
2. **Testing de API** ← *estás acá*
3. Pipeline CI/CD completo
4. Caza de flakiness y estabilidad
5. Visual regression + contract testing (Pact)

---

## Licencia

MIT.
