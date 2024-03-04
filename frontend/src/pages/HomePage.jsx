import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { FaUserAlt } from 'react-icons/fa';
import { ImUser } from 'react-icons/im';
import { MdEmail } from 'react-icons/md';
import { GoArrowRight } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import homepageImage from '../Images/HomePage.png';

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

  const handleGoDashboard = () => {
    navigate('/dashboard');
  };

  const handleAccountsPage = () => {
    navigate('/dashboard/account-page');
  };

  return (
    <Layout>
      <div className="bg-slate-950 flex lg:flex-row items-center justify-center min-h-screen">
        <div className="sm:w-96 lg:w-full lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
          <div>
            <img
              src={homepageImage}
              alt="HomePageImage"
              className="lg:w-full"
            />
          </div>

          <div>
            <div className="bg-slate-100 m-5 bg-opacity-10 border border-slate-100 rounded-xl w-2/7 lg:w-full flex flex-col items-center justify-center p-5 lg:m-0 ">
              <FaUserAlt
                size={100}
                className="text-white bg-slate-700 rounded-xl ml-5 mr-5"
              />
              <div className="grid grid-cols-1">
                <h1 className="text-gray-100 text-left text-xl font-bold mt-4 flex items-center">
                  <ImUser size={25} />:
                  <span className="text-cyan-500 text-center text-sm sm:text-xl pl-2">
                    {loginUser && loginUser.name}
                  </span>
                </h1>

                <h1 className="text-gray-100 text-center text-xl font-bold mt-4 flex items-center">
                  <MdEmail size={25} />:
                  <span className="text-cyan-500 text-center text-sm sm:text-xl pl-2">
                    {loginUser && loginUser.email}
                  </span>
                </h1>

                <div>
                  <button
                    onClick={handleAccountsPage}
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded-lg"
                  >
                    <span className="pr-2">Go to Accounts</span>{' '}
                    <GoArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
