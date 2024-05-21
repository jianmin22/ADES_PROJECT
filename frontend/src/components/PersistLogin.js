import {Outlet} from "react-router-dom";
import {useState, useEffect} from "react";
import useRefreshToken from "../hooks/useRefresh";
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth, persist} = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                console.log("persistenLogin.js was called")
                await refresh();
            } catch (err) {
                console.log("There was an error")
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }
        
        !auth ?. accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        console.log("PersistLogin was used")
        return() => isMounted = false;
    }, [])
    return (
        <> {
            !persist ? <Outlet/>: isLoading ? <p>Loading...</p> : <Outlet/>
        } </>
    )
}

export default PersistLogin
