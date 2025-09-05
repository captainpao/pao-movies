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
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-component')
export class MyComponent extends LitElement {
  static styles = css`
    :host { display: block; }
  `;

  @property({ type: String }) name = 'World';

  render() {
    return html`
      <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold">Hello, ${this.name}!</h2>
      </div>
    `;
  }
}
```

#### TailwindCSS Usage
- Use utility classes directly in templates
- Follow Tailwind's responsive design patterns
- Use semantic color classes (e.g., `text-slate-600`, `bg-indigo-500`)
- Leverage spacing scale (`p-4`, `m-2`, `space-x-4`)
- Example Tailwind usage:

```html
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
  <h2 class="text-2xl font-bold text-gray-800 mb-4">Title</h2>
  <p class="text-gray-600">Content here</p>
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
- Prefer Tailwind utility classes over custom CSS
- Use component-scoped styles with Lit's `static styles`
- Follow Tailwind's design system conventions
- Use semantic color palette consistently

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
1. Create component in `src/components/`
2. Import and use in `src/main.ts` if needed
3. Use Tailwind classes for styling
4. Test component functionality
5. Run `npm run lint` and `npm run format` before committing

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