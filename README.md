# CV Analyzer

Analizador de CVs potenciado por IA que da una puntuación, detecta puntos débiles y sugiere mejoras concretas en segundos. Incluye un modelo freemium: análisis básicos gratis, y un plan Pro de $5/mes con sugerencias detalladas e ilimitadas.

## 🚀 Demo en vivo

👉 [cv-analyzer-lilac.vercel.app](https://cv-analyzer-lilac.vercel.app)

> Podés registrarte con cualquier email y probar el análisis gratis (hasta 3 CVs). Para probar el plan Pro, Stripe está en modo test — usá la tarjeta `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC.

## ✨ Features

- 🔐 **Autenticación** con registro/login, contraseñas hasheadas con bcrypt y sesiones vía JWT
- 📄 **Análisis de CV con IA**: subís tu CV en PDF y recibís una puntuación del 1 al 100, puntos fuertes, puntos a mejorar y sugerencias concretas
- 🆓 **Plan Gratis**: hasta 3 análisis con resumen breve
- ⭐ **Plan Pro ($5/mes)**: análisis ilimitados, sugerencias detalladas por sección y reescritura del resumen profesional
- 💳 **Pagos con Stripe**: checkout de suscripción y actualización automática de plan vía webhooks
- 🛡️ **Seguridad**: rate limiting, validación de tipo y tamaño de archivo (solo PDF, máx. 5MB), CORS restringido y variables sensibles fuera del código

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js (App Router) + React + Tailwind CSS |
| Backend | NestJS |
| Base de datos | PostgreSQL (Supabase) + TypeORM |
| IA | Google Gemini API (`gemini-3.6-flash`) |
| Pagos | Stripe (Checkout + Webhooks) |
| Autenticación | Passport.js + JWT + bcrypt |
| Deploy Frontend | Vercel |
| Deploy Backend | Railway |
| Control de versiones | Git + GitHub |

## 🏗️ Arquitectura

```
Usuario → Next.js (Frontend, Vercel)
              ↓
         NestJS (Backend, Railway)
         ↙        ↘
   Gemini API    Stripe API
              ↓
         PostgreSQL (Supabase)
```

**Flujo del análisis:**
1. El usuario sube su CV en PDF desde el Dashboard
2. El backend extrae el texto del PDF (`pdf-parse`)
3. Se arma un prompt distinto según el plan del usuario (gratis = breve, pro = detallado)
4. Se envía a la API de Gemini y se guarda el resultado en la base de datos
5. Si el usuario gratis ya usó sus 3 análisis, se bloquea con un 403 hasta que actualice a Pro

**Flujo del pago:**
1. El usuario elige el plan Pro desde `/pricing`
2. El backend crea una sesión de Stripe Checkout
3. Tras el pago, Stripe dispara un webhook (`checkout.session.completed`)
4. El backend actualiza el plan del usuario a `pro` en la base de datos

## 💻 Cómo correrlo localmente

### Requisitos previos
- Node.js v22+
- Una cuenta en [Supabase](https://supabase.com) (base de datos PostgreSQL gratis)
- Una API Key de [Google AI Studio](https://aistudio.google.com) (Gemini, gratis)
- Una cuenta en [Stripe](https://stripe.com) (modo test)

### 1. Clonar el repositorio

```bash
git clone https://github.com/franjz20/cv-analyzer.git
cd cv-analyzer
```

### 2. Backend

```bash
cd backend
npm install
```

Creá un archivo `.env` en `backend/` con:

```env
DATABASE_HOST=tu_host_de_supabase
DATABASE_PORT=6543
DATABASE_USER=tu_usuario
DATABASE_PASSWORD=tu_password
DATABASE_NAME=postgres
JWT_SECRET=una_clave_secreta_larga
GEMINI_API_KEY=tu_api_key_de_gemini
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3001
```

Levantar el servidor:

```bash
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Creá un archivo `.env.local` en `frontend/` con:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Levantar el servidor:

```bash
npm run dev
```

### 4. Webhooks de Stripe en local

Para que los pagos actualicen el plan del usuario en desarrollo, corré el [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --events=checkout.session.completed,customer.subscription.deleted --forward-to localhost:3000/pagos/webhook
```

Copiá el `whsec_...` que te devuelve y pegalo en `STRIPE_WEBHOOK_SECRET` del `.env` del backend.

## 🗺️ Roadmap

- [ ] Rediseño del frontend (UI/UX más pulida)
- [ ] Límite de análisis gratis por ciclo mensual en vez de histórico total
- [ ] Descarga del CV mejorado en PDF (plan Pro)
- [ ] Historial de análisis anteriores en el Dashboard
- [ ] Tests automatizados (unitarios y e2e)

## 👤 Autor

**Franco Juarez**
AI Sofware Engineer — Jujuy, Argentina

- 📧 francodanielj@gmail.com
- 🐙 [github.com/franjz20](https://github.com/franjz20)
- https://www.linkedin.com/in/franco-juarez-184985236/