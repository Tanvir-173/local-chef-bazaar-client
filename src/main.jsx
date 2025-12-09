// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import { RouterProvider } from 'react-router';
// import { router } from './Routes/Router.jsx';
// import AuthProvider from './Context/AuthContext/AuthProvider.jsx';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import LoadingPage from './Pages/Shared/LoadingPage/LoadingPage.jsx';

// const queryClient = new QueryClient();

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <RouterProvider router={router} />
//       </AuthProvider>
//     </QueryClientProvider>
//   </StrictMode>
// );

import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './Routes/Router.jsx';
import AuthProvider from './Context/AuthContext/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingPage from './Pages/Shared/LoadingPage/LoadingPage.jsx';

const queryClient = new QueryClient();

function AppWrapper() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate initialization (auth, etc.)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingPage />;

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

