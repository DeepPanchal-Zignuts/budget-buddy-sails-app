import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

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

function chooseColor(name) {
  switch (name) {
    case 'travel':
      return { bg: 'bg-blue-600', text: 'text-blue-400' };
    case 'taxes':
      return { bg: 'bg-red-600', text: 'text-red-400' };
    case 'shopping':
      return { bg: 'bg-purple-600', text: 'text-purple-400' };
    case 'education':
      return { bg: 'bg-yellow-600', text: 'text-yellow-400' };
    case 'bills':
      return { bg: 'bg-green-600', text: 'text-green-400' };
    case 'insurance':
      return { bg: 'bg-teal-600', text: 'text-teal-400' };
    case 'housing':
      return { bg: 'bg-gray-600', text: 'text-gray-400' };
    case 'transportation':
      return { bg: 'bg-orange-600', text: 'text-orange-400' };
    case 'food':
      return { bg: 'bg-pink-600', text: 'text-pink-400' };
    case 'entertainment':
      return { bg: 'bg-indigo-600', text: 'text-indigo-400' };
    case 'health':
      return { bg: 'bg-red-600', text: 'text-red-400' };
    case 'personal':
      return { bg: 'bg-green-600', text: 'text-green-400' };
    case 'miscellaneous':
      return { bg: 'bg-teal-600', text: 'text-teal-400' };
    case 'salary':
      return { bg: 'bg-blue-600', text: 'text-blue-400' };
    case 'business':
      return { bg: 'bg-yellow-600', text: 'text-yellow-400' };
    case 'freelance':
      return { bg: 'bg-purple-600', text: 'text-purple-400' };
    case 'investments':
      return { bg: 'bg-orange-700', text: 'text-orange-400' };
    case 'rental':
      return { bg: 'bg-gray-600', text: 'text-gray-400' };
    case 'pension':
      return { bg: 'bg-red-600', text: 'text-red-400' };
    case 'bonuses':
      return { bg: 'bg-pink-600', text: 'text-pink-400' };
    case 'gifts':
      return { bg: 'bg-purple-600', text: 'text-purple-400' };
    case 'other':
      return { bg: 'bg-blue-600', text: 'text-blue-400' };
    default:
      return { bg: 'bg-green-600', text: 'text-green-400' };
  }
}

function chooseTrans(name) {
  switch (name) {
    case 'expense':
      return { bg: 'bg-red-500', text: 'text-red-400' };

    default:
      return { bg: 'bg-green-500', text: 'text-green-400' };
  }
}

const AccountHomePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [weeklySpendingData, setWeeklySpendingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingExpense, setPendingExpense] = useState(0);
  const [pendingIncome, setPendingIncome] = useState(0);
  const [withoutSubject, setWithoutSubject] = useState(0);
  const [withoutDescription, setWithoutDescription] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  const navigate = useNavigate();

  const accountsPerPage = 5;

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = expenses.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  let selectedAccount = JSON.parse(localStorage.getItem('selectedAccount'));

  useEffect(() => {
    const fetchRecentExpenseAndSpendingTrend = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/expense/weekly-trend`,
          {
            accountId: selectedAccount._id || selectedAccount.id,
          }
        );
        if (res?.data?.success) {
          setWeeklySpendingData(res?.data?.data?.graphData);
          setExpenses(res?.data?.data?.expenses);
          setTotalPercentage(res?.data?.data?.percentageUsed);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching total income and expense:', error);
        toast.error('Failed to fetch total income and expense!');
      }
    };

    fetchRecentExpenseAndSpendingTrend();
  }, []);

  useEffect(() => {
    let pendingExpenseCount = 0;
    let pendingIncomeCount = 0;
    let withoutSubjectCount = 0;
    let withoutDescriptionCount = 0;

    expenses.forEach((expense) => {
      if (
        expense.type === 'expense' &&
        expense.isPending === true &&
        expense.isDeleted === false
      ) {
        pendingExpenseCount += 1;
      } else if (
        expense.type === 'income' &&
        expense.isPending === true &&
        expense.isDeleted === false
      ) {
        pendingIncomeCount += 1;
      }
      if (expense.subject === '-' && expense.isDeleted === false) {
        withoutSubjectCount += 1;
      }
      if (expense.details === '-' && expense.isDeleted === false) {
        withoutDescriptionCount += 1;
      }
    });

    setPendingExpense(pendingExpenseCount);
    setPendingIncome(pendingIncomeCount);
    setWithoutSubject(withoutSubjectCount);
    setWithoutDescription(withoutDescriptionCount);
  }, [expenses]);

  return (
    <Layout>
      <div className="h-screen pt-20 flex flex-col lg:flex-row items-center lg:items-start">
        <div className="flex flex-col p-4 justify-center items-center lg:items-start">
          <div className="w-full max-w-lg p-4 bg-zinc-800 border border-zinc-600 rounded-xl">
            <h2 className="text-xl font-medium mb-4 text-white text-center">
              Quick Access
            </h2>
            <div className="flex justify-center">
              <div>
                <button
                  className="flex items-center bg-zinc-700 p-4 m-5 rounded-lg text-white font-thin hover:bg-zinc-600"
                  onClick={() => {
                    navigate('/dashboard');
                  }}
                >
                  <Icon
                    icon="tdesign:money"
                    width={45}
                    height={40}
                    className="bg-green-600 bg-opacity-30 text-green-500 p-2 rounded-full mr-2"
                  />
                  + New Expense
                </button>
              </div>
            </div>
          </div>
          <div className="w-full max-w-lg p-4 bg-zinc-800 border border-zinc-600 rounded-xl mt-10 relative">
            <h2 className="text-xl font-medium mb-4 text-white text-center ">
              Account Details
            </h2>
            <div className="flex justify-center items-center flex-col ">
              <h1 className="flex items-center justify-center text-3xl font-bold italic rounded-full ">
                <Icon
                  icon={chooseIcon(selectedAccount.name)}
                  className={chooseTextColor(selectedAccount.name)}
                  style={{
                    backgroundColor: chooseBgColor(selectedAccount.name),
                    borderRadius: '100px',
                    padding: 7,
                    width: 80,
                    height: 80,
                  }}
                />
              </h1>
              <span className="text-white font-semibold lg:text-2xl">
                {selectedAccount.name}
              </span>
              <p className="flex items-center text-3xl bg-green-400 rounded-full bg-opacity-20 p-2 text-white">
                <Icon icon={chooseCurrency(selectedAccount.currency)} />
                <span className="font-thin ">{selectedAccount.balance}</span>
              </p>
              <p className="flex items-center text-xl text-white">
                Limit - <Icon icon={chooseCurrency(selectedAccount.currency)} />
                <span className="font-thin ">
                  {selectedAccount.weeklyLimit}
                </span>
              </p>
              <p className="absolute -bottom-3 flex items-center justify-center text-xs text-white">
                <span className="flex items-center pr-1 text-lg text-red-500">
                  <Icon icon="heroicons-solid:arrow-up" />
                  {totalPercentage}%
                </span>
                limit reached
              </p>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-[50%] bg-zinc-800 p-5 m-4 rounded-xl border border-zinc-600">
          <h2 className="text-xl font-medium mb-4 text-white text-center">
            Weekly Report
          </h2>
          <Card
            className="bg-gray-900 text-black shadow-lg rounded-lg"
            sx={{
              '& .MuiCardContent-root': {
                backgroundColor: '#18181B',
              },

              margin: 1,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                className="text-center mb-4 text-neutral-400"
              >
                Weekly Spending Trend
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklySpendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: '#FFFFFF' }} />
                  <YAxis tick={{ fill: '#FFFFFF' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expense" fill="#EF4444" />
                  <Bar dataKey="income" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="w-full max-w-lg min-h-80 m-4 ">
          <div className="bg-zinc-800 rounded-xl border border-zinc-600">
            <h2 className="text-center dark:text-white text-xl font-medium mb-4 mt-4">
              Recent Expenses
            </h2>
            {expenses.length > 0 ? (
              <>
                {currentAccounts.map((expenses, index) => (
                  <div
                    key={index}
                    className="flex justify-around m-2 text-sm items-center text-white rounded-lg bg-zinc-700 "
                  >
                    <h1 className="pt-2 font-thin">{expenses.subject}</h1>
                    <h1 className="pt-2 font-thin">
                      {(() => {
                        const { bg, text } = chooseColor(expenses.category);

                        return (
                          <span
                            className={`${bg} ${text} bg-opacity-30 rounded-full p-1 pl-2 pr-2`}
                          >
                            {expenses.category}
                          </span>
                        );
                      })()}
                    </h1>
                    <h1 className="pt-2 font-thin flex items-center">
                      <Icon icon={chooseCurrency(selectedAccount.currency)} />
                      {expenses.amount}
                    </h1>
                    <h1 className="flex p-1 rounded-full mt-2 font-thin">
                      {(() => {
                        const { bg, text } = chooseTrans(expenses.type);

                        return (
                          <span
                            className={`${bg} ${text} bg-opacity-30 rounded-full p-1 pl-2 pr-2`}
                          >
                            {expenses.type}
                          </span>
                        );
                      })()}
                    </h1>
                  </div>
                ))}
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
                    disabled={indexOfLastAccount >= expenses.length}
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
                  className="bg-green-600 bg-opacity-30 rounded-xl text-green-400 mb-2"
                />
                <p className="text-neutral-400 font-thin">
                  No recent expenses!
                </p>
              </div>
            )}
          </div>
          <div className="bg-zinc-800 rounded-xl border border-zinc-600 mt-5">
            <h2 className="text-center dark:text-white text-xl font-medium mb-4 mt-4">
              Pending Tasks
            </h2>

            <div className="flex justify-between m-2 items-center text-white rounded-lg">
              <h1 className="flex items-center text-neutral-400 font-thin">
                <Icon
                  icon="wi:time-4"
                  width={40}
                  className="pr-3 text-purple-500 pl-1"
                />
                Pending Expenses
              </h1>
              <h1 className="pr-2">{pendingExpense}</h1>
            </div>
            <div className="flex justify-between m-2 items-center text-white rounded-lg">
              <h1 className="flex items-center text-neutral-400 font-thin">
                <Icon
                  icon="streamline:watch-circle-time"
                  width={40}
                  className="pr-3 text-purple-500 pl-1"
                />
                Pending Income
              </h1>
              <h1 className="pr-2">{pendingIncome}</h1>
            </div>
            <div className="flex justify-between m-2 items-center text-white rounded-lg">
              <h1 className="flex items-center text-neutral-400 font-thin">
                <Icon
                  icon="fluent:pen-off-20-regular"
                  width={40}
                  className="pr-3 text-purple-500 pl-1"
                />
                Without Subject
              </h1>
              <h1 className="pr-2">{withoutSubject}</h1>
            </div>
            <div className="flex justify-between m-2 items-center text-white rounded-lg">
              <h1 className="flex items-center text-neutral-400 font-thin">
                <Icon
                  icon="fluent:pen-dismiss-16-regular"
                  width={40}
                  className="pr-3 text-purple-500 pl-1"
                />
                Without Description
              </h1>
              <h1 className="pr-2">{withoutDescription}</h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountHomePage;
