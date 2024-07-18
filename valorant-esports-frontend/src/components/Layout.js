import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout({ toggleTheme, theme }) {
  return (
    <div>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <Outlet />
    </div>
  );
}

export default Layout;
