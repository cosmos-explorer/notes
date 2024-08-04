import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import Layout from './layout';
import { FC } from "react";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: FC<PrivateRouteProps> = ({element}) => {
  const {isAuthenticated} = useAuth();

  return isAuthenticated ? (
    <Layout>
      { element }
    </Layout>
  ) : (
    <Navigate to="/signin"/>
  );
};

export default PrivateRoute;
