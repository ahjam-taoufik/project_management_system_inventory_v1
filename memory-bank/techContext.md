# Tech Context - Technologies & Development Setup

## Core Technology Stack

### Backend - Laravel 12
- **Framework**: Laravel 12 (latest stable)
- **PHP**: PHP 8.2+ with strict types enabled
- **Database**: MySQL with Eloquent ORM
- **Authentication**: Laravel Breeze + Sanctum
- **Permissions**: spatie/laravel-permission
- **Query Builder**: spatie/laravel-query-builder

### Frontend - React SPA
- **Framework**: React 18+ with TypeScript
- **SPA Bridge**: Inertia.js for seamless Laravel integration
- **Build Tool**: Vite for fast development and builds
- **Styling**: TailwindCSS utility-first framework
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icon library

### ⚠️ CRITICAL: HTTP Request Patterns
**RULE**: Always use Inertia.js (`router.post()`, `router.put()`, `router.delete()`) instead of `fetch()` for form submissions and CRUD operations.

**Exceptions (cas particuliers)**:
- API calls for dynamic data loading (`/api/product-details/{id}`)
- Real-time validation checks (`/api/check-bl-exists/{numeroBl}`)
- File uploads with progress tracking
- WebSocket connections

**Why**: Prevents CSRF issues (error 419), ensures consistent error handling, maintains SPA experience.

### Development Tools
- **Package Manager**: npm (Node.js ecosystem)
- **Type Checking**: TypeScript with strict configuration
- **Code Formatting**: ESLint + Prettier (via eslint.config.js)
- **Testing**: Pest (PHP) + React Testing Library
- **Version Control**: Git with conventional commits

## Development Environment Setup

### Prerequisites
```bash
# Required software
PHP 8.2+
Composer 2.x
Node.js 18+
npm 8+
MySQL 8.0+
```

### Local Development
```bash
# Backend setup
composer install
php artisan migrate:fresh --seed
php artisan key:generate
php artisan serve

# Frontend setup
npm install
npm run dev

# Optional: Run tests
php artisan test
npm run test
```

### Configuration Files
- **composer.json**: PHP dependencies and autoloading
- **package.json**: Node.js dependencies and scripts
- **vite.config.ts**: Frontend build configuration
- **tsconfig.json**: TypeScript compiler options
- **tailwind.config.ts**: CSS framework configuration
- **eslint.config.js**: Code linting rules

## Database Configuration

### Connection Setup
- **Driver**: MySQL PDO
- **Charset**: utf8mb4 with unicode collation
- **Migrations**: Version-controlled schema changes
- **Seeders**: Development and testing data

### Key Features
- Foreign key constraints with proper cascading
- Unique constraints for business logic enforcement
- Indexes on frequently queried columns
- Soft deletes for audit trails

## File Structure & Organization

### Backend Structure
```
app/
├── Http/
│   ├── Controllers/        # Route handlers
│   ├── Requests/          # Form validation
│   └── Middleware/        # Request processing
├── Models/                # Eloquent models
└── Providers/             # Service providers

database/
├── migrations/            # Schema changes
├── seeders/              # Data population
└── factories/            # Test data generation
```

### Frontend Structure
```
resources/js/
├── pages/                # Inertia page components
├── components/           # Shared React components
├── layouts/              # Page layout components
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── lib/                  # Utility functions
```

## Build & Deployment

### Development Build
```bash
# Start development servers
php artisan serve      # Backend on :8000
npm run dev           # Frontend with HMR
```

### Production Build
```bash
# Optimize for production
composer install --no-dev --optimize-autoloader
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Configuration
- **Development**: `.env.local` with debug enabled
- **Testing**: `.env.testing` with test database
- **Production**: `.env` with optimizations enabled

## Security Configuration

### CSRF Protection
- Sanctum CSRF tokens for SPA authentication
- Automatic token inclusion in Inertia requests
- Token validation on all state-changing operations

### HTTPS & CORS
- Force HTTPS in production
- CORS configured for SPA operation
- Secure cookie settings

### Input Validation
- Server-side validation via FormRequest classes
- SQL injection prevention through Eloquent ORM
- XSS protection via proper output escaping

## Performance Considerations

### Backend Optimization
- Opcache enabled for PHP code caching
- Database query optimization with indexes
- Eager loading to prevent N+1 queries
- Response caching for static data

### Frontend Optimization
- Code splitting at route level
- Asset optimization through Vite
- Lazy loading for heavy components
- Browser caching for static assets

## Development Constraints

### Code Standards
- PSR-12 for PHP code formatting
- Strict TypeScript configuration
- No `any` types allowed
- 200-line file size limit preference

### Framework Limitations
- Laravel 12 specific features and conventions
- Inertia.js SPA constraints (no traditional AJAX)
- shadcn/ui component limitations
- React functional components only

### Browser Support
- Modern browsers with ES2020+ support
- Mobile-first responsive design
- Progressive enhancement approach
- Accessibility compliance (WCAG 2.1)

## Testing Configuration

### Backend Testing
- **Framework**: Pest for PHP testing
- **Database**: SQLite in-memory for tests
- **Coverage**: PHPUnit for code coverage reports
- **Factories**: Faker-generated test data

### Frontend Testing
- **Framework**: Vitest + React Testing Library
- **Types**: TypeScript test files
- **Mocking**: MSW for API mocking
- **E2E**: Playwright for end-to-end tests

## Debugging Tools

### Development Tools
- **Laravel Telescope**: Request/query debugging
- **React DevTools**: Component inspection
- **Inertia DevTools**: Page prop debugging
- **Laravel Debugbar**: Performance profiling

### Error Handling
- Detailed error pages in development
- Log aggregation via Laravel logging
- Error boundaries for React crashes
- Proper HTTP status codes

## Package Management

### Key PHP Dependencies
```json
{
  "laravel/framework": "^12.0",
  "inertiajs/inertia-laravel": "^1.0",
  "spatie/laravel-permission": "^6.0",
  "spatie/laravel-query-builder": "^6.0"
}
```

### Key NPM Dependencies
```json
{
  "react": "^18.0",
  "typescript": "^5.0",
  "@inertiajs/react": "^1.0",
  "tailwindcss": "^3.0",
  "vite": "^5.0"
}
```

### Update Strategy
- Regular dependency updates for security
- Test compatibility before major updates
- Version pinning for stable releases
- Dependency vulnerability scanning 
