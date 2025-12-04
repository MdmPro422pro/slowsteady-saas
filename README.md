# Slowsteady — SaaS scaffold

Opinionated starting scaffold for a SaaS using your recommendations.

## Stack choices (starter)

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express (APIs, auth, wallets)
- **Database**: Postgres, caching with Redis
- **Dev tooling**: pnpm workspaces, Docker Compose

## Next recommended milestones

1. ✅ Wire up CI (build & test) and protected branches.
2. ✅ **Add authentication (JWT + OAuth2 + 2FA/TOTP)** - [See docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)
3. ⏳ Add database migrations and user model (Prisma recommended).
4. Add KYC provider(s) integration (Sumsub/Jumio/Persona) as a backend service.
5. Plan matching-engine as a separate microservice (Go/Rust).
6. Decide wallet strategy: Custodial MVP vs MPC/HSM.

## Getting Started

```bash
git clone https://github.com/Mdmpro422pro/Slowsteady.git
cd Slowsteady
code .
```

### Initial Setup

1. **Install dependencies:**
   ```bash
   pnpm -w install
   ```

2. **Start Docker services (Postgres & Redis):**
   ```bash
   docker-compose up -d
   ```

3. **Set up the backend:**
   ```bash
   cd packages/backend
   cp .env.example .env
   # Edit .env and set JWT_SECRET to a strong random value
   pnpm prisma:migrate
   pnpm prisma:generate
   cd ../..
   ```

4. **Set up the frontend:**
   ```bash
   cd packages/frontend
   cp .env.example .env
   cd ../..
   ```

5. **Start development servers:**
   ```bash
   pnpm dev
   ```

Access the app:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Helpful commands

```bash
pnpm -w install        # Install all dependencies
pnpm dev               # Runs frontend + backend concurrently
docker-compose up -d   # Start services (Postgres, Redis, etc.)
```

## Contributing

- Use feature branches; PRs should include tests for new behavior.

## License

MIT
