# Terraform Composer

A modern web application that simplifies the creation and configuration of Terraform projects without requiring cloud credentials. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Easy Project Creation**: Create and manage Terraform projects through an intuitive web interface
- 🔧 **Pre-built Modules**: Access to common infrastructure components:
  - EC2 Instances
  - VPC Networks
  - S3 Buckets
  - RDS Databases
- 🔐 **Secure**: No cloud credentials required for project creation
- 🎨 **Modern UI**: Built with a beautiful and responsive design
- 🌙 **Dark Mode Support**: Seamless light/dark theme switching

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd terraform-composer
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                # Next.js app directory
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   ├── projects/      # Project management pages
│   └── page.tsx       # Landing page
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── public/           # Static assets
└── styles/           # Global styles
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Terraform](https://www.terraform.io/) 