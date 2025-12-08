# Gallery CRM - Deal Flow Management System

A complete internal CRM and deal-flow tool built with Next.js, TypeScript, Prisma, and Anthropic's Claude AI.

## Features

- **Deal Flow Management**: Track OBJECT_SALE, CLIENT_REQUEST, and CONSIGNMENT workflows
- **Objects (Inventory)**: Manage gallery artworks with pricing, status, and metadata
- **Clients**: Buyer and consigner profiles with interests, budgets, and engagement tracking
- **AI Assistant**: Intelligent chatbot with tool calling to:
  - Match buyers to artworks
  - Search internal and external inventory
  - Create and update deal flows
  - Add structured notes
- **Authentication**: Secure login for gallery admins and specialists
- **Session Management**: Iron-session based auth with role-based access

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: Anthropic Claude (claude-3-5-sonnet)
- **Auth**: iron-session, bcrypt
- **Styling**: Tailwind CSS

## Setup Instructions

### 1. Prerequisites

- Node.js 20+
- PostgreSQL database
- Anthropic API key (get from https://console.anthropic.com/)

### 2. Clone and Install

```bash
cd gallery-proposal-mvp
npm install
```

### 3. Environment Setup

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gallery_crm"
SESSION_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
ANTHROPIC_API_KEY="sk-ant-api03-..."
```

### 4. Database Setup

```bash
# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

**Gallery Admin:**
- Email: `jane@auroracontemporary.com`
- Password: `password123`

**Specialist:**
- Email: `marc@auroracontemporary.com`
- Password: `password123`

## Usage

### Deal Flow (Homepage)

The default page shows all active deal flows:
- **OBJECT_SALE**: Selling artworks to buyers
- **CLIENT_REQUEST**: Finding works for client requests
- **CONSIGNMENT**: Managing secondary market consignments

Ask the AI assistant: *"Who should we show Blue Composition to?"*

### Objects Page

Browse gallery inventory. The AI can:
- Search by artist, price, status
- Match objects to client requests
- Suggest buyers based on collecting patterns

### Clients Page

Manage buyer and consigner relationships. The AI can:
- Search clients by interests and budget
- Track digital engagement
- Manage notes and consignment info

### AI Assistant Features

The chat uses Claude with function calling to:

**Find Buyers:**
```
"Who are the best clients for the Lea Richter piece?"
```

**Match Inventory:**
```
"Marcus wants Latin American urban art under $120k. What do we have?"
```

**Create Deal Flows:**
```
"Create an OBJECT_SALE for Blue Composition targeting Robin Patel"
```

**Search External:**
```
"Find Rafael Ortega works at other galleries"
```

## Project Structure

```
gallery-proposal-mvp/
├── app/
│   ├── (protected)/          # Auth-protected routes
│   │   ├── layout.tsx         # Protected layout with chat + nav
│   │   ├── page.tsx           # Deal Flow homepage
│   │   ├── objects/page.tsx   # Objects inventory
│   │   └── clients/page.tsx   # Clients management
│   ├── api/
│   │   ├── auth/              # Login/logout endpoints
│   │   └── chat/route.ts      # AI chat with tool calling
│   ├── login/page.tsx         # Login page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── Chat.tsx               # AI chat component
│   └── LogoutButton.tsx
├── lib/
│   ├── auth.ts                # Session management
│   ├── db.ts                  # Prisma client
│   ├── tools.ts               # AI tool functions
│   └── llm/systemPrompt.ts    # Claude system prompt
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Demo data seed
└── middleware.ts              # Route protection
```

## System Prompt

The AI assistant uses a comprehensive system prompt defined in `lib/llm/systemPrompt.ts`. It includes:
- Gallery CRM domain knowledge
- Tool calling instructions
- Deal flow workflow guidance
- Type-specific behaviors (OBJECT_SALE, CLIENT_REQUEST, CONSIGNMENT)

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push Prisma schema to database
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## Demo Data

The seed script creates:
- **Gallery**: Aurora Contemporary
- **Users**: Jane (admin), Marc (specialist)
- **Objects**: 4 artworks (Richter, Ortega, Nakamoto, Jensen)
- **Clients**: 4 clients (Robin, Sophia, Marcus, Anna)
- **Deal Flows**: 3 active deals
- **External Inventory**: 2 external items
- **Client Notes**: Sample notes with tags

## Next Steps

1. **Add Detail Views**: Click-through to object/client/deal flow details
2. **Create Forms**: UI to add new objects, clients, deal flows
3. **Image Upload**: Handle actual image uploads for objects and notes
4. **Email Integration**: Send proposals and follow-ups
5. **Reports**: Analytics on deals won/lost, client activity
6. **Mobile**: Responsive design improvements

## License

Private - Internal use only

## Support

For issues or questions, contact the development team.
