# WhatsApp Connexly Platform

A comprehensive, enterprise-grade WhatsApp marketing platform built with modern technologies for businesses to manage contacts, create campaigns, and engage with customers through WhatsApp.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture** - Secure isolation between different business accounts
- **Role-Based Access Control** - Super Admin, Vendor Admin, Agent, and Viewer roles
- **Contact Management** - Import, organize, and manage contacts with groups and tags
- **Campaign Management** - Create, schedule, and monitor WhatsApp marketing campaigns
- **Real-time Chat** - Interactive messaging interface for customer engagement
- **Template System** - Pre-approved WhatsApp message templates for compliance
- **Analytics Dashboard** - Comprehensive performance tracking and reporting

### Technical Features
- **Modern Tech Stack** - Next.js 14, TypeScript, Prisma, PostgreSQL
- **Real-time Updates** - SWR for data fetching and real-time synchronization
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Secure Authentication** - NextAuth.js with JWT sessions
- **API-First Architecture** - RESTful APIs for all operations
- **Database Management** - Prisma ORM with PostgreSQL
- **Background Processing** - BullMQ for campaign queue management

## 🏗️ Architecture

```
Connexly/
├── apps/
│   └── web/                 # Next.js web application
│       ├── app/            # App Router pages and API routes
│       ├── components/     # Reusable React components
│       └── lib/           # Utility functions and configurations
├── packages/
│   └── db/                # Database package with Prisma
│       ├── prisma/        # Database schema and migrations
│       └── src/           # Database client exports
└── services/
    └── worker/            # Background job processing
        └── src/           # BullMQ queue workers
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT
- **State Management**: SWR for data fetching
- **Queue System**: BullMQ with Redis
- **Styling**: Tailwind CSS with custom dark theme
- **Icons**: Heroicons
- **Package Manager**: pnpm with monorepo workspaces

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database
- Redis (for queue management)
- Docker (optional, for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-connexly
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database and Redis credentials
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL and Redis (using Docker)
   docker-compose up -d
   
   # Run database migrations
   pnpm --filter db db:push
   
   # Seed the database
   pnpm --filter db db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm --filter web dev
   ```

6. **Access the application**
   - Web App: http://localhost:3000
   - Default credentials: admin@example.com / admin123

## 📱 Platform Overview

### Dashboard
- Overview of key metrics and recent activity
- Quick access to all platform features
- Role-based content and permissions

### Contacts Management
- **Contact CRUD Operations** - Add, edit, delete contacts
- **Group Management** - Organize contacts into groups
- **Import/Export** - CSV import and export functionality
- **Search & Filtering** - Advanced contact search capabilities
- **Tags & Custom Fields** - Flexible contact categorization

### Campaign Management
- **Campaign Types** - Bulk messages, template messages, bot flows
- **Targeting** - All contacts, specific groups, or custom filters
- **Scheduling** - Immediate, scheduled, or recurring campaigns
- **Status Tracking** - Draft, scheduled, running, paused, completed
- **Performance Monitoring** - Real-time campaign statistics

### Chat Interface
- **Real-time Messaging** - Live chat with contacts
- **Contact List** - Searchable contact directory
- **Message Status** - Delivery and read receipts
- **Conversation History** - Complete message threading

### Templates System
- **Template Creation** - Header, body, footer, and buttons
- **Categories** - Marketing, utility, and authentication
- **Approval Workflow** - Status tracking for compliance
- **Multi-language Support** - International template support

### Analytics & Reporting
- **Performance Metrics** - Delivery rates, read rates, response rates
- **Campaign Analytics** - Detailed campaign performance data
- **Contact Insights** - Engagement and interaction metrics
- **Export Capabilities** - CSV and PDF report generation

## 🔐 Authentication & Security

### User Roles
- **Super Admin**: Platform-wide administration and vendor management
- **Vendor Admin**: Business account management and team administration
- **Agent**: Campaign execution and customer interaction
- **Viewer**: Read-only access to reports and analytics

### Security Features
- JWT-based authentication
- Role-based access control
- Secure API endpoints
- Data isolation between tenants
- Audit logging for compliance

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Current session

### Contacts
- `GET /api/contacts` - List contacts with pagination
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts` - Update contact
- `DELETE /api/contacts` - Delete contacts

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns` - Update campaign
- `PATCH /api/campaigns/[id]/status` - Update campaign status

### Templates
- `GET /api/templates` - List message templates
- `POST /api/templates` - Create template
- `PUT /api/templates` - Update template
- `DELETE /api/templates/[id]` - Delete template

## 🎨 UI/UX Features

### Design System
- **Dark Theme** - Professional dark color scheme
- **Responsive Layout** - Mobile-first responsive design
- **Interactive Elements** - Hover states and transitions
- **Status Indicators** - Visual feedback for all states
- **Icon System** - Consistent iconography throughout

### Components
- **Navigation Sidebar** - Easy access to all features
- **Data Tables** - Sortable and filterable data display
- **Modal Forms** - Clean data entry interfaces
- **Progress Indicators** - Visual progress tracking
- **Status Badges** - Clear status representation

## 🚀 Deployment

### Production Requirements
- Node.js 18+ environment
- PostgreSQL database
- Redis instance
- Environment variables configuration
- SSL certificate for HTTPS

### Deployment Options
- **Vercel** - Recommended for Next.js applications
- **AWS** - EC2 with RDS and ElastiCache
- **Google Cloud** - Compute Engine with Cloud SQL
- **Docker** - Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

- **Documentation**: Built-in help system
- **Email**: support@connexly.com
- **Live Chat**: Available in the platform
- **GitHub Issues**: For bug reports and feature requests

## 🔮 Roadmap

### Upcoming Features
- **Bot Flow Builder** - Visual conversation flow designer
- **Advanced Analytics** - Machine learning insights
- **Multi-language Support** - Internationalization
- **Mobile App** - Native iOS and Android applications
- **API Integrations** - Third-party service connections
- **Advanced Automation** - AI-powered campaign optimization

### Performance Improvements
- **Real-time Updates** - WebSocket integration
- **Caching Layer** - Redis caching for performance
- **CDN Integration** - Global content delivery
- **Database Optimization** - Query performance improvements

---

**Connexly** - Empowering businesses with professional WhatsApp marketing solutions.
