# Local Chef Bazaar

## Project Purpose
Local Chef Bazaar is a web application that connects users with local chefs, allowing them to order fresh, homemade meals directly to their doorstep. The platform supports multiple roles, including users, chefs, and admins, each with unique functionalities.

## Live URL
[https://local-chef-bazaar-9fed2.web.app/] 

*(replace with your actual Firebase hosting URL)*

## Key Features
- **User Role**:
  - Browse meals and place orders
  - View order history and favorite meals
  - Submit reviews
- **Chef Role**:
  - Create, update, and manage meals
  - View incoming order requests
  - Manage their profile
- **Admin Role**:
  - Manage users and requests
  - View platform statistics
- **Authentication**:
  - Email/password login
  - Google social login
- **Responsive Design**:
  - Fully functional on mobile and desktop
- **Backend Integration**:
  - Data stored in MongoDB
  - Secure API requests using Axios and JWT
- **Image Upload**:
  - Meal and profile images via imgbb API

## Tech Stack / NPM Packages Used
- **Frontend**:
  - React.js, React Router, React Hook Form
  - Tailwind CSS, Framer Motion
  - React Hot Toast, React Icons
- **Backend**:
  - Node.js, Express.js
  - MongoDB, Mongoose
- **Authentication**:
  - Firebase Authentication
- **HTTP Requests**:
  - Axios, useAxiosSecure (custom hook)
- **State & Data Fetching**:
  - React Query (`@tanstack/react-query`)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Tanvir-173/local-chef-bazaar-client.git
