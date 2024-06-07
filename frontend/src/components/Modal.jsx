import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdClose } from 'react-icons/md';

const Modal = ({ isOpen, closeModal, edit }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [pending, setPending] = useState('No');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [useCurrentDate, setUseCurrentDate] = useState(false);

  useEffect(() => {
    if (edit) {
      setAmount(edit.amount);
      setType(edit.type);
      setPending(edit.isPending);
      setDate(new Date(edit.date).toISOString().split('T')[0]);
      setCategory(edit.category);
      setSubject(edit.subject);
      setDetails(edit.details);
    }
  }, [edit]);

  const handleCheckboxChange = (e) => {
    setUseCurrentDate(e.target.checked);
    if (e.target.checked) {
      const currentDate = new Date().toISOString().split('T')[0];
      console.log(currentDate);
      setDate(currentDate);
    } else {
      setDate(edit ? edit.date : '');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const selectedAccount = JSON.parse(localStorage.getItem('selectedAccount'));
    try {
      let res;
      if (edit) {
        // If edit object exists, update the expense
        res = await axios.patch(
          `${process.env.REACT_APP_API}/api/v1/expense/update-expense/${
            edit._id || edit.id
          }`,
          {
            subject,
            amount,
            type,
            date,
            category,
            details,
            pending,
          }
        );
      } else {
        // Otherwise, add a new expense
        res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/expense/add-expense`,
          {
            subject,
            accountId: selectedAccount.id || selectedAccount._id,
            amount,
            type,
            date,
            category,
            details,
            pending,
          }
        );

        // Update the account balance based on the transaction type
      }

      await localStorage.setItem(
        'selectedAccount',
        JSON.stringify(res?.data?.afterUpdateAccount)
      );

      if (res?.data?.success) {
        toast.success(res.data && res.data.message);
        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-200 bg-opacity-50 z-50 overflow-hidden">
          <div>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full max-h-screen overflow-y-auto ">
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
                  <div className="flex items-start">
                    <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                        id="modal-title"
                      >
                        {edit ? 'Edit Expense' : 'Add New Expense'}
                      </h3>
                      <div className="mt-2">
                        <p
                          className="text-sm text-gray-500"
                          id="modal-description"
                        >
                          Add the subject, choose the category, enter the
                          amount, select the date and add your expense/income
                          with some details.
                        </p>

                        <div className="mt-3 sm:mt-4">
                          <label
                            htmlFor="subject"
                            className="block text-white font-thin"
                          >
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Travel Expenses.."
                            autoFocus
                          />
                          <label
                            htmlFor="amount"
                            className="block text-white font-thin pt-2"
                          >
                            Amount*
                          </label>
                          <div className="flex">
                            <input
                              type="number"
                              id="amount"
                              className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="5001"
                              autoFocus
                              required
                            />
                            <label className="text-white flex items-center ml-3">
                              <input
                                type="radio"
                                id="default-radio-1"
                                name="type"
                                value="expense"
                                required
                                checked={type === 'expense'}
                                onChange={(e) => setType(e.target.value)}
                              />
                              Expense
                            </label>
                            <label className="text-white flex items-center ml-3">
                              <input
                                type="radio"
                                id="default-radio-2"
                                name="type"
                                value="income"
                                required
                                checked={type === 'income'}
                                onChange={(e) => setType(e.target.value)}
                              />
                              Income
                            </label>
                          </div>

                          <label
                            htmlFor="date"
                            className="block text-white font-thin pt-2"
                          >
                            Date*
                          </label>
                          <input
                            type="date"
                            id="date"
                            className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            autoFocus
                            required
                            disabled={useCurrentDate}
                          />
                          <label className="text-white">
                            <input
                              type="checkbox"
                              className=" rounded-lg accent-green-400 mx-1 m-2"
                              checked={useCurrentDate}
                              onChange={handleCheckboxChange}
                            />
                            Use current date
                          </label>

                          <label
                            htmlFor="category"
                            className="block text-white font-thin pt-2"
                          >
                            Category*
                          </label>
                          <select
                            name="category"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                            required
                          >
                            {type === 'expense' ? (
                              <>
                                <option label="Please Select" value=""></option>
                                <option value="travel">Travel</option>
                                <option value="shopping">Shopping</option>
                                <option value="education">Education</option>
                                <option value="bills">Bills</option>
                                <option value="insurance">Insurance</option>
                                <option value="housing">Housing</option>
                                <option value="transportation">
                                  Transportation
                                </option>
                                <option value="food">Food & Dining</option>
                                <option value="entertainment">
                                  Entertainment
                                </option>
                                <option value="health">Health & Fitness</option>
                                <option value="taxes">Taxes</option>
                                <option value="personal">Personal Care</option>
                                <option value="miscellaneous">
                                  Miscellaneous
                                </option>
                              </>
                            ) : (
                              <>
                                <option label="Please Select" value=""></option>
                                <option value="salary">Salary</option>
                                <option value="business">
                                  Business Income
                                </option>
                                <option value="freelance">Freelance</option>
                                <option value="investments">Investments</option>
                                <option value="rental">Rental Income</option>
                                <option value="pension">Pension</option>
                                <option value="bonuses">Bonuses</option>
                                <option value="gifts">Gifts</option>
                                <option value="other">Other Income</option>
                              </>
                            )}
                          </select>
                          <label
                            htmlFor="details"
                            className="block text-white font-thin pt-2"
                          >
                            Details
                          </label>
                          <textarea
                            type="text"
                            id="details"
                            rows="4"
                            cols="50"
                            className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Details.."
                            autoFocus
                          />
                          <label
                            htmlFor="pending"
                            className="block text-white font-thin pt-2"
                          >
                            Pending
                          </label>
                          <label className="text-white">
                            <input
                              type="checkbox"
                              className=" rounded-lg accent-green-400 mx-1 m-2"
                              name="pending"
                              checked={pending === 'Yes'}
                              onChange={(e) =>
                                setPending(e.target.checked ? 'Yes' : 'No')
                              }
                            />
                            Yes, this expense is pending
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 sm:px-6 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-zinc-700 bg-opacity-40 text-green-300 hover:bg-zinc-500 hover:bg-opacity-30 border-none p-2 rounded-xl mt-3 sm:mt-0 mr-3 mb-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-black border-none p-2 rounded-xl mt-3 sm:mt-0 flex items-center justify-center mb-3"
                  >
                    {edit ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
