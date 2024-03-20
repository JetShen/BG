// components/ProtectedRoute.js
import React from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }:{children:any}) => {
  const router = useRouter();

  React.useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('session-id');
    if (!isLoggedIn) {
      router.push('/login'); // Redirige a la página de inicio de sesión si el usuario no está autenticado
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
