import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
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
  let firstLetter = name.charAt(0).toUpperCase();
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
  let firstLetter = name.charAt(0).toUpperCase();
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
  let firstLetter = name.charAt(0).toUpperCase();
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
      return { bg: 'bg-red-500', text: 'text-red-500' };

    default:
      return { bg: 'bg-green-500', text: 'text-green-500' };
  }
}

const AccountForm = ({ onAccountCreated, onPercent, onAccountId, onType }) => {
  const [name, setName] = useState('');
  const [weeklyLimit, setWeeklyLimit] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [balance, setBalance] = useState('');
  const [accounts, setAccounts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 5;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName('');
    setWeeklyLimit('');
    setCurrency('INR');
    setBalance('');
    setOpen(false);
  };

  const auth = JSON.parse(localStorage.getItem('auth'));

  useEffect(() => {
    const fetchAccountsLogs = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/account/get-accounts-logs/${
            auth.data.id || auth.data._id
          }`
        );
        if (res.data.success) {
          setAccounts(res?.data?.data?.accountLog);
          onPercent(res?.data?.data?.percent);
          onAccountId(res?.data?.data.accountId);
          onType(res?.data?.data?.type);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to Get Accounts!');
      }
    };

    fetchAccountsLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClose();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/account/add-account`,
        { name, balance, weeklyLimit, currency, ownerId: auth.data.id }
      );

      onAccountCreated(res.data);

      if (res.data.success) {
        toast.success(res.data && res.data.message);
        setAccounts((prevAccounts) => [
          ...prevAccounts,
          { name, balance, type: 'Income' },
        ]);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to Create Account!');
    }
  };

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteLogs = async (account) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/account/delete-log/${
          account.id || account._id
        }`
      );
      if (res.data.success) {
        setAccounts(res?.data?.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      toast.error('Failed to delete log!');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center lg:items-start">
      <div className="w-full max-w-lg p-4 bg-zinc-800 border border-zinc-600 rounded-xl">
        <h2 className="text-xl font-medium mb-4 text-white text-center">
          Create Account
        </h2>
        <div className="flex justify-center">
          <button
            onClick={handleClickOpen}
            className="flex items-center bg-zinc-700 p-4 rounded-lg text-white font-thin hover:bg-zinc-600"
          >
            <Icon
              icon="fa6-solid:money-check"
              width={45}
              height={40}
              className="bg-pink-600 bg-opacity-30 text-pink-500 p-3 rounded-full mr-2"
            />
            + New Account
          </button>
        </div>
      </div>

      <div className="w-full max-w-lg min-h-80 mt-8 rounded-xl bg-zinc-800 border border-zinc-600">
        <h2 className="text-center dark:text-white text-xl font-medium mb-4 mt-4">
          Recent Account Activity
        </h2>
        {accounts.length > 0 ? (
          <>
            {currentAccounts.map((account, index) =>
              account.isDeleted === false ? (
                <div
                  key={index}
                  className="flex justify-around m-2 items-center text-white rounded-lg bg-zinc-700 "
                >
                  <Icon
                    icon={chooseIcon(account.name)}
                    className={chooseTextColor(account.name)}
                    style={{
                      backgroundColor: chooseBgColor(account.name),
                      borderRadius: '100px',
                      padding: 4,
                      width: 30,
                      height: 30,
                    }}
                  />
                  <h1 className="pt-2 font-thin">{account.name}</h1>
                  <h1 className="pt-2 font-thin flex items-center">
                    <Icon icon={chooseCurrency(account.currency)} />
                    {account.amount}
                  </h1>
                  <h1 className="flex mt-2 font-thin">
                    {(() => {
                      const { bg, text } = chooseTrans(account.type);

                      return (
                        <span
                          className={`${bg} ${text} bg-opacity-30 rounded-full p-1 pl-2 pr-2`}
                        >
                          {account.type}
                        </span>
                      );
                    })()}
                  </h1>
                  <button onClick={() => handleDeleteLogs(account)}>
                    <Icon
                      icon="material-symbols-light:delete-outline"
                      className="text-red-400 hover:text-red-500"
                      width={25}
                    />
                  </button>
                </div>
              ) : (
                <></>
              )
            )}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-white rounded-md hover:text-zinc-300 cursor-pointer mx-1"
              >
                <Icon icon="fluent-mdl2:page-left" width={30} />
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastAccount >= accounts.length}
                className="text-white rounded-md hover:text-zinc-300 cursor-pointer mx-1"
              >
                <Icon icon="fluent-mdl2:page-right" width={30} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Icon
              icon="pepicons-pencil:menu-off"
              width={100}
              className="bg-green-600 bg-opacity-30 rounded-xl text-green-400 mt-10 mb-2"
            />
            <p className="text-neutral-400 font-thin">No activity yet!</p>
          </div>
        )}
      </div>

      {/* Tailwind Modal */}
      {open && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center ">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-35"></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full max-h-screen overflow-y-auto ">
              <div className="bg-white dark:bg-zinc-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                      id="modal-title"
                    >
                      Add New Account
                    </h3>
                    <div className="mt-2">
                      <p
                        className="text-sm text-gray-500"
                        id="modal-description"
                      >
                        Name the Account, add the balance, set a weekly
                        limit,and select the currency
                      </p>

                      <div className="mt-3 sm:mt-4">
                        <label
                          htmlFor="AccountName"
                          className="block text-white font-thin"
                        >
                          Account Name*
                        </label>
                        <input
                          type="text"
                          id="accountName"
                          className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Indian Bank"
                          autoFocus
                          required
                        />
                        <label
                          htmlFor="AccountBalance"
                          className="block text-white font-thin pt-2"
                        >
                          Account Balance*
                        </label>
                        <input
                          type="number"
                          id="accountBalance"
                          className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                          value={balance}
                          onChange={(e) => setBalance(e.target.value)}
                          placeholder="5001"
                          min="0"
                          max="5000000"
                          autoFocus
                          required
                        />
                        <label
                          htmlFor="weeklyLimit"
                          className="block text-white font-thin pt-2"
                        >
                          Weekly Limit*
                        </label>
                        <input
                          type="number"
                          id="weeklyLimit"
                          className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                          value={weeklyLimit}
                          onChange={(e) => setWeeklyLimit(e.target.value)}
                          placeholder="7000"
                          min="0"
                          max="5000000"
                          autoFocus
                          required
                        />
                        <label
                          htmlFor="currency"
                          className="block text-white font-thin pt-2"
                        >
                          Currency
                        </label>
                        <select
                          name="currency"
                          id="currency"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                        >
                          <option value="INR">INR</option>
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="YUAN">YUAN</option>
                          <option value="RUB">RUB</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 sm:px-6 flex justify-end">
                <button
                  onClick={handleClose}
                  className="bg-zinc-700 bg-opacity-40 text-green-300 hover:bg-zinc-500 hover:bg-opacity-30 border-none p-2 rounded-xl mt-3 sm:mt-0 mr-3 mb-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-black border-none p-2 rounded-xl mt-3 sm:mt-0 flex items-center justify-center mb-3"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountForm;
