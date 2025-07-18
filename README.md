# Tax Buddy AI

Tax Buddy AI is a modern, user-friendly web application designed to simplify the process of preparing and filing personal tax returns. Leveraging the power of AI and intuitive UI components, Tax Buddy AI guides users through each step of their tax filing journey, ensuring accuracy, compliance, and ease of use.

## Project Overview

Tax Buddy AI aims to:

- Streamline the collection of personal and financial information required for tax filing.
- Provide a guided, step-by-step experience for users, reducing confusion and errors.
- Allow users to upload and manage tax documents securely.
- Use AI to assist with document analysis, data extraction, and form pre-filling (future scope).
- Generate and preview tax forms (such as the 1040) in PDF format.
- Ensure data privacy and security throughout the process.

## Key Features

- **Personal Information Form:** Collects all necessary taxpayer and spouse details, with smart input formatting (e.g., SSN masking and formatting).
- **Tax Document Upload:** Users can upload W-2s, 1099s, and other relevant tax documents.
- **Step-by-Step Guidance:** The app provides a clear, multi-step process for entering information and uploading documents.
- **AI Integration:** Use of AI to extract data from uploaded documents and assist with tax form completion.
- **PDF Generation:** Preview and download completed tax forms in PDF format.
- **Modern UI/UX:** Built with React, Next.js, and shadcn/ui for a clean, accessible, and responsive interface.

## Technology Stack

- React (with functional components and hooks)
- Next.js (App Router)
- Tailwind CSS
- TypeScript
- shadcn/ui (Component Library)
- Zod (Schema Validation Library)
- React Hook Form (Form State Management Library)
- React PDF (PDF DOM Rendering)
- PDF Parse
- Zod Server Actions
- Vercel AI SDK
- Anthropic API
- Langfuse (AI Observability and Prompt Management)
- Lucide React (for icons)

## Getting Started

### Environment Variables

Inspect the `.env.example` file for required variables. Example:

```bash
ANTHROPIC_API_KEY="sk..."
LANGFUSE_SECRET_KEY="sk..."
LANGFUSE_PUBLIC_KEY="pk..."
LANGFUSE_HOST="https://us.cloud.langfuse.com" # Or wherever your langfuse instance is hosted
NODE_ENV="development"
```

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use Tax Buddy AI.

## Folder Structure

- `components/` – UI and form components (e.g., personal information form, document upload, PDF preview)
- `actions/` – Server actions (e.g., file upload handling)
- `lib/` – Utility and helper functions (e.g., AI integration, tax calculations)
- `constants/` – Shared constants (e.g., state lists)
- `app/` – Next.js app directory (routing, layout, global styles)

## Future Roadmap

- Support for other filing statuses other than single
- Support for additional tax forms and schedules
- User authentication and secure data storage
- Integration with e-filing services
