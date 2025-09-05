# Claude Instructions - PAO UI Starter

## Tech Stack Requirements

### Core Technologies

- **LitElement 3.x** - Primary component framework
- **TailwindCSS 3.x** - Utility-first CSS framework
- **TypeScript** - Type safety and development experience
- **Vite** - Build tool and development server

### Component Development

#### LitElement Components

- Use `@customElement` decorator for component registration
- Implement `static styles` with Lit's `css` tagged template
- Use `@property` decorators for reactive properties
- Follow Lit's lifecycle methods (`render()`, `firstUpdated()`, etc.)
- Example component structure:

```typescript
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-component')
export class MyComponent extends LitElement {
  // Use Light DOM for TailwindCSS compatibility
  createRenderRoot() {
    return this;
  }

  @property({ type: String }) name = 'World';

  render() {
    return html`
      <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-xl">
        <h2 class="text-2xl font-bold text-white mb-2">Hello, ${this.name}!</h2>
        <p class="text-indigo-100">Welcome to the app</p>
      </div>
    `;
  }
}
```

#### TailwindCSS Usage

- **Always use Light DOM rendering** for TailwindCSS compatibility:
  ```typescript
  createRenderRoot() {
    return this; // Use Light DOM for TailwindCSS styles
  }
  ```
- Use utility classes directly in templates
- Follow Tailwind's responsive design patterns with `sm:`, `md:`, `lg:` prefixes
- Use consistent color palette: purple/indigo gradients, white containers
- Leverage spacing scale (`p-4`, `m-2`, `space-x-4`)
- Apply hover effects and transitions for interactive elements
- Example Tailwind usage with Light DOM:

```html
<div class="bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 p-5">
  <div class="bg-white p-8 rounded-2xl shadow-2xl">
    <h2 class="text-2xl sm:text-3xl font-bold text-purple-600 mb-4">Title</h2>
    <p class="text-gray-600">Content here</p>
    <button class="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold 
                   rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
      Click me
    </button>
  </div>
</div>
```

### File Structure Conventions

- Components: `src/components/` directory
- Utilities: `src/utils/` directory
- Styles: `src/styles/` directory
- Types: `src/types/` directory (if needed)

### Best Practices

#### Component Design

- Keep components focused and single-responsibility
- Use composition over inheritance
- Implement proper TypeScript types for properties
- Use Lit's built-in reactivity system

#### Styling

- **Always use TailwindCSS utility classes** - never create new CSS classes for styling
- Avoid using Lit's `static styles` for component styling - use Tailwind classes directly in templates
- Follow Tailwind's design system conventions and use the provided utility classes
- Use semantic color palette consistently from Tailwind's color system
- Leverage Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for responsive design
- Use Tailwind's spacing scale (`p-4`, `m-2`, `space-x-4`) instead of custom values
- **Only use custom CSS for**:
  - Complex animations not covered by Tailwind
  - Third-party library overrides when necessary
  - Very specific layout requirements that can't be achieved with utility classes
  - Custom font faces or icon implementations

#### DOM Rendering Strategy

- **Always use Light DOM** (`createRenderRoot() { return this; }`) for TailwindCSS projects
- Light DOM allows global CSS (Tailwind) to apply to components
- Shadow DOM isolates styles and requires CSS imports per component
- For TailwindCSS compatibility, Light DOM is required

#### Performance

- Use Lit's efficient rendering and update system
- Implement proper event handling with `@eventOptions`
- Avoid unnecessary re-renders with property optimization

#### Accessibility

- Use semantic HTML elements
- Implement proper ARIA attributes when needed
- Ensure keyboard navigation support
- Follow WCAG guidelines

### Development Workflow

1. Create component in `src/components/` with Light DOM rendering
2. Import and use in `src/main.ts` if needed
3. **Use Tailwind utility classes exclusively** for all styling
4. Test component functionality
5. Run `npm run lint` and `npm run format` before committing
6. Verify Tailwind classes are working in browser dev tools

### Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Example Patterns

#### Reactive Properties

```typescript
@property({ type: String }) title = '';
@property({ type: Boolean, reflect: true }) active = false;
@property({ type: Number }) count = 0;
```

#### Event Handling

```typescript
private _handleClick() {
  this.dispatchEvent(new CustomEvent('clicked', {
    detail: { value: this.count },
    bubbles: true
  }));
}
```

#### Conditional Rendering

```typescript
render() {
  return html`
    ${this.isLoading
      ? html`<div class="loading">Loading...</div>`
      : html`<div class="content">${this.content}</div>`
    }
  `;
}
```
