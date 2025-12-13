# **App Name**: SweetSpot

## Core Features:

- User Authentication: Secure user registration and login with JWT and bcrypt.
- Sweet Inventory Management: CRUD operations for sweets, including name, category, price, quantity, and image URL.
- Real-time Stock Updates: Display real-time stock levels and prevent purchases when out of stock, with atomic decrement via findOneAndUpdate.
- Admin Role Management: Restrict access to sensitive endpoints (e.g., adding, editing, deleting sweets, restock) based on user roles.
- Frontend Dashboard: A responsive dashboard displaying sweets in a grid format with search and filtering capabilities.
- Purchase History: Stores each purchase event with userId, sweetId and quantity.
- Sweet Suggestion: Suggest related sweets to users based on current cart or search history. This feature will use an AI tool to analyze current inventory and customer preferences to generate these related product suggestions.

## Style Guidelines:

- Primary color: Soft pastel purple (#A29BFE) to evoke a sense of sweetness and creativity.
- Background color: Very light gray (#F0F4F8), almost white, providing a clean and modern backdrop.
- Accent color: Muted pink (#FF7679), an analogous color that stands out without being too overwhelming.
- Body and headline font: 'PT Sans', a humanist sans-serif, combines modernity with a touch of warmth.
- Code font: 'Source Code Pro' for any displayed code snippets or technical info.
- Use minimalist line icons for categories and actions, ensuring clarity and simplicity.
- Responsive grid layout with clean spacing, adapting from 1-2 columns on mobile to 3-5 columns on desktop.
- Subtle hover effects and transitions to provide smooth user feedback.