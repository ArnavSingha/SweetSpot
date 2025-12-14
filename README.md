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

---

## Project Architecture Overview

SweetSpot is built as a *monolithic full-stack application* using the Next.js App Router. This architecture simplifies development and deployment by removing the need for a separate backend server and API layer.

### Core Architectural Concepts

- *App Router*: The file system-based router (app/) is used for all routes. Folders define URL segments, and special files like page.tsx and layout.tsx define the UI for those segments.
- *React Server Components (RSCs)*: By default, all components within the App Router are RSCs. They run exclusively on the server, allowing them to directly and securely access the database or other server-side resources. This is how the main storefront page fetches and renders the list of sweets.
- *Client Components*: Components requiring interactivity (e.g., forms, buttons, state management) are marked with the 'use client' directive. This code runs on both the server (for the initial render) and the client, enabling traditional React interactivity.
- *Server Actions*: Instead of creating API endpoints (/api/...), we use Server Actions for all data mutations (e.g., logging in, creating a sweet, making a purchase). These are functions defined on the server ('use server') that can be called directly from Client Components, typically during form submissions or button clicks. Next.js handles the RPC-like communication automatically.
- *Data Access Layer*: Data fetching logic is co-located within src/lib/data.ts. These server-side functions use the official MongoDB driver (via Mongoose) to interact with the database. Because Server Components and Server Actions run on the server, they can safely call these functions directly.
- *Session Management*: User sessions are managed using JSON Web Tokens (JWTs). Upon successful login, a JWT is generated, signed with a secret key, and stored in a secure, httpOnly cookie. On subsequent requests, the server validates this cookie to identify the authenticated user.

This monolithic approach streamlines the development workflow, reduces boilerplate code, and provides excellent performance by leveraging server-rendering and minimizing client-side JavaScript.

---

## Developer Setup Guide

Follow these instructions to get the project running on your local machine for development and testing.

### 1. Prerequisites

- *Node.js*: LTS version (18.x or 20.x recommended)
- *Package Manager*: npm, yarn, or pnpm
- *MongoDB*: A running instance of MongoDB. You can use a local installation or a free cloud-based service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).

### 2. Installation

1.  *Clone the Repository*:
    bash
    git clone https://github.com/ArnavSingha/SweetSpot.git
    cd sweetspot
    

2.  *Install Dependencies*:
    bash
    npm install
    

3.  *Create an Environment File*:
    Create a .env file in the root of your project by copying the example:
    bash
    cp .env.example .env
    
    Now, open the .env file and fill in the required environment variables (see the section below).

### 3. Running the Application

1.  *Start the Development Server*:
    This command starts the Next.js development server, typically on http://localhost:3000.
    bash
    npm run dev
    

2.  *Running a Production Build*:
    To test a production-ready version of your app locally, run the following commands:
    bash
    # 1. Build the application for production
    npm run build

    # 2. Start the production server
    npm run start
    
---


## Environment Variable Documentation

The .env file is required to run the application. It stores sensitive credentials and configuration details.

| Variable        | Description                                                                                                                              | Example Value                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| MONGODB_URI   | *Required*. The connection string for your MongoDB database. Ensure you include the database name in the URI.                          | mongodb+srv://user:pass@cluster.mongodb.net/sweetspot |
| JWT_SECRET    | *Required*. A long, secret, and random string used to sign and verify JWTs for session management. You can generate one using openssl rand -hex 32. | a_very_long_and_secure_random_string_of_characters   |
| GEMINI_API_KEY | *Required for AI features*. Your API key for the Google AI (Gemini) models, used for generating sweet suggestions.                      | AIzaSy...                                         |

---



## Database Models & Server Actions

### Database Models

The application uses Mongoose to define schemas for three core collections in MongoDB.

1.  *User Model*:
    - name (String): The user's full name.
    - email (String, unique): The user's email address, used for login.
    - passwordHash (String): The user's securely hashed password.
    - role (String): The user's role, either 'user' or 'admin'.

2.  *Sweet Model*:
    - name (String, unique): The name of the sweet product.
    - category (String): The category of the sweet (e.g., "Cake", "Cookie").
    - price (Number): The price of the sweet.
    - quantity (Number): The current stock level.
    - imageUrl (String): A URL pointing to the product image.
    - imageHint (String): A short description for AI image search purposes.

3.  *Purchase Model*:
    - userId (ObjectId): A reference to the User who made the purchase.
    - sweetId (ObjectId): A reference to the Sweet that was purchased.
    - quantity (Number): The number of units purchased.
    - totalPrice (Number): The total price for this line item.
    - purchaseDate (Date): The timestamp of the purchase.

### Server Actions Overview

Server Actions are asynchronous functions that execute on the server and are the primary way the client mutates data.

| Action                  | Description                                            | Inputs              | Auth Required |
| ----------------------- | ------------------------------------------------------ | ------------------- | ------------- |
| register              | Creates a new user account and starts a session.       | FormData          | No            |
| login                 | Authenticates a user and starts a session.             | FormData          | No            |
| logout                | Deletes the user session cookie and logs them out.     | None                | Yes           |
| createSweet           | Adds a new sweet to the inventory.                     | FormData          | Admin         |
| updateSweet           | Modifies the details of an existing sweet.             | sweetId, FormData | Admin         |
| deleteSweet           | Permanently removes a sweet from the inventory.        | sweetId           | Admin         |
| purchaseSweetsAction  | Processes a user's cart, updating stock levels.        | CartItem[]        | User          |
| restockSweetAction    | Increases the quantity of a specific sweet.            | FormData          | Admin         |
| getSuggestedSweets    | Gets AI-powered product recommendations.               | string[] (names)  | No            |

---
