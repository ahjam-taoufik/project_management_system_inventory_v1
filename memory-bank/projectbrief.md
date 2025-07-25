# Project Brief - Laravel 12 Inventory Management System

## Core Mission
Build a comprehensive inventory management system for commercial operations using Laravel 12, Inertia.js, React, and TypeScript. The system manages products, clients, commercials, and their relationships with full CRUD operations and role-based permissions.

## Key Requirements

### 1. Entity Management
- **Products**: Complete catalog with brands, categories, units per package
- **Clients**: Customer database with commercial assignments and locations
- **Commercials**: Sales representatives with territory management
- **Brands & Categories**: Product classification system
- **Locations**: Cities (Villes) and sectors (Secteurs) for territory mapping

### 2. User Management & Security
- Role-based access control using spatie/laravel-permission
- User authentication via Laravel Breeze + Sanctum
- Proper authorization for all CRUD operations
- Multi-level permission system

### 3. Technical Architecture
- **Backend**: Laravel 12 with PHP 8.2+, MySQL database
- **Frontend**: React with TypeScript via Inertia.js SPA
- **UI**: TailwindCSS + shadcn/ui components
- **Data**: Eloquent ORM with proper relationships

### 4. Business Logic
- Commercial-client assignment tracking
- Product inventory with detailed specifications
- Territory-based client organization
- Print functionality for client lists by commercial

## Success Criteria
1. Complete CRUD operations for all entities
2. Secure role-based access control
3. Intuitive React-based user interface
4. Reliable data relationships and integrity
5. Print/export capabilities for business operations

## Current Scope
Focus on core inventory management with clean, maintainable code following Laravel 12 best practices and modern React patterns. 