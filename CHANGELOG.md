# Changelog - WhatsApp Connexly Platform

All notable changes to the WhatsApp Connexly Platform will be documented in this file.

## 0.9.0 - Production Deployment Infrastructure

### Updated
- **Database Configuration**: Changed default database user from `whatsjet` to `connexly`
- **Database Naming**: Updated default database name from `whatsjet_prod` to `whatsapp_connexly_prod`
- **Network Configuration**: Updated Docker network name from `whatsjet-network` to `connexly-network`
- **Project Naming**: Renamed project from "Whatsapp" to "WhatsApp Connexly Platform"

### Added
- **Docker Production Setup**: Complete containerization for production deployment
- **Nginx Reverse Proxy**: SSL termination and webhook handling
- **SSL Certificate Management**: Self-signed and Let's Encrypt support
- **Production Environment**: Comprehensive production configuration
- **Deployment Scripts**: Automated deployment and SSL generation
- **Health Monitoring**: Application health check endpoints
- **Worker Service**: Background job processing container
- **Production Database**: Optimized PostgreSQL and Redis setup

### Features
- **Multi-Container Architecture**: Web app, database, Redis, Nginx, and worker services
- **SSL/TLS Support**: HTTPS with proper security headers
- **Webhook Optimization**: Rate limiting and proper proxy configuration
- **Environment Management**: Production-ready environment variable handling
- **Automated Deployment**: One-command deployment with health checks
- **SSL Certificate Generation**: Self-signed certificates for testing
- **Production Security**: Firewall recommendations and security best practices

### Technical Implementation
- **Docker Compose**: Production-ready service orchestration
- **Nginx Configuration**: Reverse proxy with SSL termination
- **SSL Management**: Certificate generation and renewal scripts
- **Health Endpoints**: `/api/health` for monitoring
- **Production Scripts**: `deploy.sh` and `generate-ssl.sh`
- **Environment Templates**: Production environment variable examples
- **Service Monitoring**: Log aggregation and health checking

### Deployment Options
- **Local Testing**: Self-signed SSL for development
- **VPS Deployment**: Step-by-step server setup guide
- **Cloud Platforms**: AWS, DigitalOcean, Google Cloud support
- **SSL Certificates**: Let's Encrypt integration for production
- **Database Management**: Migration and backup strategies
- **Performance Tuning**: Nginx and database optimization

### Security Features
- **HTTPS Enforcement**: HTTP to HTTPS redirects
- **Security Headers**: XSS protection, HSTS, frame options
- **Rate Limiting**: Webhook endpoint protection
- **Firewall Configuration**: Port and service restrictions
- **Environment Isolation**: Secure credential management

## 0.8.0 - WhatsApp Real-Time Chat System

### Added
- **Real-Time WhatsApp Chat**: Complete integration with WhatsApp Business API for live messaging
- **Chat History**: Full conversation history with pagination and search
- **Message Types Support**: Text, images, videos, audio, documents, and voice messages
- **Contact Management**: Enhanced contact list with last message preview and unread counts
- **Message Status Tracking**: Real-time delivery and read receipts from WhatsApp
- **Webhook Integration**: Automatic message storage and status updates via Meta webhooks
- **Optimistic UI**: Instant message display with real-time status updates
- **Search & Filter**: Contact search by name, phone, or email
- **Responsive Design**: Mobile-friendly chat interface with proper scrolling

### Features
- **WhatsApp Business API Integration**: Direct messaging through Meta's official API
- **Real-Time Messaging**: Send and receive messages instantly
- **Message Status Indicators**: Visual feedback for sent, delivered, read, and failed messages
- **Contact Information Display**: Phone, email, and company details in chat header
- **Message History**: Load more messages with pagination
- **Auto-Contact Creation**: New contacts automatically created from incoming messages
- **Message Type Handling**: Support for all WhatsApp message types
- **Error Handling**: Graceful fallbacks for failed message sends
- **Loading States**: Visual feedback during message sending and loading

### Technical Implementation
- **API Endpoints**:
  - `/api/chat/send-message` - Send WhatsApp messages via Business API
  - `/api/chat/history` - Fetch chat history with pagination
  - `/api/chat/contacts` - Get contacts with chat metadata
  - `/api/webhooks/whatsapp/[vendorId]` - Enhanced webhook for message processing
- **Database Integration**: Full message storage and contact management
- **Real-Time Updates**: Webhook-driven message status updates
- **Phone Number Formatting**: Automatic international format handling
- **Message Content Parsing**: Structured storage for different message types
- **Optimistic Updates**: Immediate UI feedback with backend synchronization

