import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import { useAccount } from '../context/AccountContext';
import DeleteModal from './DeleteModal';
import { Icon } from '@iconify/react';

function chooseCurrency(name) {
  switch (name) {
    case 'INR':
      return 'la:rupee-sign';
    case 'EUR':
      return 'la:euro-sign';
    case 'USD':
      return 'la:dollar-sign';
    case 'YUAN':
      return 'material-symbols-light:currency-yuan';
    case 'RUB':
      return 'la:ruble-sign';

    default:
      return 'la:rupee-sign';
  }
}

function chooseIcon(name) {
  let firstLetter = name?.charAt(0).toUpperCase();
  switch (firstLetter) {
    case 'I':
      return 'simple-icons:icicibank';
    case 'H':
      return 'simple-icons:hdfcbank';
    case 'S':
      return 'arcticons:yono-sbi';
    case 'K':
      return 'arcticons:kotak-bank';
    case 'B':
      return 'simple-icons:hibob';

    default:
      return 'mdi:bank';
  }
}

function chooseBgColor(name) {
  let firstLetter = name?.charAt(0).toUpperCase();
  switch (firstLetter) {
    case 'I':
      return 'rgba(224, 137, 30, 0.4)'; // Orange with 60% opacity
    case 'H':
      return 'rgba(19, 27, 137, 0.4)'; // Blue with 60% opacity
    case 'S':
      return 'rgba(34, 61, 220, 0.4)'; // Another Blue with 60% opacity
    case 'K':
      return 'rgba(193, 37, 37, 0.4)'; // Red with 60% opacity
    case 'B':
      return 'rgba(174, 81, 23, 0.4)'; // Brown with 60% opacity
    default:
      return 'rgba(29, 147, 16, 0.4)'; //
  }
}

function chooseTextColor(name) {
  let firstLetter = name?.charAt(0).toUpperCase();
  switch (firstLetter) {
    case 'I':
      return 'text-orange-500';
    case 'H':
      return 'text-blue-500';
    case 'S':
      return 'text-blue-500';
    case 'K':
      return 'text-red-400';
    case 'B':
      return 'text-red-500';

    default:
      return 'text-green-400';
  }
}

function chooseTrans(name) {
  switch (name) {
    case 'expense':
      return { icon: 'eva:arrow-ios-downward-fill', text: 'text-red-500' };

    default:
      return { icon: 'eva:arrow-ios-upward-fill', text: 'text-green-500' };
  }
}

