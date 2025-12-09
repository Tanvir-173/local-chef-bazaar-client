// src/Pages/Shared/ErrorPage/ErrorPage.jsx
import React from "react";
import { useRouteError, Link } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4"> Oops! Something went wrong.</h1>
      <p className="mb-4">{error?.statusText || error?.message || "Unknown error"}</p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
