import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const GetUserData = ({ onUserLoaded }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const account = user?.nickname || null;
    
    useEffect(() => {
        onUserLoaded({ user, account, isAuthenticated, isLoading });
    }, [user, account, isAuthenticated, isLoading, onUserLoaded]);

    return null;
};

export default GetUserData;