import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Icon } from '@iconify/react';
import Layout from '../../components/Layout/Layout';
import { MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import { MdClose } from 'react-icons/md';

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

function chooseTrans(name) {
  switch (name) {
    case 'expense':
      return { bg: 'bg-red-500', text: 'text-red-400' };

    default:
      return { bg: 'bg-green-500', text: 'text-green-400' };
  }
}

function chooesIcon(name) {
  switch (name) {
    case 'travel':
      return 'material-symbols:travel';

    case 'taxes':
      return 'tabler:receipt-tax';

    case 'shopping':
      return 'la:shopping-bag';
    case 'education':
      return 'mdi:education-outline';
    case 'bills':
      return 'mingcute:bill-2-line';
    case 'insurance':
      return 'streamline:insurance-hand';
    case 'housing':
      return 'material-symbols:house';
    case 'transportation':
      return 'mdi:transportation';
    case 'food':
      return 'mdi:food';
    case 'entertainment':
      return 'icon-park-outline:entertainment';
    case 'health':
      return 'fluent-mdl2:health';
    case 'personal':
      return 'grommet-icons:personal-computer';
    case 'miscellaneous':
      return 'mdi:education-outline';
    case 'salary':
      return 'humbleicons:money';
    case 'business':
      return 'foundation:torso-business';
    case 'freelance':
      return 'simple-icons:freelancer';
    case 'investments':
      return 'streamline:investment-selection';
    case 'rental':
      return 'material-symbols:car-rental';
    case 'pension':
      return 'solar:hand-money-linear';
    case 'bonuses':
      return 'fluent:money-hand-20-regular';
    case 'gifts':
      return 'material-symbols:featured-seasonal-and-gifts-rounded';
    case 'other':
      return 'material-symbols:other-houses-outline';
    default:
      return 'ic:baseline-miscellaneous-services';
  }
}

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [frequency, setFrequency] = useState('DESC');
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [account, setAccount] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleClickOpen = (expense) => {
    setSelectedExpense(expense);
    setOpen(true);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelect = (value) => {
    setType(value);
    setDropdownVisible(false);
  };

  const accountData = JSON.parse(localStorage.getItem('selectedAccount'));
  useEffect(() => {
    const fetchAccount = () => {
      try {
        const accountData = JSON.parse(localStorage.getItem('selectedAccount'));
        if (accountData) {
          setAccount(accountData);
        }
      } catch (error) {
        console.error('Error fetching Accounts:', error);
      }
    };

    fetchAccount();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const selectedAccount = JSON.parse(
          localStorage.getItem('selectedAccount')
        );

        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/expense/get-expense`,
          {
            accountId: selectedAccount._id || selectedAccount.id,
            frequency,
            type,
            page: currentPage,
          }
        );
        setExpenses(res.data.data);
        setTotalPages(res.data.totalPages);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        toast.error('No Expense Found');
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, [frequency, selectedDate, type, currentPage]);

  useEffect(() => {
    const fetchTotalIncomeAndExpense = async () => {
      try {
        const selectedAccount = JSON.parse(
          localStorage.getItem('selectedAccount')
        );
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/expense/amountAnalytics`,
          {
            accountId: selectedAccount._id || selectedAccount.id,
          }
        );
        if (res?.data?.success) {
          setTotalIncome(res?.data?.data?.totalIncome);
          setTotalExpense(res?.data?.data?.totalExpense);
          setTotalPercentage(res?.data?.data?.percentageUsed);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching total income and expense:', error);
        toast.error('Failed to fetch total income and expense!');
      }
    };

    fetchTotalIncomeAndExpense();
  }, [expenses]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page number
  };

  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const editExpense = (expense) => {
    setEdit(expense);
    setIsModalOpen(true);
  };

  const deleteExpense = async (expense) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/expense/delete-expense/${
          expense._id || expense.id
        }`
      );

      // Update expenses state by removing the deleted expense
      setExpenses(expenses.filter((item) => item.id !== expense.id));

      // Update account state with the new balance
      setAccount({ ...account, balance: res.data.afterUpdateAccount.balance });

      // Update local storage with the updated account data
      localStorage.setItem(
        'selectedAccount',
        JSON.stringify({
          ...account,
          balance: res.data.afterUpdateAccount.balance,
        })
      );

      if (res.data && res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense!');
    }
  };

  return (
    <Layout>
      <div className="h-screen pt-20 p-4 flex flex-col">
        <div className=" flex justify-end items-center">
          <div className=" p-2 flex justify-end">
            <button
              className="w-full p-2 bg-green-400 hover:bg-green-500 text-black rounded-lg font-semibold"
              onClick={openModal}
              disabled={totalPercentage === 100}
            >
              + New expense
            </button>
            <div className="pl-2 flex items-center">
              <button
                onClick={(e) => setFrequency(e.target.value ? 'DESC' : 'ASC')}
              >
                <Icon
                  icon="fa:filter"
                  className="text-green-500 border border-green-400 bg-opacity-30 p-2 w-7 h-7 rounded-lg"
                />
              </button>
            </div>
            <div className="pl-2 flex items-center">
              <button onClick={toggleDropdown}>
                <Icon
                  icon="carbon:skill-level"
                  className="text-green-500 border border-green-400 bg-opacity-30 p-1 w-7 h-7 rounded-lg"
                />
              </button>
            </div>
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => handleSelect('expense')}
                  >
                    Expense
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => handleSelect('income')}
                  >
                    Income
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 bg-zinc-800 rounded-xl border border-zinc-600">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
            <div className="bg-black flex flex-col justify-center items-center rounded-xl p-4 text-center dark:text-white relative">
              <Icon
                icon="solar:graph-broken"
                className="bg-yellow-600 text-yellow-300 bg-opacity-30 p-3 w-16 h-16 rounded-full"
              />

              <h1 className="text-5xl font-thin text-white flex items-center justify-center pt-3">
                <Icon icon={chooseCurrency(accountData.currency)} />
                {accountData.weeklyLimit}
              </h1>

              <h1 className="text-xl font-thin text-neutral-400 flex flex-col">
                <span>Weekly Limit</span>
              </h1>

              <span className="absolute bottom-2 right-4 text-md font-extralight flex items-center">
                <span className="text-red-500 font-normal pr-1 flex items-center">
                  <Icon icon="heroicons-solid:arrow-up" />
                  {totalPercentage}%
                </span>
                reached
              </span>
            </div>

            <div className="bg-black flex flex-col justify-center items-center rounded-xl p-4 text-center dark:text-white">
              <Icon
                icon="tabler:pig-money"
                className="bg-green-700 text-green-500 bg-opacity-30 p-3 w-16 h-16 rounded-full"
              />

              <h1 className="text-5xl font-thin text-white flex items-center justify-center pt-3">
                <Icon icon={chooseCurrency(accountData.currency)} />
                {totalIncome}
              </h1>
              <h1 className="text-xl font-thin text-neutral-400">Income</h1>
            </div>

            <div className="bg-black flex flex-col justify-center items-center rounded-xl p-4 text-center dark:text-white">
              <Icon
                icon={chooseCurrency(accountData.currency)}
                className="bg-blue-600 text-blue-300 bg-opacity-30 p-3 w-16 h-16 rounded-full"
              />

              <h1 className="text-5xl font-thin text-white flex items-center justify-center pt-3">
                <Icon icon={chooseCurrency(accountData.currency)} />
                {account.balance}
              </h1>
              <h1 className="text-xl font-thin text-neutral-400">Balance</h1>
            </div>

            <div className="bg-black flex flex-col justify-center items-center rounded-xl p-4 text-center dark:text-white">
              <Icon
                icon="hugeicons:wallet-03"
                className="bg-red-400 text-red-500 bg-opacity-30 p-3 w-16 h-16 rounded-full"
              />

              <h1 className="text-5xl font-thin text-white flex items-center justify-center pt-3">
                <Icon icon={chooseCurrency(accountData.currency)} />
                {totalExpense}
              </h1>
              <h1 className="text-xl font-thin text-neutral-400">Expense</h1>
            </div>
          </div>
          {expenses.length > 0 ? (
            <div className="overflow-x-auto flex-1 bg-zinc-900 rounded-xl m-4 ">
              <table className="w-full bg-zinc-900 ">
                <thead>
                  <tr className="">
                    <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-neutral-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-neutral-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-neutral-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-neutral-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-neutral-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="text-white even:bg-zinc-900  odd:bg-zinc-800 font-thin"
                    >
                      <td className="px-6 py-4 whitespace-no-wrap flex items-center ">
                        <Icon
                          icon={chooesIcon(expense.category)}
                          className="mr-3 p-1 bg-green-600 bg-opacity-30 text-green-400 rounded-full"
                          width={30}
                        />
                        {expense.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap">
                        <div className="flex items-center">
                          <Icon icon={chooseCurrency(expense.currency)} />
                          {expense.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap">
                        {(() => {
                          const { bg, text } = chooseTrans(expense.type);

                          return (
                            <span
                              className={`${bg} ${text} bg-opacity-30 rounded-full p-1 pl-2 pr-2`}
                            >
                              {expense.type}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap">
                        {(() => {
                          const statusColor =
                            expense.isPending === false
                              ? 'bg-purple-600'
                              : 'bg-pink-700';

                          const status =
                            expense.isPending === false
                              ? 'Submitted'
                              : 'Pending';

                          return (
                            <span
                              className={`${statusColor} bg-opacity-50 rounded-full p-1 text-neutral-300 pl-2 pr-2`}
                            >
                              {status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="flex justify-evenly items-center  py-4 whitespace-no-wrap">
                        <button
                          onClick={() => handleClickOpen(expense)}
                          className="hover:text-blue-300 hover text-blue-500"
                        >
                          <Icon icon="el:eye-open" width={20} />
                        </button>
                        <button
                          onClick={() => editExpense(expense)}
                          className="hover:text-yellow-300 hover text-yellow-500"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => deleteExpense(expense)}
                          className="text-red-500 hover:text-red-300"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {open && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full max-h-screen overflow-y-auto ">
                    <div className="bg-white dark:bg-zinc-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="flex justify-end">
                        <button
                          className="focus:outline-none"
                          onClick={closeModal}
                          aria-label="Close"
                        >
                          <MdClose className="w-6 h-6 text-zinc-400 hover:text-gray-500" />
                        </button>
                      </div>
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3
                            className="text-lg leading-6 font-semibold text-gray-900 dark:text-white"
                            id="modal-title"
                          >
                            Expense Details
                          </h3>
                          <div className="mt-2">
                            <p
                              className="text-md text-neutral-400 flex items-center"
                              id="modal-description"
                            >
                              Subject:
                              <span className="text-white font-normal flex items-center ml-2">
                                <Icon
                                  icon={chooesIcon(selectedExpense?.category)}
                                  className="mr-1 p-1 bg-green-600 bg-opacity-30 text-green-400 rounded-full"
                                  width={30}
                                />
                                {selectedExpense?.subject}
                              </span>
                            </p>
                            <p
                              className="text-md text-neutral-400 flex items-center"
                              id="modal-description"
                            >
                              Amount:{' '}
                              <span className="text-white font-normal flex items-center ml-2">
                                <Icon
                                  icon={chooseCurrency(
                                    selectedExpense?.currency
                                  )}
                                />
                                {selectedExpense?.amount}
                              </span>
                            </p>
                            <p
                              className="text-md text-neutral-400 flex items-center"
                              id="modal-description"
                            >
                              Type:
                              {(() => {
                                const { bg, text } = chooseTrans(
                                  selectedExpense?.type
                                );

                                return (
                                  <span
                                    className={`${bg} ${text} bg-opacity-30 rounded-full p-1 pl-2 pr-2 ml-2`}
                                  >
                                    {selectedExpense?.type}
                                  </span>
                                );
                              })()}
                            </p>
                            <p
                              className="text-md text-neutral-400 flex items-center"
                              id="modal-description"
                            >
                              Date:{' '}
                              <span className="text-white font-normal ml-2">
                                {formatDate(selectedExpense?.date)}
                              </span>
                            </p>
                            <p
                              className="text-md text-neutral-400 flex items-center"
                              id="modal-description"
                            >
                              Category:
                              <span className="text-white font-normal ml-2">
                                {selectedExpense?.category}
                              </span>
                            </p>
                            <p
                              className="text-md text-neutral-400 flex items-center"
                              id="modal-description"
                            >
                              Details:
                              <span className="text-white font-normal ml-2">
                                {selectedExpense?.details}
                              </span>
                            </p>
                            <p
                              className="text-md text-neutral-400 flex items-center"
                              id="modal-description"
                            >
                              Status:{' '}
                              {(() => {
                                const statusColor =
                                  selectedExpense?.isPending === false
                                    ? 'bg-purple-600'
                                    : 'bg-pink-700';

                                const status =
                                  selectedExpense?.isPending === false
                                    ? 'Submitted'
                                    : 'Pending';

                                return (
                                  <span
                                    className={`${statusColor} bg-opacity-50 rounded-full p-1 text-neutral-300 pl-2 pr-2 ml-2`}
                                  >
                                    {status}
                                  </span>
                                );
                              })()}
                            </p>
                            <div className="mt-3 sm:mt-4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center bg-zinc-900 rounded-xl m-4">
              <p className="text-neutral-400 font-thin mt-5">
                No recent expenses!
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center mb-4 ">
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            total={50}
            className=" bg-zinc-700 rounded-xl"
            onChange={handlePageChange}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        edit={edit}
        deleteExpense={deleteExpense}
      />
    </Layout>
  );
};

export default Dashboard;
