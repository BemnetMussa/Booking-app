import { useContext } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from "axios";
import { useState } from "react";


export default function AccountPage() {
    const [redirect, setRedirect] = useState(null)
    const {user, setUser, ready} = useContext(UserContext)
    let {subpage} = useParams();

    function Logout() {
        axios.post('/logout');
        setRedirect('/')
        setUser(null)

    }
    
 
    
    if (subpage === undefined) {
        subpage = 'profile';
    }


    if (!ready) {
        return "Loading ..."
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} /> 
    }

 
    function linkClasses(type=null) {
        let classes = "py-2 px-4 "
        if ( type === subpage ){
            classes += "bg-primary text-white rounded-full"
        }
        return classes;
    }

    return (
    
        <div>
            <nav className="w-full flex justify-center mt-8 mb-8 gap-2">
                <Link className={linkClasses('profile')} to={'/account/profile'}>My profile</Link>
                <Link className={linkClasses('bookings')} to={'/account/bookings'}>My bookings</Link>
                <Link className={linkClasses('places')} to={'/account/places'}>My accommodations</Link>
            </nav>

            {subpage === 'profile' && (
                <div className="text-center  max-w-lg mx-auto">
                    Logged in as {user.name} {user.email} <br/>
                    <button onClick={Logout} className="primary max-w-sm mt-2">Logout</button>

                </div>
            )}
        </div> 
    )
}