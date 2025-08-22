import { useState, useEffect } from "react";

export default function PrivateRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser.user);
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    return children;
}
