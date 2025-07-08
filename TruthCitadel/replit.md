# House of Truth - Dark Academia Application

## Overview

House of Truth is a dark academia-themed web application designed as a digital sanctuary for scholars, thinkers, and knowledge seekers. The application provides users with tools to organize their intellectual pursuits, track personal rituals, and manage their scholarly activities in an elegant, academically-inspired interface.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom dark academia theme
- **UI Components**: Radix UI components via shadcn/ui
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Payment Processing**: Stripe integration for subscriptions
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

### Database Architecture
- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon serverless PostgreSQL via WebSocket
- **Schema**: Centralized in shared directory for type safety
- **Migrations**: Drizzle migrations in dedicated migrations folder

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL sessions table
- **User Management**: Comprehensive user profiles with subscription status
- **Authorization**: Route-level protection with middleware

### Content Management
- **Categories**: Literature, Rituals, Aesthetics, Music
- **Features**: CRUD operations, tagging, image support
- **Organization**: User-specific content isolation
- **Activity Tracking**: Comprehensive activity logging

### Subscription System
- **Payment Provider**: Stripe with React Stripe.js
- **Tiers**: Free and Premium subscription levels
- **Features**: Subscription status tracking, upgrade flows
- **Customer Management**: Stripe customer ID integration

### Theme System
- **Design**: Dark Academia aesthetic with custom CSS variables
- **Colors**: Warm browns, golds, and creams
- **Typography**: Serif fonts for headings, clean sans-serif for body
- **Customization**: Theme provider for future theme variations

## Data Flow

### User Authentication Flow
1. User initiates login through Replit Auth
2. OpenID Connect verification and token exchange
3. Session creation in PostgreSQL
4. User profile creation/update
5. Client-side authentication state management

### Content Creation Flow
1. User creates content via form submission
2. Zod validation on client and server
3. Database insertion with user association
4. Activity log creation
5. Real-time UI updates via TanStack Query

### Subscription Flow
1. User initiates subscription upgrade
2. Stripe payment element integration
3. Payment processing and webhook handling
4. Database subscription status update
5. Feature access control updates

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless
- **Authentication**: Replit Auth service
- **Payments**: Stripe API
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS

### Development Dependencies
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across stack
- **ESBuild**: Server-side bundling
- **PostCSS**: CSS processing

## Deployment Strategy

### Development
- **Server**: Node.js with tsx for TypeScript execution
- **Client**: Vite dev server with HMR
- **Database**: Development database connection
- **Environment**: Local development with Replit integration

### Production
- **Build Process**: 
  1. Vite builds client to dist/public
  2. ESBuild bundles server to dist/index.js
- **Server**: Node.js production server
- **Static Files**: Served by Express in production
- **Database**: Production PostgreSQL connection

### Environment Configuration
- **Required Variables**: DATABASE_URL, SESSION_SECRET, STRIPE_SECRET_KEY
- **Optional Variables**: REPLIT_DOMAINS, ISSUER_URL, STRIPE_PUBLIC_KEY
- **Development**: Local .env file
- **Production**: Platform environment variables

## Changelog

Changelog:
- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.