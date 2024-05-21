import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {

    const {auth, setAuth} = useAuth(); 

    const refresh = async () => {
        console.log("useRefreshToken was called")

        try{
            console.log("This is the Auth before refresh" + JSON.stringify(auth))
            const response = await axios.get('/refresh', {withCredentials: true});
            setAuth( (prev) => {
                return {
                    ...prev,
                    userId: response.data.userId,
                    role: response.data.role,
                    accessToken: response.data.accessToken
                }
            })

            return response.data.accessToken;

        } catch (error){
            console.log("There was an error in refresh")
            console.log(error)
        }


        
        console.log("This is the AUTH after refreshTokenL " + JSON.stringify(auth));
        

    }
    return refresh;
};

export default useRefreshToken;
