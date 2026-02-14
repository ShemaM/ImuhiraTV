# Imuhira TV

<div align="center">
  <img src="public/images/logo.jpg" alt="Imuhira TV Logo" width="120" />
  
  **A Voice for the Voiceless**
  
  A news and media platform dedicated to the Banyamulenge community, providing accurate information, cultural preservation, and conflict documentation.
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

---

## 📖 About

**Imuhira TV** is a multilingual news platform built to amplify the voices of the Banyamulenge people—a Tutsi ethnic group residing in the South Kivu province of the Democratic Republic of Congo. The platform serves as:

- 📰 **News Hub**: Real-time coverage of events affecting the community
- 🎥 **Video Platform**: YouTube-integrated content for visual storytelling
- 📚 **Cultural Archive**: Preserving traditions, language, and heritage
- ⚖️ **Debate Forum**: Balanced presentation of multiple perspectives on key issues
- 🌍 **Multilingual Support**: Available in English, French, Kiswahili, and Kinyamulenge

## ✨ Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Multi-language Support**: i18n integration with next-i18next
- **YouTube Integration**: Embedded videos with hover overlays
- **Comment System**: Threaded discussions with like functionality
- **Admin Dashboard**: Content management for articles and debates
- **Ad System**: Flexible advertisement banners (sidebar/banner types)
- **SEO Optimized**: Server-side rendering with Next.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- PostgreSQL database (optional for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShemaM/ImuhiraTV.git
   cd ImuhiraTV
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your database connection and other settings.

4. **Set up the database**

   For a new database, run the setup script:
   ```bash
   psql -d your_database -f db/setup-schema.sql
   ```

   If upgrading an existing database, run the migration script to add translation columns:
   ```bash
   psql -d your_database -f db/add-translation-columns.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ImuhiraTV/
├── components/
│   ├── common/          # Reusable UI components (ArticleCard, Badge, etc.)
│   ├── layouts/         # Layout components (Header, Footer, Layout)
│   └── modals/          # Modal components (Search, Subscribe)
├── constants/           # Site configuration and constants
├── context/             # React context providers
├── db/                  # Database schema and configuration
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization settings
├── lib/                 # Utility functions
├── pages/
│   ├── [lng]/           # Localized pages
│   ├── admin/           # Admin dashboard
│   └── api/             # API routes
├── public/
│   ├── images/          # Static images
│   └── locales/         # Translation files (en, fr, sw, ki)
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## 🌐 Supported Languages

| Code | Language     |
|------|-------------|
| en   | English     |
| fr   | Français    |
| sw   | Kiswahili   |
| ki   | Kinyamulenge|

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **i18n**: [next-i18next](https://github.com/i18next/next-i18next)
- **Rich Text**: [React Quill](https://github.com/zenoamaro/react-quill)

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run db:push  # Push database schema changes
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 🔒 Security

For security concerns, please see our [Security Policy](SECURITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website**: [imuhira.com](https://imuhira.com)
- **Email**: contact@imuhira.com

---

<div align="center">
  <strong>Built with ❤️ for the Banyamulenge community</strong>
</div>
