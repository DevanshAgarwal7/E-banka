import { useState } from "react";
import UserContext from "./UserContext";

function UserStateProvider({children}) {

    const[userInfo, setUserInfo] = useState(null);
    
    return ( 
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
     );
}

export default UserStateProvider;