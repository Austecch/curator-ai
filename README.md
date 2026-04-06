# Curator AI - Social Media Management Platform

A modern, minimalist SaaS web app for AI-powered social media management with Apple-level design quality.

## Tech Stack

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Icons**: Lucide React

## Features

- **Dashboard**: Real-time analytics, reach charts, upcoming posts, connected platforms overview
- **Create Post**: AI-powered content generation with platform-specific variations
- **Content Library**: Manage posts, drafts, and scheduled content
- **Scheduler**: Calendar view with scheduling and best time recommendations
- **Analytics**: Performance tracking across all platforms
- **Platforms**: Connect and manage social media accounts
- **AI Settings**: Customize AI model, tone, and content preferences
- **Notifications**: Stay updated with platform and content notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Fill in your environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. Set up Supabase database using `supabase/schema.sql`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── dashboard/      # Dashboard page
│   ├── create/         # Create post page
│   ├── content/        # Content library
│   ├── scheduler/      # Post scheduler
│   ├── analytics/      # Analytics dashboard
│   ├── platforms/      # Platform management
│   ├── ai-settings/    # AI configuration
│   ├── notifications/  # Notifications
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── api/            # API routes
├── components/
│   ├── layout/         # Sidebar, Header, Shell
│   └── ui/             # Button, Card, Input, etc.
├── lib/
│   ├── supabase.ts     # Supabase client
│   ├── anthropic.ts    # Claude AI integration
│   └── utils.ts        # Utility functions
└── types/
    └── index.ts        # TypeScript types
```

## API Routes

- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts
- `POST /api/anthropic/generate` - Generate content with AI
- `POST /api/anthropic/hashtags` - Generate hashtags
- `GET /api/analytics` - Get analytics data

## Design System

The app follows the "Ethereal Professional" design system with:

- **Colors**: Electric Blue primary (#005cbb), soft off-white backgrounds
- **Glassmorphism**: Blurred sidebars with backdrop filter
- **Typography**: Inter font with tight tracking
- **Components**: Bento grid layouts, pill buttons, rounded cards

## License

MIT
