import { useContext } from "react"
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from "../provider/AuthProvider";
// eslint-disable-next-line react/prop-types
export default function PrivateRoute({ children }) {

    const { user, loading } = useContext(AuthContext);
    const location = useLocation()
    if (loading) {
        return <div>Loading...</div>
    }
    // if (!user) {
    //     return <Redirect to={{ pathname: '/login', state: { from: location } }} />
    // }
    if(user) return children
  return <Navigate to="/login" state={location.pathname} replace={true} />
  // if (!user) return to login page and redirect to location where it was
  //  Here <Navigate /> is a component because there is no function or button to click on
}
