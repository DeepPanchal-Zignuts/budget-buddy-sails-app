import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { FaUserAlt } from 'react-icons/fa';
import { ImUser } from 'react-icons/im';
import { MdEmail } from 'react-icons/md';
import { GoArrowRight } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import homepage from '../Images/HomePage.png';

const HomePage = () => {
  const [loginUser, setLoginUser] = useState('');
  const navigate = useNavigate();

  // If user is logged in set the state
  useEffect(() => {
    const isUser = JSON.parse(localStorage.getItem('auth'));
    if (isUser) {
      setLoginUser(isUser.user);
    }
  }, []);

  const handleAccountsPage = () => {
    navigate('/dashboard/account-page');
  };

  return (
    <Layout>
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-10 lg:items-center">
      <div className="order-2 lg:order-1 text-white m-5 flex justify-center items-center">
        <div className="m-12 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl">
            <span className="font-bold dark:text-green-400">Expenzify:</span>
            An Expense Manager
          </h1>
          <p className="text-xl">
            Managing expense is now easy, login to start...
          </p>
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-center lg:justify-start">
            <button
              onClick={() => navigate('/register')}
              className="bg-green-700 bg-opacity-40 text-green-300 hover:bg-green-300 hover:bg-opacity-30 border-none p-2 rounded-xl mt-3 sm:mt-0 sm:mr-3"
            >
              Register
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-green-500 hover:bg-green-600 text-black border-none p-2 rounded-xl mt-3 sm:mt-0 flex items-center justify-center"
            >
              Login
              <GoArrowRight size={20}/>
            </button>
          </div>
        </div>
      </div>
      <div className="order-1 lg:order-2 mt-12 sm:mt-14 xl:mt-1">
        <img src={homepage} alt="HomePageImage" className="w-full" />
      </div>
    </div>
  </div>
</Layout>

  );
};

export default HomePage;
