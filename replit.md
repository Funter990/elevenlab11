# Overview

This is a voice generation application that integrates with the ElevenLabs API to convert text scripts into synthesized audio. The application provides a user-friendly interface for entering scripts, configuring voice settings, and generating high-quality speech output with customizable parameters like stability, similarity, style exaggeration, and speed.

The system features a modern web interface built with React and TypeScript, offering real-time character counting, file upload capabilities, voice history management, and comprehensive voice configuration options. It's designed to help users create professional voice content while staying within ElevenLabs' credit limits.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent, accessible design
- **State Management**: React hooks for local state, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Theme System**: Custom theme provider supporting light/dark modes with CSS variables

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with centralized route registration
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Storage**: In-memory storage implementation with interface-based design for future database integration

## Data Storage Solutions
- **Development**: In-memory storage using Maps for users and voice generations
- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions ready for production
- **Migration System**: Drizzle-kit for database migrations and schema management
- **Session Storage**: connect-pg-simple for PostgreSQL session storage (configured but not actively used)

## Authentication and Authorization
- **Current Implementation**: No authentication system (placeholder for future implementation)
- **Prepared Infrastructure**: User schema and authentication middleware ready for implementation
- **Session Management**: Express session configuration present but not enforced

## External Service Integrations
- **ElevenLabs API**: Primary voice synthesis service with support for multiple models
- **Voice Models**: Support for eleven_multilingual_v2, eleven_flash_v2_5, eleven_v3, and eleven_turbo_v2_5
- **Audio Processing**: Direct streaming of audio responses from ElevenLabs API
- **Rate Limiting**: Client-side character limit enforcement (10,000 character limit)
- **Error Handling**: Comprehensive API error handling with user-friendly error messages

## Key Architectural Decisions

### Monorepo Structure
- **Problem**: Need to share types and schemas between frontend and backend
- **Solution**: Shared folder containing common schemas and types
- **Benefits**: Type safety across the full stack, single source of truth for data models

### Component-Based UI Architecture
- **Problem**: Need for consistent, reusable UI components
- **Solution**: shadcn/ui component library with custom theming
- **Benefits**: Accessibility compliance, consistent design system, reduced development time

### In-Memory Storage with Database Schema
- **Problem**: Need rapid development while preparing for production scalability
- **Solution**: Interface-based storage with in-memory implementation and PostgreSQL schema ready
- **Benefits**: Fast development iteration, easy transition to persistent storage

### Direct API Integration
- **Problem**: Need to integrate with ElevenLabs API while maintaining security
- **Solution**: Server-side proxy with client-provided API keys
- **Benefits**: CORS handling, request logging, future rate limiting capabilities

### Real-Time Validation and Feedback
- **Problem**: Users need immediate feedback on character limits and voice settings
- **Solution**: Client-side validation with real-time character counting and progress indicators
- **Benefits**: Better user experience, reduced API errors, cost awareness