### User Experience
- **One-Click Messaging**: Send messages directly to WhatsApp contacts
- **Live Status Updates**: See when messages are delivered and read
- **Contact Search**: Quick contact finding with real-time search
- **Message History**: Complete conversation context with pagination
- **Visual Feedback**: Clear message status indicators and loading states
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

### WhatsApp Integration
- **Business API**: Full integration with Meta's WhatsApp Business API
- **Webhook Processing**: Automatic message reception and status updates
- **Message Types**: Support for text, media, and document messages
- **Contact Sync**: Automatic contact creation from incoming messages
- **Status Tracking**: Real-time delivery and read receipts
- **Error Handling**: Graceful fallbacks for API failures

## 0.7.0 - WhatsApp Business Setup & Integration

### Added
- **WhatsApp Business Setup**: New comprehensive setup page in vendor settings
- **Meta Embedded Signup**: Complete integration with Facebook Login for Business and Meta JavaScript SDK
- **Super Admin Configuration**: WhatsApp Business API management interface for super admins
- **Onboarding Flow**: Multi-step vendor onboarding process with progress tracking
- **OAuth Integration**: Full OAuth flow handling for Meta's embedded signup
- **Configuration Management**: API endpoints for saving and retrieving WhatsApp settings
- **Status Dashboard**: Real-time integration status and setup progress tracking
- **Settings Integration**: Added WhatsApp Business section to main settings page
- **Automatic Webhook Configuration**: Manual setup now automatically configures webhooks with Meta
- **Webhook Endpoint**: Complete webhook handling for incoming messages and delivery receipts

### Features
- **Vendor Onboarding**: Vendors click "Start Embedded Signup" to begin Meta integration
- **Super Admin Management**: Super admins configure Meta App ID, App Secret, and Config ID
- **Credential Management**: Secure storage of WhatsApp Business API credentials
- **Progress Tracking**: Visual progress indicators for each onboarding step
- **Help Resources**: Links to official documentation and support materials
- **Meta SDK Integration**: Facebook Login for Business with JavaScript SDK
- **OAuth Callback Handling**: Secure OAuth flow completion and token exchange
- **Business Portfolio Management**: Support for existing or new business portfolios
- **WABA Creation**: Automatic WhatsApp Business Account setup
- **Phone Verification**: Business phone number verification process
- **Display Name Configuration**: Business display name setup for WhatsApp
- **Smart Manual Setup**: Webhook URL and verify token automatically generated and configured
- **Meta Webhook Integration**: Automatic webhook setup with Meta's WhatsApp Business API
- **Real-time Webhook Processing**: Handle incoming messages, deliveries, and read receipts

### User Flow
- **Vendors**: Click embedded signup → Meta OAuth popup → Complete business setup → Integration ready
- **Super Admins**: Configure WhatsApp Business API → manage all vendor integrations centrally
- **No Vendor Configuration**: Vendors don't enter credentials - managed centrally by super admin
- **Manual Setup**: Vendors enter basic credentials → webhook automatically configured with Meta

### Technical Implementation
- **Meta SDK Integration**: Facebook JavaScript SDK v18.0 with OAuth 2.0
- **OAuth Flow**: Authorization code exchange for access tokens
- **API Endpoints**: 
  - `/api/onboarding/start-embedded-signup` - Initiate signup process
  - `/api/onboarding/embedded-signup/callback` - Handle OAuth callback
  - `/api/admin/whatsapp/config` - Super admin configuration
  - `/api/settings/whatsapp/configure-webhook` - Configure webhook with Meta
  - `/api/webhooks/whatsapp/[vendorId]` - Handle webhook events from Meta
- **Database Integration**: Full integration with existing Vendor model WhatsApp fields
- **Role-Based Access**: WhatsApp setup restricted to vendor admin users, configuration to super admins
- **Form Validation**: Comprehensive validation for all required fields
- **Security**: Sensitive credentials properly handled and stored centrally
- **TypeScript Support**: Complete type definitions for Meta SDK integration
- **Webhook Security**: Automatic token generation and verification
- **Meta API Integration**: Direct Graph API calls for webhook configuration

## 0.6.5 - Flowise AI Bot Integration

### Added
- **Flowise AI Bot**: New automation feature for AI-powered chatbot management
- **AI Bot Configuration**: Bot name, Flowise endpoint, and API key management
- **Bot Monitoring**: Real-time status, conversation counts, and performance metrics
- **AI Model Settings**: Model provider selection, temperature control, and token limits
- **Integration Options**: WhatsApp, web chat widget, API webhooks, and knowledge base
- **Quick Actions**: Test bot, export conversations, analytics, and backup functionality

### Changed
- **Automation Menu**: Added Flowise AI Bot option to vendor admin automation section
- **Menu Navigation**: Enhanced automation menu with AI bot capabilities

