import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Main = ()=>{
    return(
        <div>
            {/* navbar */}
        <Navbar></Navbar>
            {/* outlet */}
        <Outlet></Outlet>
            {/* footer */}
        <Footer></Footer>
        </div>
    )
}

export default Main;