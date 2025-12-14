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


## UI / UX Overview

The user interface is designed to be clean, modern, and responsive, using a consistent design system built on TailwindCSS and ShadCN UI.

- *Homepage (Storefront)*: Displays all available sweets in a responsive grid. Includes client-rendered search and filter controls that update the URL and trigger a server-side re-render of the product list.
- *Admin Dashboard*: A protected route for admins that shows all inventory in a card-based layout. It provides access to CRUD functionality via dialogs/modals.
- *CRUD Forms*: All forms for creating and editing sweets are rendered inside ShadCN Dialog components. They use react-hook-form for client-side validation and display server-side errors gracefully.
- *Shopping Cart*: A client-side cart implemented in a Sheet component. It uses Zustand for state management and persists the cart contents in local storage.
- *Profile Page: A server-rendered page that displays user information and their complete purchase history. For admins, this page shows a history of *all user purchases.
- *Loading & Feedback*:
  - A full-page loader provides visual feedback during page transitions.
  - Toast notifications are used to inform users of the success or failure of their actions (e.g., "Sweet updated successfully," "Not enough stock").
- *Responsive Design*: The layout adapts smoothly from mobile to desktop screens, with components like the header navigation collapsing into a mobile-friendly menu.

---

## Deployment Guide

This Next.js application is configured for deployment on modern hosting platforms that support Node.js, such as Vercel, Netlify, or AWS Amplify.

### General Steps

1.  *Connect Your Git Repository*: Link your hosting provider to the GitHub repository containing your project.
2.  *Configure Build Settings*:
    - *Build Command*: npm run build
    - *Output Directory*: .next
    - *Node.js Version*: 18.x or 20.x
3.  *Set Environment Variables*: In your hosting provider's dashboard, add the same environment variables defined in your local .env file (MONGODB_URI, JWT_SECRET, GEMINI_API_KEY). This is a critical security step.
4.  *Deploy*: Trigger a deployment. The hosting platform will automatically build and deploy your application.

### Platform-Specific Notes

- *Vercel*: As the creators of Next.js, Vercel offers seamless, zero-config deployment. It will automatically detect the project settings.
- *Server Actions*: Server Actions are designed to work perfectly in serverless environments. The hosting platform will deploy them as isolated serverless functions that are invoked by the client.
- *MongoDB Atlas*: For production, ensure your MongoDB Atlas cluster's network access rules are configured to allow connections from your deployment environment. A common practice is to allow access from all IP addresses (0.0.0.0/0) and rely on a strong database password for security.

---


## Roadmap & Future Improvements

While SweetSpot is a feature-complete application, there are many potential enhancements that could be added:

- *Full Cart System*: Implement a database-backed cart so a user's cart persists across devices.
- *Payment Integration*: Integrate a payment provider like [Stripe](https://stripe.com/) to handle real transactions.
- *Advanced Filtering*: Add more complex filtering options, such as by price range, tags, or popularity.
- *Image Uploads*: Allow admins to upload product images directly instead of pasting URLs, using a service like Cloudinary or Firebase Storage.
- *Admin Analytics*: Create a dashboard with charts and stats showing sales trends, popular items, and revenue.
- *User Reviews & Ratings*: Allow users to rate and review sweets.

---

## My AI Usage

This project was built in collaboration with an AI coding partner. Here’s a breakdown of how AI was leveraged:

*   *AI Tool Used*: Google's Gemini

*   *How it was Used*:
    *   *Initial Scaffolding and Boilerplate*: Generated the initial Next.js project structure, including setting up TailwindCSS, ShadCN UI components, and basic layouts.
    *   *Component Generation*: Created React components (both Server and Client) based on high-level descriptions, such as product cards, forms, and navigation headers.
     *   *Generative AI Features*: Integrated Genkit to create the "Suggested Sweets" feature, which uses the Gemini model to provide product recommendations to users.
      *   *Debugging and Refactoring*: Identified and fixed bugs, such as dependency conflicts in package.json, and refactored code for better organization and performance.
      *   *Documentation*: Generated this README.md file and other explanatory comments in the code to ensure the project is well-documented and easy to understand.