# House of Truth - Dark Academia Application

A sophisticated dark academia-themed content management platform designed for scholars, thinkers, and knowledge seekers. House of Truth provides an elegant digital sanctuary for organizing intellectual pursuits, tracking personal rituals, and managing scholarly activities.

## ✨ Features

### 🎨 Dark Academia Aesthetic
- Beautiful dark academia theme with warm browns, golds, and creams
- Multiple theme options available
- Serif fonts for headings, clean typography throughout
- Immersive scholarly atmosphere

### 📚 Content Organization
- **Literature**: Organize books, quotes, and literary analyses
- **Rituals**: Track personal habits and academic routines
- **Aesthetics**: Curate visual inspirations and artistic content
- **Music**: Manage playlists and musical discoveries
- Full CRUD operations with tagging and image support

### 💎 Premium Features
- Subscription-based premium tier via Stripe
- Advanced integrations with Discord, Notion, and Obsidian
- Enhanced content creation limits
- Priority support and exclusive features

### 🔔 Smart Reminders
- Personal reminder system for important tasks
- Activity tracking and statistics
- Comprehensive activity logging

### 📊 Personal Dashboard
- User statistics and analytics
- Activity feed with recent actions
- Quick actions for common tasks
- Featured collections showcase

## 🛠️ Technical Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components via shadcn/ui
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Drizzle ORM
- **Replit Auth** with OpenID Connect
- **Stripe** for payment processing
- **Session management** with PostgreSQL storage

### Database
- **PostgreSQL** with Drizzle ORM
- **Neon** serverless database
- Centralized schema in `shared/schema.ts`
- Type-safe database operations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/house-of-truth.git
cd house-of-truth
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
DATABASE_URL=your_postgresql_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
SESSION_SECRET=your_session_secret
```

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📝 Project Structure

```
house-of-truth/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── db.ts              # Database configuration
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── replitAuth.ts      # Authentication setup
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── README.md
```

## 🎯 Key Features

### Authentication
- Secure authentication via Replit Auth
- Session management with PostgreSQL
- User profile management
- Protected routes and API endpoints

### Content Management
- Create, read, update, delete content across categories
- Rich text support with image uploads
- Tagging system for organization
- User-specific content isolation

### Subscription System
- Stripe integration for secure payments
- Free and Premium tiers
- Subscription status tracking
- Feature access control

### Theme System
- Dark academia primary theme
- Customizable color schemes
- Responsive design
- Accessibility considerations

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

### Database Operations
The application uses Drizzle ORM for type-safe database operations. All database schemas are defined in `shared/schema.ts`.

### Adding New Features
1. Update database schema in `shared/schema.ts`
2. Add storage methods in `server/storage.ts`
3. Create API routes in `server/routes.ts`
4. Build frontend components and pages

## 🔐 Security

- Environment variables for sensitive data
- Secure session management
- Input validation with Zod schemas
- SQL injection prevention via Drizzle ORM
- CSRF protection for forms

## 📊 Performance

- Server-side rendering with Express
- Efficient database queries with Drizzle
- Optimized bundle sizes with Vite
- Caching strategies with TanStack Query

## 🚀 Deployment

The application is designed for deployment on Replit with:
- Automatic builds and deployments
- Environment variable management
- PostgreSQL database provisioning
- SSL/TLS certificate handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by dark academia aesthetics
- Built with modern web technologies
- Designed for scholars and knowledge seekers

---

*House of Truth - Where knowledge finds its home* 🏛️