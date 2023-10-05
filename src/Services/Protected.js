import { Navigate, Outlet  } from "react-router-dom"


// const Protected = ({ children, ...rest }) => {
//     let auth = localStorage.getItem(process.env.KEY) ? true : false;
//     return (
//         <Routes>
//             <Route {...rest} path="*">
//                 <Route
//                     element={(props) => (
//                         auth ? (
//                             children(props)
//                         ) : (
//                             <Navigate to="/login" />
//                         )
//                     )}
//                 />
//             </Route>
//         </Routes>
//     )
// }
export default function Protected() {
    let auth = { token: true};
    return auth.token ? <Outlet /> : <Navigate to="/" />;
  }
// export default Protected