const AccountList = ({
  onAccountCreated,
  profitLossPercent,
  accountId,
  type,
}) => {
  const { accounts, setAccounts } = useAccount([]);
  const [editAccount, setEditAccount] = useState(null);
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [selectedAccountToDelete, setSelectedAccountToDelete] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const auth = JSON.parse(localStorage.getItem('auth'));

      if (auth?.data?.id) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/account/get-accounts/${auth.data.id}`
          );
          if (res.data.success) {
            setAccounts(res.data.data[0]);
            setOwner(auth?.data?.fullName);
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

  const handleDeleteAccountClick = (account) => {
    setSelectedAccountToDelete(account);
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/account/delete-account/${selectedAccountToDelete.id}`
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setAccounts(res?.data?.data);
        const selectedAccount = JSON.parse(
          localStorage.getItem('selectedAccount')
        );
        if (
          selectedAccount &&
          selectedAccount._id === selectedAccountToDelete._id
        ) {
          localStorage.removeItem('selectedAccount');
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error:', error.response.data.error);
      toast.error('Failed to Delete Account!');
    } finally {
      setSelectedAccountToDelete(null);
    }
  };

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

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setAccounts(res?.data?.data);
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
    localStorage.setItem('selectedAccount', JSON.stringify(account));
    window.location.href = '/dashboard/home-page';
  };
  return (
    <>
      <h1 className="text-white bg-zinc-800 text-center text-xl font-medium rounded-t-xl border border-zinc-600">
        Accounts
      </h1>

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 p-4 bg-zinc-800 rounded-b-xl border border-zinc-600">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-zinc-900 rounded-2xl shadow-inner p-4 flex flex-row justify-between shadow-zinc-500"
            >
              <div className="relative flex-1 ">
                {editAccount && editAccount.id === account.id ? (
                  <>
                    <h1 className="flex items-center justify-center text-3xl font-bold italic rounded-full w-12 h-12">
                      <Icon
                        icon={chooseIcon(account.name)}
                        className={chooseTextColor(account.name)}
                        style={{
                          backgroundColor: chooseBgColor(account.name),
                          borderRadius: '100px',
                          padding: 7,
                          width: 40,
                          height: 40,
                        }}
                      />
                    </h1>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mb-2 px-2 bg-zinc-950 rounded-md focus:outline-none focus:border-black text-white"
                    />

                    <input
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="mb-4 px-2 w-full bg-zinc-950 rounded-md focus:outline-none focus:border-black text-white text-2xl font-thin"
                    />

                    <div className="flex items-center gap-x-3">
                      <button
                        onClick={handleCancelAccount}
                        className="bg-zinc-800 hover:bg-zinc-600 hover:shadow-blue-300 text-green-300 font-thin px-4 py-2 rounded-xl flex items-center"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateAccount}
                        className="bg-green-500 hover:bg-green-600 text-black font-normal px-4 py-2 rounded-xl flex items-center"
                      >
                        Update
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="relative">
                    <h1 className="flex items-center justify-center text-3xl font-bold italic rounded-full w-12 h-12">
                      <Icon
                        icon={chooseIcon(account.name)}
                        className={chooseTextColor(account.name)}
                        style={{
                          backgroundColor: chooseBgColor(account.name),
                          borderRadius: '100px',
                          padding: 7,
                          width: 40,
                          height: 40,
                        }}
                      />
                    </h1>
                    <span className="pl-2 text-neutral-400">
                      {account.name}
                    </span>
                    <p className="flex items-center text-2xl text-white">
                      <Icon icon={chooseCurrency(account.currency)} />
                      <span className="font-thin ">{account.balance}</span>
                    </p>
                    <div>
                      <button
                        onClick={() => handleGoIn(account)}
                        className="bg-zinc-800 hover:bg-zinc-600 hover:shadow-blue-300 text-white font-thin px-4 py-2 rounded-xl flex items-center"
                      >
                        Go In
                        <Icon
                          icon="heroicons-outline:arrow-right"
                          className="pl-1"
                          width={20}
                        />
                      </button>
                    </div>

                    {accountId === (account._id || account.id) && (
                      <p className="absolute -bottom-5 -right-12 xl:text-xl flex items-center">
                        {(() => {
                          const { icon, text } = chooseTrans(type);

                          return (
                            <span
                              className={` ${text} bg-opacity-30 rounded-full p-1 pl-2 pr-2 flex items-center`}
                            >
                              {profitLossPercent}%
                              <Icon icon={icon} width={30} />
                            </span>
                          );
                        })()}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div className="flex gap-x-2">
                  {!editAccount || editAccount.id !== account.id ? (
                    <>
                      <button
                        onClick={() => handleDeleteAccountClick(account)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <MdDelete size={20} />
                      </button>
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="text-blue-400 hover:text-blue-600 focus:outline-none"
                      >
                        <MdEdit size={20} />
                      </button>
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <DeleteModal
                visible={selectedAccountToDelete === account}
                onOk={handleConfirmDeleteAccount}
                onCancel={handleCancelDeleteAccount}
                account={account}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className=" bg-zinc-800 rounded-b-xl border border-zinc-600 flex flex-col justify-center items-center min-h-96">
            <Icon
              icon="iconoir:no-credit-card"
              className="bg-green-600 bg-opacity-30 text-green-400 rounded-xl mb-2"
              width={100}
            />
            <h1 className="text-neutral-400 text-center font-thin">
              No Accounts Added!
            </h1>
          </div>
        </>
      )}
    </>
  );
};

export default AccountList;
