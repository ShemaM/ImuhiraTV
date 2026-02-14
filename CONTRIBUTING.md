# Contributing to Imuhira TV

First off, thank you for considering contributing to Imuhira TV! 🎉

This platform serves an important purpose for the Banyamulenge community, and your contributions help amplify their voices.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to contact@imuhira.com.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When suggesting:

- Use a **clear and descriptive title**
- Provide a **detailed description** of the suggested enhancement
- Explain **why this enhancement would be useful**
- Include **mockups or examples** if possible

### 🌍 Translations

We welcome translations! Our platform supports:
- English (en)
- French (fr)
- Kiswahili (sw)
- Kinyamulenge (ki)

Translation files are located in `public/locales/[language]/`.

### 📝 Documentation

Help improve our documentation by:
- Fixing typos and grammar
- Clarifying confusing sections
- Adding examples and tutorials
- Updating outdated information

### 💻 Code Contributions

We welcome code contributions for:
- Bug fixes
- New features
- Performance improvements
- Accessibility enhancements

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/ImuhiraTV.git
   cd ImuhiraTV
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ShemaM/ImuhiraTV.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Project Structure

```
components/     # React components
├── common/     # Reusable components
├── layouts/    # Layout components
└── modals/     # Modal components

pages/          # Next.js pages
├── [lng]/      # Localized routes
├── admin/      # Admin dashboard
└── api/        # API routes

public/locales/ # Translation files
```

### Testing Your Changes

1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Test responsive design at different breakpoints
3. Test with different language settings
4. Verify accessibility with keyboard navigation

## Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define interfaces for props and data structures
- Avoid `any` types when possible
- Use meaningful variable and function names

### React/Next.js

- Use functional components with hooks
- Keep components focused and single-purpose
- Use the `useTranslation` hook for all user-facing text
- Follow Next.js conventions for file-based routing

### Tailwind CSS

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use semantic color names from the theme
- Group related classes logically

### Code Example

```tsx
// Good example
interface ArticleCardProps {
  article: {
    title: string;
    slug: string;
    excerpt: string;
  };
  lng: string;
}

export default function ArticleCard({ article, lng }: ArticleCardProps) {
  const { t } = useTranslation('common');
  
  return (
    <div className="group flex flex-col h-full">
      <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-700">
        {article.title}
      </h3>
    </div>
  );
}
```

### Commit Messages

Follow conventional commits:

```
feat: add YouTube hover overlay to ArticleCard
fix: resolve comment form submission issue
docs: update README with project structure
style: format code with prettier
refactor: extract AdBanner component
```

## Submitting Changes

### Pull Request Process

1. **Update your branch** with latest upstream changes
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub

4. **Fill out the PR template** with:
   - Description of changes
   - Related issue numbers
   - Screenshots (for UI changes)
   - Testing performed

5. **Wait for review** and address feedback

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] No new warnings or errors
- [ ] Changes tested locally
- [ ] All translations added (if applicable)

## 🙏 Recognition

Contributors will be recognized in our README and release notes. Thank you for making Imuhira TV better!

---

Questions? Reach out to us at contact@imuhira.com or open a discussion on GitHub.
