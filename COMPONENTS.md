# Component Documentation

This guide provides detailed information about the reusable components in the ConfigHub dashboard.

## Table of Contents
- [Layout Components](#layout-components)
- [UI Components](#ui-components)
- [Utility Components](#utility-components)

---

## Layout Components

### Layout

**File:** `src/components/Layout.jsx`

Main layout wrapper that provides the application structure with sidebar navigation.

**Usage:**
```jsx
import Layout from './components/Layout';

<Layout>
  <YourPageContent />
</Layout>
```

**Features:**
- Responsive sidebar navigation
- Main content area
- Automatically applied to all protected routes

---

### Sidebar

**File:** `src/components/Sidebar.jsx`

Navigation sidebar with links to main sections of the dashboard.

**Features:**
- Collapsible on mobile (hamburger menu)
- Active link highlighting
- User profile section
- Logout functionality

**Props:** None (uses context for auth state)

**Usage:**
```jsx
import Sidebar from './components/Sidebar';

<Sidebar />
```

---

## UI Components

### Loading

**File:** `src/components/Loading.jsx`

Loading spinner component with optional full-screen overlay.

**Props:**
```typescript
{
  fullScreen?: boolean;  // Default: false
  text?: string;         // Default: 'Loading...'
}
```

**Usage:**
```jsx
import Loading from './components/Loading';

// Inline loading
<Loading />

// Full-screen loading
<Loading fullScreen />

// Custom text
<Loading text="Fetching data..." />
```

---

### EmptyState

**File:** `src/components/EmptyState.jsx`

Component to display when there's no data to show.

**Props:**
```typescript
{
  icon?: LucideIcon;        // Default: FileQuestion
  title: string;            // Required
  description: string;      // Required
  action?: ReactNode;       // Optional action button/element
}
```

**Usage:**
```jsx
import EmptyState from './components/EmptyState';
import { Server } from 'lucide-react';

<EmptyState
  icon={Server}
  title="No services found"
  description="Upload your first configuration to get started"
  action={
    <button className="btn btn-primary">
      Upload Config
    </button>
  }
/>
```

---

### Modal

**File:** `src/components/Modal.jsx`

Reusable modal dialog component.

**Props:**
```typescript
{
  isOpen: boolean;          // Required - controls visibility
  onClose: () => void;      // Required - close handler
  title: string;            // Required - modal title
  children: ReactNode;      // Required - modal content
  size?: 'sm' | 'md' | 'lg' | 'xl';  // Default: 'md'
}
```

**Usage:**
```jsx
import Modal from './components/Modal';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        size="sm"
      >
        <p>Are you sure you want to continue?</p>
        <div className="flex gap-2 mt-4">
          <button className="btn btn-primary">Confirm</button>
          <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
```

**Features:**
- Backdrop click to close
- Escape key to close
- Smooth animations
- Multiple size options
- Prevents body scroll when open

---

## Utility Components

### ProtectedRoute

**File:** `src/components/ProtectedRoute.jsx`

Route wrapper that requires authentication.

**Props:**
```typescript
{
  children: ReactNode;  // Required - protected content
}
```

**Usage:**
```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

**Behavior:**
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Preserves intended destination for redirect after login

---

## Styling Classes

### Button Classes

```css
/* Base button */
.btn

/* Variants */
.btn-primary     /* Primary action button */
.btn-secondary   /* Secondary action button */
.btn-danger      /* Destructive action button */
.btn-success     /* Success/confirmation button */
```

**Usage:**
```jsx
<button className="btn btn-primary">Save</button>
<button className="btn btn-secondary">Cancel</button>
<button className="btn btn-danger">Delete</button>
<button className="btn btn-success">Activate</button>
```

---

### Badge Classes

```css
/* Base badge */
.badge

/* Environment badges */
.badge-dev       /* Development environment */
.badge-test      /* Testing environment */
.badge-prod      /* Production environment */

/* Status badges */
.badge-active    /* Active status */
.badge-inactive  /* Inactive status */
```

**Usage:**
```jsx
<span className="badge badge-prod">PROD</span>
<span className="badge badge-active">Active</span>
```

---

### Card Classes

```css
.card              /* Base card container */
.card-header       /* Card header with title */
.stat-card         /* Dashboard stat card */
```

**Usage:**
```jsx
<div className="card">
  <div className="card-header">
    <span>Title</span>
  </div>
  <p>Content goes here</p>
</div>
```

---

### Form Classes

```css
.input    /* Text input field */
.label    /* Form label */
```

**Usage:**
```jsx
<div>
  <label className="label">Email</label>
  <input type="email" className="input" />
</div>
```

---

### Table Classes

```css
.table-container   /* Wrapper with border and scroll */
.table            /* Table element */
```

**Usage:**
```jsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Animation Classes

```css
.animate-fade-in      /* Fade in animation */
.animate-slide-up     /* Slide up animation */
.animate-slide-down   /* Slide down animation */
.animate-scale-in     /* Scale in animation */

/* Animation delays */
.animate-delay-100
.animate-delay-200
.animate-delay-300
.animate-delay-400
```

**Usage:**
```jsx
<div className="animate-slide-up">
  Content with slide up animation
</div>

<div className="animate-fade-in animate-delay-200">
  Delayed fade in animation
</div>
```

---

## Icons

We use **Lucide React** for icons.

**Common Icons:**
```jsx
import {
  Server,         // Service/server icon
  FileJson,       // Config file icon
  Upload,         // Upload action
  Download,       // Download action
  Eye,            // View action
  Edit,           // Edit action
  Trash2,         // Delete action
  CheckCircle,    // Success/active status
  XCircle,        // Error/inactive status
  AlertTriangle,  // Warning
  Search,         // Search
  Filter,         // Filter
  Settings,       // Settings/config
  LogOut,         // Logout
  ArrowLeft,      // Back navigation
} from 'lucide-react';
```

**Usage:**
```jsx
<Server size={20} className="text-primary-600" />
```

---

## Best Practices

### Component Organization
1. Keep components small and focused
2. Use props for customization
3. Provide default values for optional props
4. Document complex prop types

### Styling
1. Use Tailwind utility classes
2. Create custom classes for repeated patterns
3. Keep CSS classes semantic
4. Use the design system colors

### State Management
1. Use local state when possible
2. Lift state up when needed by multiple components
3. Use Context for global state (auth, theme)
4. Keep state updates immutable

### Performance
1. Memoize expensive computations
2. Use React.memo for pure components
3. Lazy load heavy components
4. Optimize images and assets

---

## Creating New Components

Template for a new component:

```jsx
import { useState } from 'react';

/**
 * Component description
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Prop description
 * @param {Function} props.onAction - Callback description
 */
const MyComponent = ({ title, onAction }) => {
  const [state, setState] = useState(false);

  return (
    <div className="card">
      <h2>{title}</h2>
      <button onClick={onAction} className="btn btn-primary">
        Action
      </button>
    </div>
  );
};

export default MyComponent;
```

---

## Testing Components

Example test structure:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onAction={handleClick} />);
    
    fireEvent.click(screen.getByText('Action'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

## Contributing

When adding new components:
1. Follow the existing structure
2. Add documentation to this file
3. Include usage examples
4. Test on different screen sizes
5. Ensure accessibility (keyboard navigation, ARIA labels)
