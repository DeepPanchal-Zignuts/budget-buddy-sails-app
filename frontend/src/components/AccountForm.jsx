import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AccountForm = ({ onAccountCreated }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/account/add-account`,
        { name, balance, owner: auth.user.id }
      );
      onAccountCreated(res.data.data);

      if (res.data.success) {
        toast.success(res.data && res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to Create Account!');
    }
  };

  return (
    <>
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-2 text-white text-center">
          Add Account
        </h2>
        <div className="flex flex-col lg:flex-row justify-center items-center">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Account Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2 lg:mr-2 px-4 py-2 bg-slate-500 rounded-md focus:outline-none focus:border-blue-500 text-white"
              required
            />

            <input
              type="number"
              placeholder="Balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="mb-2 bg-slate-500  lg:mr-2 px-4 py-2  rounded-md focus:outline-none focus:border-blue-500 text-white"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
      <hr />
    </>
  );
};

export default AccountForm;
