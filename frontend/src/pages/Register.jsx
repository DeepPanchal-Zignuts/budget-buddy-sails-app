import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Avatar } from '@mui/material';
import ExpenseIcon from '../Images/FormImage.png';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Icon } from '@iconify/react';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Prevents Refresh on Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        {
          name,
          email,
          password,
        }
      );
      if (res.data.success) {
        toast.success(res.data && res.data.message);
        setLoading(false);
        navigate('/login');
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong!');
      }
    }
  };

  // Protecting Routes
  useEffect(() => {
    if (localStorage.getItem('auth')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <div className="min-h-screen flex flex-col justify-center items-center p-5">
        <div
          className="flex flex-col items-center justify-center -mt-36 mb-20 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Icon icon="oi:transfer" width={35} className="text-green-400 mb-1" />
          <img src={ExpenseIcon} alt="Expenzify" className="w-40" />
        </div>

        <div className="dark:bg-zinc-800 p-8 rounded-xl shadow-lg w-full sm:w-96 lg:w-1/3">
          <h2 className="text-2xl font-bold mb-4 text-center text-white flex flex-col items-center justify-center">
            <Avatar sx={{ m: 1, backgroundColor: 'green' }}>
              <LockOutlinedIcon />
            </Avatar>
            Register
          </h2>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
              <label htmlFor="fullName" className="block text-white font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-white font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-zinc-950 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="pt-5">
              <button
                type="submit"
                className="w-full bg-green-500 text-black font-bold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-gray-100">
            Existing user?
            <Link to="/login" className="text-green-400 hover:underline pl-2">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