## 0.6.4 - Vendor Settings Update & Profile Management

### Changed
- **Vendor Settings**: Removed branding section as whitelabel solutions are not offered
- **Profile Settings**: Replaced branding with comprehensive profile management
- **Settings Navigation**: Updated settings menu to focus on core vendor functionality
- **Menu Configuration**: Completely removed branding option from vendor admin navigation menu

### Added
- **Profile Management**: New profile settings page with company information and account security
- **Account Security**: Password change functionality in profile settings
- **Company Details**: Fields for company name, contact email, phone, and industry selection

### Removed
- **Branding Section**: Eliminated whitelabel/branding functionality from vendor settings
- **Branding Page**: Deleted `/settings/branding` route and related components
- **Branding Menu Item**: Removed branding option from vendor admin navigation menu

## 0.6.3 - Chat Page Runtime Error Fix

### Fixed
- **Chat Page Runtime Error**: Fixed "Cannot read properties of null (reading '0')" error when accessing contact names
- **Null Safety**: Added proper null checks and fallbacks for contact firstName, lastName, and other properties
- **Contact Display**: Contacts without names now display "Unknown" instead of crashing the application

### Technical
- **Optional Chaining**: Implemented `contact.firstName?.[0]` pattern for safe property access
- **Fallback Values**: Added default values for missing contact properties (e.g., '?' for initials, 'Unknown' for names)
- **Search Function**: Updated contact search to handle null firstName/lastName values safely

## 0.6.2 - Contacts Groups Cleanup & UI Fixes

### Fixed
- **Contacts Groups API**: Completely removed `/api/contacts/groups` endpoint that was causing database errors
- **Contacts Page**: Updated UI to work with tags instead of groups, removing all ContactGroup references
- **Database Queries**: Eliminated all remaining references to deleted ContactGroup model in the frontend

### Changed
- **Contacts Interface**: Replaced group-based filtering with tag-based filtering
- **Contact Management**: Simplified contact creation and management to use tags directly
- **UI Components**: Removed group creation modal and related functionality

### Technical
- **API Cleanup**: Removed empty contacts groups directory that was causing routing conflicts
- **Frontend Alignment**: Contacts page now fully aligned with current database schema
- **Error Resolution**: Eliminated runtime errors caused by missing ContactGroup model references

## 0.6.1 - Database Schema Fixes & Missing Pages

### Fixed
- **Database Schema Mismatches**: Resolved Prisma client validation errors for Campaign and Contact models
- **Campaign API**: Fixed invalid include statements for scalar fields (targetAudience, message, schedule, stats)
- **Contact API**: Removed references to deleted ContactGroup model and groups relationship
- **Prisma Client**: Regenerated Prisma client to match current schema

### Added
- **Missing Admin Pages**: Created admin billing and support knowledge base pages
- **Missing Vendor Pages**: Created team management, settings hub, notifications, and integrations pages
- **Page Structure**: Established proper page hierarchy for all menu navigation items

### Changed
- **Campaign Data Access**: Updated Campaign API to access scalar fields directly instead of as relations
- **Database Queries**: Simplified database queries to match current schema structure
- **Navigation Flow**: All menu items now have corresponding pages to navigate to

### Technical
- **Schema Alignment**: Database schema, Prisma client, and API routes are now fully synchronized
- **Error Resolution**: Eliminated runtime errors caused by schema mismatches
- **Page Creation**: Added 8 new pages to support complete navigation structure

## 0.6.0 - Role-Based Menu System Implementation

### Added
- **Comprehensive Menu Configuration**: Created `menu-config.ts` with detailed menu structure for all user roles
- **Role-Based Navigation**: Implemented dynamic navigation based on user role (Super Admin, Vendor Admin, Agent)
- **Sub-Menu Support**: Added collapsible sub-menus for better organization and cleaner interface
- **Mobile Navigation**: Responsive mobile menu with hamburger button and overlay
- **Icon Integration**: Integrated Heroicons throughout the navigation system
- **Permission System**: Foundation for granular permissions within each role
- **Admin Analytics Page**: Created comprehensive analytics dashboard for super admins

### Changed
- **Navigation Component**: Completely redesigned with role-based menu rendering
- **Menu Structure**: Organized features by user roles with logical grouping
- **Database Schema**: Removed ContactGroup model in favor of direct tags on contacts
- **API Endpoints**: Updated contacts API to work with new schema structure
- **Icon References**: Fixed all undefined icon imports with available Heroicons alternatives

