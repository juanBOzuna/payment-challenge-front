# Payment Challenge Storefront

This is the frontend application for the Payment Challenge. It is a Single Page Application (SPA) built with React and TypeScript, designed to provide a smooth, mobile-first shopping experience.

## Technology Stack

*   **React 18**: UI Library.
*   **Vite**: Build tool and bundler.
*   **Redux Toolkit**: State management (Flux Architecture).
*   **Redux Persist**: Robustness strategy to save the user's session (cart and checkout state) in LocalStorage, allowing the process to recover even if the page is refreshed.
*   **CSS Modules**: Component-scoped styling.

## Design & UX Decisions

### Mobile First Approach
The application was designed primarily for mobile devices (iPhone SE reference) and progressively enhanced for desktop screens. We avoided heavy CSS frameworks, opting for custom CSS Grid and Flexbox layouts to ensure pixel-perfect control and performance.

### User Flow
1.  **Product Discovery**: Clean list view with search and category filters.
2.  **Product Detail**: Focused view with stock availability and clear calls to action.
3.  **Checkout Wizard**: A multi-step modal process (Cart -> Delivery -> Payment -> Summary) that guides the user without overwhelming them.
4.  **Resilience**: If the user reloads during the payment step, the application detects the specialized state and attempts to recover the transaction status from the backend.

## Setup and Execution

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The application will launch at `http://localhost:5173`.

## State Management

We use a standard Flux architecture via Redux:

*   **Catalog Slice**: Handles product fetching, filtering (client-side and server-side support), and pagination.
*   **Cart Slice**: Manages the local shopping basket.
*   **Checkout Slice**: Complex state machine that tracks the user's progress through the payment steps, validating input at each stage before allowing progression.

## Testing

The codebase includes comprehensive unit tests for Redux Slices, Hooks, and critical Components.

To run the tests:

```bash
npm run test
```

For a coverage report:

```bash
npm run test:coverage
```