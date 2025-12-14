# SweetSpot: Full-Stack E-Commerce & Inventory Management

SweetSpot is a modern, full-stack e-commerce application built with Next.js and the App Router. It serves as a production-quality demonstration of building a feature-rich web application—including user authentication, an admin dashboard, and real-time inventory control—using a simplified, monolithic architecture without a separate backend API.

The application functions as a digital storefront for a sweet shop, allowing customers to browse products, while providing administrators with the tools to manage inventory and view sales data.

*

## Live Demo

*[➡️ View Live Demo](https://your-live-demo-url-here.com)*

(Note: Admin credentials are: admin123@gmail.com / Admin@123)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Project Architecture Overview](#project-architecture-overview)
- [Developer Setup Guide](#developer-setup-guide)
- [Environment Variable Documentation](#environment-variable-documentation)
- [Database Models & Server Actions](#database-models--server-actions)
- [UI / UX Overview](#ui--ux-overview)
- [Deployment Guide](#deployment-guide)
- [Roadmap & Future Improvements](#roadmap--future-improvements)
- [My AI Usage](#my-ai-usage)


## Features

- *Full User Authentication*: Secure, session-based authentication using JWTs stored in HTTP-only cookies. Includes registration and login workflows with password hashing.
- *Role-Based Access Control*: Differentiates between 'user' and 'admin' roles, restricting access to sensitive areas and actions.
- *Comprehensive Admin Dashboard*: A dedicated interface for administrators to perform CRUD (Create, Read,Update, Delete) operations on sweets, manage stock levels, and view all user purchase history.
- *Dynamic Public Storefront*: A responsive, server-rendered storefront where users can browse, search, and filter sweets.
- *Real-Time Inventory Management*: Purchases atomically update sweet quantities in the database to prevent overselling. Admins can easily restock items through the dashboard.
- *AI-Powered Suggestions*: Utilizes Genkit and Google's Gemini model to provide users with intelligent sweet recommendations based on their cart contents.
- *User Profile & Purchase History*: Registered users can view their past orders in a dedicated profile section.
- *Modern UI/UX*: Built with TailwindCSS and ShadCN UI for a beautiful, responsive, and accessible user experience. Includes a theme switcher (light/dark/system) and animated, interactive elements.
- *Form Handling with Validation*: Robust form validation on both the client and server using Zod for data integrity.


## Tech Stack

- *Framework*: [Next.js 14](https://nextjs.org/) (with App Router)
- *Language*: [TypeScript](https://www.typescriptlang.org/)
- *UI*: [React](https://react.dev/) (Server & Client Components)
- *Styling*: [Tailwind CSS](https://tailwindcss.com/)
- *UI Components*: [ShadCN UI](https://ui.shadcn.com/)
- *Database*: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- *State Management*: [Zustand](https://github.com/pmndrs/zustand) (for client-side cart)
- *Form Handling*: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- *Authentication*: JWTs & Server Actions
- *Generative AI*: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models



## Screenshots

| Homepage Storefront                                                                                     | Admin Dashboard                                                                                       |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ![SweetSpot Homepage](images/indexpageorafter%20login.jpeg) | ![SweetSpot Admin](images/admin_dashbord.jpeg)       |
| *Shopping Cart with AI Suggestions*                                                                      | *User Profile Page*                                                                                 |
| ![SweetSpot Cart](images/card.jpeg)         | ![SweetSpot Profile](images/buyhistoryuser.jpeg)     |

---