### Technical
- **Menu Configuration**: Type-safe menu configuration with interfaces and helper functions
- **Responsive Design**: Mobile-first navigation with desktop sidebar
- **State Management**: Local state for menu expansion and mobile menu visibility
- **Performance**: Efficient menu rendering with proper React patterns
- **Error Resolution**: Fixed compilation errors related to missing icon imports

### Menu Structure
- **Super Admin**: Dashboard, Vendors, Users, Analytics, System, Billing, Support
- **Vendor Admin**: Dashboard, WhatsApp, Contacts, Campaigns, Templates, Automation, Chat, Analytics, Team, Settings
- **Agent**: Dashboard, Conversations, Campaigns, Contacts, Templates, Reports, Settings

### Bug Fixes
- **Icon Import Errors**: Replaced unavailable icons (ToggleIcon, TrendingUpIcon, TicketIcon, BookOpenIcon, AcademicCapIcon) with available alternatives
- **Missing Routes**: Created `/admin/analytics` page to resolve navigation errors
- **Compilation Issues**: Resolved all Next.js compilation errors related to undefined components

## 0.5.0 - Development Pause & Feature Planning

### Added
- **Feature Tracking Document**: Created comprehensive `FEATURE_TRACKING.md` with detailed breakdown of all planned features
- **Role-Based Feature Planning**: Organized features by user roles (Super Admin, Vendor, Agent)
- **Development Roadmap**: Established clear development phases and priorities

### Changed
- **Development Status**: Paused active development to focus on comprehensive feature planning
- **Project Direction**: Shifted from reactive fixes to structured, role-based development approach

### Planning
- **Super Admin Features**: Central console, vendor management, system configuration, billing
- **Vendor Features**: WhatsApp onboarding, contact management, messaging, campaigns, automation
- **Agent Features**: Conversation management, campaign support, customer service, reporting
- **Technical Features**: Infrastructure, security, performance, scalability

---

## 0.4.2 - Manual Contact Creation & Import Features

### Added
- **Manual Contact Creation**: Added "Add Contact" button with form to manually create contacts
- **Sample Import File**: Downloadable CSV template for contact imports with proper formatting
- **Enhanced Import Modal**: Improved import interface with sample file download and format instructions

### Fixed
- **Database Schema**: Updated Contact model with proper fields (firstName, lastName, phoneNumber, email, company, tags, isOptedOut)
- **API Compatibility**: Fixed contacts API to use correct field names and relationships
- **Form Validation**: Added proper form handling for contact creation with error handling

### Changed
- **Contact Management**: Enhanced with manual creation and improved import workflow
- **User Experience**: Better form design and error handling for contact operations

---

## 0.4.1 - Dashboard Visibility & Schema Fixes

### Fixed
- **Dashboard Text Visibility**: Resolved dark text on dark background issues in both vendor and admin dashboards
- **Database Schema**: Added missing Campaign model fields (description, type, targetAudience, message, schedule, stats)
- **Campaign API**: Fixed API errors caused by missing database fields
- **UI/UX**: Enhanced dashboard layouts with proper Tailwind CSS classes, icons, and responsive design

### Changed
- **Vendor Dashboard**: Complete redesign with stats cards, quick actions, and proper contrast
- **Admin Dashboard**: Enhanced with overview stats, vendor table, and modern UI components
- **Database**: Added CampaignType enum and updated Campaign model structure

### Technical
- **Prisma Schema**: Added soft delete support for Campaign model
- **Migration**: Applied database migration for new Campaign fields
- **Styling**: Replaced inline styles with Tailwind CSS classes throughout dashboards

---

## 0.4.0 - Core Infrastructure & Authentication

### Added
- **Monorepo Structure**: Established pnpm workspace with apps/web, packages/db, and services/worker
- **Database Schema**: Comprehensive Prisma schema with User, Vendor, Contact, Campaign, and related models
- **Authentication System**: NextAuth.js integration with JWT sessions and RBAC
- **Role-Based Access Control**: User roles (SUPER_ADMIN, VENDOR_ADMIN, AGENT, VIEWER) with permission system
- **Basic Dashboards**: Admin and vendor dashboard pages with overview statistics
- **Navigation System**: Responsive sidebar navigation with role-based menu items

### Technical
- **Database**: PostgreSQL with Prisma ORM, Docker containerization
- **Web Framework**: Next.js 14 with App Router, TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: SWR for client-side data fetching
- **Background Jobs**: BullMQ integration for queue management

---

## 0.3.0 - Project Initialization

### Added
- **Project Scaffolding**: Initial monorepo setup with pnpm workspaces
- **Docker Configuration**: PostgreSQL, Redis, and LocalStack services
- **Basic Structure**: Directory organization for web app, database, and worker services
- **Development Environment**: Local development setup with environment configuration

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/) format and [Semantic Versioning](https://semver.org/).*

