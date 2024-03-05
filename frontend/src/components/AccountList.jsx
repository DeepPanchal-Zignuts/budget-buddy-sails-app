import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdEdit, MdDelete } from 'react-icons/md';
import { CiBank } from 'react-icons/ci';
import axios from 'axios';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { useAccount } from '../context/AccountContext';
import DeleteModal from './DeleteModal';

const AccountList = ({ onAccountCreated }) => {
  const { accounts, setAccounts } = useAccount();
  const [editAccount, setEditAccount] = useState(null);
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [selectedAccountToDelete, setSelectedAccountToDelete] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const auth = JSON.parse(localStorage.getItem('auth'));
      // Check if auth object exists
      if (auth?.user?.id) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/account/get-accounts/${auth.user.id}`
          );
          if (res.data.success) {
            setAccounts(res.data.accounts);
            setOwner(auth?.user?.name);
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error('Failed to Get Accounts!');
        }
      }
    };

    fetchAccounts();
  }, [setAccounts, onAccountCreated]);

  // Handle delete account click
  const handleDeleteAccountClick = (account) => {
    setSelectedAccountToDelete(account);
  };

  // Handle delete account confirmation
  const handleConfirmDeleteAccount = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/account/delete-account/${selectedAccountToDelete.id}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Remove the deleted account from the local state
        setAccounts(accounts.filter((acc) => acc.id !== selectedAccountToDelete.id));
        // Remove the selected account from local storage if it matches the deleted account
        const selectedAccount = JSON.parse(localStorage.getItem('selectedAccount'));
        if (selectedAccount && selectedAccount.id === selectedAccountToDelete.id) {
          localStorage.removeItem('selectedAccount');
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error:', error.response.data.error);
      toast.error('Failed to Delete Account!');
    } finally {
      // Reset selected account for deletion
      setSelectedAccountToDelete(null);
    }
  };

  // Handle cancel delete account
  const handleCancelDeleteAccount = () => {
    setSelectedAccountToDelete(null);
  };


  const handleEditAccount = (account) => {
    setEditAccount(account);
    setName(account.name);
    setBalance(account.balance);
  };

  const handleCancelAccount = () => {
    setEditAccount(null);
  };

  const handleUpdateAccount = async () => {
    try {
      const updatedAccount = { ...editAccount, name, balance };

      const res = await axios.patch(
        `${process.env.REACT_APP_API}/api/v1/account/update-account/${editAccount.id}`,
        { name: updatedAccount.name, balance: updatedAccount.balance }
      );

      if (res.data.success) {
        toast.success('Account Updated Successfully!');
        // Update the account in the local state
        setAccounts(
          accounts.map((acc) =>
            acc.id === editAccount.id ? updatedAccount : acc
          )
        );
        // Clear the edit state and input fields
        setEditAccount(null);
        setName('');
        setBalance('');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error:', error.response.data.error);
      toast.error('Failed to Update Account!');
    }
  };

  const handleGoIn = (account) => {
    // Set the selected account in local storage
    localStorage.setItem('selectedAccount', JSON.stringify(account));
    // Redirect the user to the expense/income management page
    // Replace '/expense-income-management' with your actual route
    window.location.href = '/dashboard';
  };

  return (
    <>
      <h1 className="text-white text-center text-xl font-semibold mt-5">
        {owner}'s Accounts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-950">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-slate-700 rounded-xl shadow-md p-4 flex flex-col justify-between border"
          >
            <div>
              {editAccount && editAccount.id === account.id ? (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-2 px-4 py-2 border bg-slate-500 border-gray-300 rounded-md focus:outline-none focus:border-black text-white"
                  />
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="mb-2 px-4 py-2 border bg-slate-500 border-gray-300 rounded-md focus:outline-none focus:border-black text-white"
                  />
                </>
              ) : (
                <>
                  <h1 className="flex items-center text-3xl font-semibold text-orange-400 italic">
                    <CiBank />
                    <span className="pl-2">{account.name}</span>
                  </h1>
                  <p className="flex items-center text-2xl text-cyan-200">
                    <MdAccountBalanceWallet />
                    <span className="font-bold pl-2">{account.balance}</span>
                  </p>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-x-2">
                {!editAccount || editAccount.id !== account.id ? (
                  <>
                    <button
                      onClick={() => handleDeleteAccountClick(account)} // Pass account to the click handler
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <MdDelete size={20} />
                    </button>
                    <button
                      onClick={() => handleEditAccount(account)}
                      className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                    >
                      <MdEdit size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleUpdateAccount}
                      className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-700 focus:outline-none"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelAccount}
                      className="bg-slate-500 px-4 py-2 rounded text-white hover:bg-slate-400 focus:outline-neutral-500"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
              <div>
                <button
                  onClick={() => handleGoIn(account)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                >
                  Go in
                </button>
              </div>
            </div>
            <DeleteModal
              visible={selectedAccountToDelete === account} // Pass visibility state
              onOk={handleConfirmDeleteAccount} // Pass confirmation handler
              onCancel={handleCancelDeleteAccount}
              account={account} // Pass cancel handler
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default AccountList;