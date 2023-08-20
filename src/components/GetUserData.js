import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserDataComponent = ({ onUserLoaded }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const account = user?.nickname || null;
    useEffect(() => {
        onUserLoaded({user, account, isAuthenticated, isLoading}); // Call the prop function to pass the user data to App
    }, [user, account, isAuthenticated, isLoading, onUserLoaded]);

    // You can return JSX here if needed, or just leave it empty
    return null;
};

export default UserDataComponent;