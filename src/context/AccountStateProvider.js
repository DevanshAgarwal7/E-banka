import { useState } from "react";
import AccountContext from "./AccountContext";

function AccountStateProvider({children}) {
    const[accountInformation, setAccountInformation] = useState(null);
    return (
            <AccountContext.Provider value={{accountInformation, setAccountInformation}}>
                {children}
            </AccountContext.Provider>
     );
}

export default AccountStateProvider;