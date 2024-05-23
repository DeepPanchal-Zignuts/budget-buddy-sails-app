import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Toaster />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
