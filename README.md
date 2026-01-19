# PawFriends

A modern web application that helps dog owners find playmates for their furry friends through an intuitive swipe-based matching system.

## Application Description

**PawFriends** is a "Tinder-style" social platform designed specifically for dogs and their owners. The app solves a common problem: finding compatible playmates for your pets in your local area.

### The Problem

Dog owners often struggle to find suitable playmates for their pets. Traditional methods like visiting dog parks can be hit-or-miss, and there's no way to pre-screen potential playmates for compatibility.

### The Solution

PawFriends creates a fun, engaging way for pet owners to:
- Create detailed profiles for their dogs
- Browse and swipe through potential playmates
- Match with compatible dogs
- Connect with other pet owners to arrange playdates

### What Makes It Stand Out

- **Swipe-based UX**: Familiar, intuitive interface inspired by popular dating apps
- **Multi-pet support**: Manage multiple dogs from a single account
- **Active/Inactive toggle**: Temporarily hide pets from matching without deleting profiles
- **Real-time matching**: Instant notifications when you find a mutual match
- **Clean, modern design**: Responsive SCSS-based UI with smooth animations

## Notable Features

| Feature | Description |
|---------|-------------|
| User Authentication | Secure signup/login with session management |
| Pet Profiles | Create detailed profiles with photos, breed, age, and personality traits |
| Swipe Matching | Tinder-style card swiping to like or pass on potential playmates |
| Match Management | View all your matches and connected pet owners |
| Multi-pet Dashboard | Manage multiple pets from a central dashboard |
| Pet Selector | Switch between pets when swiping for different dogs |
| Toast Notifications | Real-time feedback for user actions |
| Protected Routes | Secure authentication-gated pages |

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router 7 | Client-side routing |
| Zustand | State management |
| SCSS | Styling (BEM methodology) |
| Zod | Schema validation |
| Vitest | Unit testing |

## Initial Setup Guide

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- [PawFriends API](https://github.com/your-repo/pawfriends-api) running locally (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pawfriends.git
   cd pawfriends
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.sample .env
   ```

   Edit `.env` and set your API URL:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**

   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run coverage` | Generate test coverage report |

### Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
│   ├── common/      # Shared components (Button, Input, Modal, etc.)
│   └── layout/      # Layout components (Header, MainLayout)
├── pages/           # Route page components
├── stores/          # Zustand state stores
├── services/        # API service modules
├── constants/       # App constants and routes
├── styles/          # Global SCSS variables and mixins
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

## Prompt Documentation

### Development Methodology

This application was built using **AI-assisted development** (vibecoding) with Claude as the primary collaborator. The development followed an iterative, conversational approach where features were described in natural language and implemented through dialogue.

### Prompting Approach

The development methodology emphasized:

1. **Clear feature descriptions**: Each feature request included context about the user experience and expected behavior
2. **Incremental development**: Building features step-by-step rather than all at once
3. **Code quality standards**: Establishing conventions early (BEM, Zustand patterns, file structure)
4. **Iterative refinement**: Reviewing generated code and requesting adjustments

### Key Development Prompts

> 📋 Full prompt history: [`logs/user_prompt_submit.json`](logs/user_prompt_submit.json)

#### 1. Project Standards Setup
> "Update `CLAUDE.md` to include enforced code structure and naming conventions for this React + Vite application..."

Established folder structure, file naming conventions, component patterns, and Zustand store patterns that guided all subsequent development.

#### 2. Dependency Installation & Tooling
> "Using `claude.md` as a guide, install all necessary third-party packages. Additionally, set up aliases..."

Installed Zustand, React Router, Vitest, Zod, and configured the `@` import alias for clean imports.

#### 3. Core Application Build
> "Build a web app called PawFriends where users can: Sign up and log in, Add their pets, Match their pets with others... Use the provided logo for branding."

Primary development prompt that established the full application including:
- User authentication flow
- Pet profile management (CRUD)
- Tinder-style swipe matching interface
- Brand colors extracted from logo

#### 4. Supabase to REST API Migration
> "Replace the current Supabase integration in this repository with a Node.js-based REST API..."

Major architectural change from BaaS to custom backend:
- Express 5 API server
- Knex.js for database queries
- Cloudinary for image storage
- JWT authentication

#### 5. UX State Enhancement
> "Using frontend-design skill, modify loading states, error states and success states in login, signup and matching"

Created distinctive pet-themed feedback animations:
- Walking paw prints for loading states
- Friendly "droopy pup" error messages
- Celebratory success animations

#### 6. Error Handling System
> "Look into issue where upon api failure or error, it does not display any error message"

Implemented toast notification system to surface API errors that were previously silent.

#### 7. Backend Security Hardening
> "Using senior-backend skill, evaluate and modify pawfriends-api to use Sequelize and Helmet"

Upgraded backend with:
- Sequelize ORM (replacing Knex)
- Helmet security headers
- Improved validation patterns

#### 8. CI/CD Pipeline
> "Set up a deployment workflow for this repository using GitHub Actions"

Created GitHub Actions workflows for:
- CI validation on PRs (lint, test, build)
- Automatic deployment to GitHub Pages on merge to main

### Collaboration Insights

**What worked well:**
- Describing features from a user's perspective
- Providing examples of desired behavior
- Referencing existing patterns in the codebase
- Requesting BEM class naming upfront

**Lessons learned:**
- Breaking complex features into smaller, testable pieces
- Establishing code conventions early prevents inconsistency
- Reviewing generated code catches edge cases
- Iterating on UI/UX through conversation is effective
---

Made with love for dogs everywhere
