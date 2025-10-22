// import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import LinkComponent from '../atoms/Link';
import Button from '../atoms/Button';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardListIcon, HomeIcon, BookOpenIcon, LoginIcon, LogoutIcon, UsersIcon, UserIcon, ChartPieIcon, BookmarkIcon
} from '@heroicons/react/outline';

const Navbar = () => {
  const { user, logout } = useAuth();

  const styleLink = ({ isActive }) =>
    isActive
      ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      : "text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium";


  return (
    // <nav className="bg-white shadow-sm">
    <nav className="bg-white fixed  w-full z-20 top-0 start-0 border-b border-gray-200">
      {/*<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">*/}
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3">
          <BookOpenIcon className="h-8 w-8 text-blue-600" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">Perpustakaan Kelurahan Bubakan</span>
        </div>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {user ? (
            <>
              <Button onClick={logout} variant="danger" >
                <LogoutIcon className="h-5 w-5 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <LinkComponent to="/register" variant="primary" className="m-6">
                <ClipboardListIcon className="h-5 w-5 mr-1" />
                Register
              </LinkComponent>
              <LinkComponent to="/login" variant="primary" className="m-6" >
                <LoginIcon className="h-5 w-5 mr-1" />
                Login
              </LinkComponent>
            </>
          )}
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
            {user && (
              <>
                <li>
                  <NavLink
                    to="/data"
                    className={styleLink}
                  >
                    <HomeIcon className="h-5 w-5 mr-1" />
                    Data
                  </NavLink>
                </li>
                {user.role === 'admin' && (
                  <>
                    <li>
                      <NavLink
                        to="/dashboard"
                        className={styleLink}
                      >
                        <ChartPieIcon className="h-5 w-5 mr-1" />
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/users"
                        className={styleLink}
                      >
                        <UsersIcon className="h-5 w-5 mr-1" />
                        Users
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink
                    to="/borrow"
                    className={styleLink}
                  >
                    <BookmarkIcon className="h-5 w-5 mr-1" />
                    Data Peminjaman
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className={styleLink}
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    {user.username}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

