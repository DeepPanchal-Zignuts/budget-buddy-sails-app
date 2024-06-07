import React, { useState } from 'react';
import AccountList from '../../components/AccountList';
import AccountForm from '../../components/AccountForm';
import Layout from '../../components/Layout/Layout';

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [profitLossPercent, setProfitLossPercent] = useState(0);
  const [accountId, setAccountId] = useState('');
  const [type, setType] = useState('');

  const handleAccountCreated = (newAccount) => {
    setAccounts([...accounts, newAccount]);
  };

  const handleAccountDeleted = (accountId) => {
    setAccounts(accounts.filter((account) => account._id !== accountId));
  };

  const handlePercent = (percent) => {
    setProfitLossPercent(percent);
  };

  const handleAccountId = (id) => {
    setAccountId(id);
  };

  const handleType = (type) => {
    setType(type);
  };
  return (
    <Layout>
      <div className="h-screen pt-20 bg-black flex flex-col lg:flex-row items-start">
        <div className="w-full lg:w-1/3 p-4">
          <AccountForm
            onAccountCreated={handleAccountCreated}
            onPercent={handlePercent}
            onAccountId={handleAccountId}
            onType={handleType}
          />
        </div>
        <div className="w-full lg:w-2/3 p-4">
          <AccountList
            accounts={accounts}
            onAccountDeleted={handleAccountDeleted}
            onAccountCreated={handleAccountCreated}
            profitLossPercent={profitLossPercent}
            accountId={accountId}
            type={type}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
