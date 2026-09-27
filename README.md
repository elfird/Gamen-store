# Gamen Store

Modern iPhone e-commerce and store management system.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Auth.js *(to be configured)*
- **Images**: Cloudinary *(to be configured)*
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/
│   ├── ui/           # Reusable UI primitives (Button, Badge, Modal…)
│   ├── store/        # Customer storefront components
│   ├── admin/        # Admin dashboard components
│   ├── products/     # Product-specific components
│   ├── orders/       # Order-specific components
│   └── finance/      # Finance-specific components
├── lib/
│   ├── prisma.js     # Prisma singleton client
│   ├── utils.js      # Utility functions
│   ├── constants.js  # Business enums and labels
│   └── api.js        # API response helpers
├── services/         # Business logic layer
├── hooks/            # Custom React hooks
└── middleware.js     # Route protection
prisma/
├── schema.prisma     # Database schema
└── seed.js           # Seed script
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `WHATSAPP_NUMBER` — business WhatsApp in international format
- Cloudinary credentials

### 3. Set up the database

```bash
# Push schema to database (development)
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Generate Prisma client

```bash
npm run db:generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema without migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with initial data |

## Business Rules

See [AGENTS.md](./AGENTS.md) for complete business rules and development guidelines.
