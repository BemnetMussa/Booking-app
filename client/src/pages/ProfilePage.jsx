import { useContext } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from "axios";
import { useState } from "react";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";


export default function ProfilePage() {
    const [redirect, setRedirect] = useState(null)
    const {user, setUser, ready} = useContext(UserContext)
    let {subpage} = useParams();
    {console.log(subpage)}

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

 
    return (<>
       
        <AccountNav />
        <div>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} {user.email} <br/>
                    <button onClick={Logout} className="primary max-w-sm mt-2">Logout</button>

                </div>
            )}

            {subpage === 'places' && (
                <PlacesPage />
            ) }
        </div> 
    </>
    )
}