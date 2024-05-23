import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

// Creating a context
const AccountContext = createContext();

// Creating a context provider
const AccountProvider = ({ children }) => {
  // Initializing the state, accounts as an empty array
  const [accounts, setAccounts] = useState([]);

  // Fetch accounts data
  useEffect(() => {
    const fetchAccounts = async () => {
      const user = await JSON.parse(localStorage.getItem('auth'));
      try {
        if (user?.id) {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/account/get-accounts/${user?.id}`
          );
          console.log('AccountContext-->>', res);
          if (res.data.success) {
            setAccounts(res.data.accounts);
          } else {
            console.error('Failed to fetch accounts:', res.data.message);
          }
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  // Context value containing accounts state and setter function
  const value = { accounts, setAccounts };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

// Custom hook for AccountContext
const useAccount = () => useContext(AccountContext);

export { useAccount, AccountProvider };
