import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/UserContext';
import NavIcon from '../../Images/Icon.png';
import { TbLogout2 } from 'react-icons/tb';
import { Icon } from '@iconify/react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Button, Menu, MenuItem } from '@mui/material';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [accountFlag, setAccountFlag] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: '',
    });
    handleClose();
    localStorage.removeItem('auth');
    toast.success('Logout Successfully');
  };
  let selectedAccount = JSON.parse(localStorage.getItem('selectedAccount'));
  useEffect(() => {
    if (!auth.user && auth.token === '') {
      navigate('/login');
    }
    if (selectedAccount) {
      setAccountFlag(true);
    }
    if (
      location.pathname === '/dashboard/account-page' ||
      location.pathname === '/'
    ) {
      setAccountFlag(false);
    }
  }, [auth, navigate, location]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isUser = JSON.parse(localStorage.getItem('auth'));

  return (
    <nav className="fixed top-2 left-2 right-2 z-50 bg-zinc-600 bg-opacity-40 backdrop-blur-lg rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center text-white font-bold">
              <Icon
                icon="oi:transfer"
                width={30}
                className="pr-2 text-green-400"
              />
              <img
                src={NavIcon}
                className="w-32 mr-2 bg-transparent "
                alt="Logo"
              />
            </NavLink>
            {/* Render links when not in mobile view */}
          </div>
          {!isMobile ? (
            isUser ? (
              <div className=" flex justify-between items-center space-x-4 text-white">
                {accountFlag ? (
                  <>
                    <NavLink
                      to="/dashboard/home-page"
                      className="flex items-center hover:text-green-400 hover:bg-zinc-800  px-3 py-2 rounded-md text-md font-medium"
                    >
                      <Icon icon="mi:home" width={30} className="pr-2 pb-1" />
                      Home
                    </NavLink>
                    <NavLink
                      to="/dashboard"
                      className="flex items-center hover:text-green-400 hover:bg-zinc-800  px-3 py-2 rounded-md text-md font-medium"
                    >
                      <Icon
                        icon="tdesign:money"
                        width={30}
                        className="pr-2 pb-1"
                      />
                      Expenses
                    </NavLink>
                    <NavLink
                      to="/dashboard/account-page"
                      className="flex items-center hover:text-green-400 hover:bg-zinc-800  px-3 py-2 rounded-md text-md font-medium"
                    >
                      <Icon
                        icon="fa6-solid:money-check"
                        width={30}
                        className="pr-2 pb-1"
                      />
                      Accounts
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/"
                      className="flex items-center hover:text-green-400 hover:bg-zinc-800  px-3 py-2 rounded-md text-md font-medium"
                    >
                      <Icon icon="mi:home" width={30} className="pr-2 pb-1" />
                      Home
                    </NavLink>
                    <NavLink
                      to="/dashboard/account-page"
                      className="flex items-center hover:text-green-400 hover:bg-zinc-800  px-3 py-2 rounded-md text-md font-medium"
                    >
                      <Icon
                        icon="fa6-solid:money-check"
                        width={30}
                        className="pr-2"
                      />
                      Accounts
                    </NavLink>
                  </>
                )}

                <NavLink className="px-3 py-2 flex items-center text-md font-semibold ">
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <Stack direction="row" spacing={2}>
                      <Avatar {...stringAvatar(isUser?.data?.fullName)} />
                    </Stack>
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleLogout}>
                      <TbLogout2 className="pr-2 text-red-400" size={30} />
                      Logout
                    </MenuItem>
                  </Menu>
                </NavLink>
              </div>
            ) : (
              <div className=" flex justify-between items-center space-x-4 text-white">
                <NavLink
                  to="/register"
                  className="hover:text-green-400 hover:bg-zinc-700 px-3 py-2 flex items-center rounded-md text-md font-medium "
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="flex items-center hover:bg-zinc-700 hover:text-green-400 px-3 py-2 rounded-md text-md font-medium"
                >
                  Login
                </NavLink>
              </div>
            )
          ) : (
            <div className="-mr-2 flex md:hidden">
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <Stack direction="row" spacing={2}>
                  <Avatar {...stringAvatar(isUser?.data?.fullName)} />
                </Stack>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <TbLogout2 className="pr-2 text-red-400" size={30} />
                  Logout
                </MenuItem>
              </Menu>
              <button
                onClick={toggleNavbar}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-zinc-700 focus:outline-none focus:bg-zinc-700 focus:text-green-400"
              >
                {isOpen ? <MdClose size={24} /> : <GiHamburgerMenu size={24} />}
              </button>
            </div>
          )}
        </div>

        {/* Responsive menu */}
        {isOpen &&
          (isUser ? (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <hr />
                {accountFlag ? (
                  <>
                    <NavLink
                      to="/"
                      className="hover:text-green-400 hover:bg-zinc-800 flex items-center dark:text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      <Icon icon="mi:home" width={30} className="pr-2 pb-1" />
                      Home
                    </NavLink>
                    <NavLink
                      to="/dashboard"
                      className="hover:text-green-400 hover:bg-zinc-800 flex items-center dark:text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      <Icon
                        icon="tdesign:money"
                        width={30}
                        className="pr-2 pb-1"
                      />
                      Expenses
                    </NavLink>
                    <NavLink
                      to="/dashboard/account-page"
                      className="hover:text-green-400 hover:bg-zinc-800 flex items-center dark:text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      <Icon
                        icon="fa6-solid:money-check"
                        width={30}
                        className="pr-2"
                      />
                      Accounts
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/"
                      className="hover:text-green-400 hover:bg-zinc-800 flex items-center dark:text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      <Icon icon="mi:home" width={30} className="pr-2 pb-1" />
                      Home
                    </NavLink>
                    <NavLink
                      to="/dashboard/account-page"
                      className="hover:text-green-400 hover:bg-zinc-800 flex items-center dark:text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      <Icon
                        icon="fa6-solid:money-check"
                        width={30}
                        className="pr-2"
                      />
                      Accounts
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className=" px-2 pt-2 pb-3 space-y-1 sm:px-3 text-white">
              <NavLink
                to="/register"
                className="hover:text-green-400 hover:bg-zinc-700 flex items-center px-3 py-2 rounded-md text-base font-medium "
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="hover:text-green-400 hover:bg-zinc-700 flex items-center px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </NavLink>
            </div>
          ))}
      </div>
    </nav>
  );
};

export default Header;
