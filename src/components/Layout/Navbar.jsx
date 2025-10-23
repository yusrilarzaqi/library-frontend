import { NavLink } from 'react-router-dom';
import LinkComponent from '../atoms/Link';
import Button from '../atoms/Button';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardListIcon, HomeIcon, LoginIcon, LogoutIcon, UsersIcon, UserIcon, ChartPieIcon, BookmarkIcon, XIcon, MenuIcon
} from '@heroicons/react/outline';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const styleLink = ({ isActive }) =>
    isActive
      ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      : "text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3">
          <img className='h-10 w-10' src='/Semarang.svg' alt="coat of arms of Semarang" />
          <span className="self-center text-sm md:text-lg xl:text-2xl font-semibold whitespace-nowrap">Perpustakaan Kelurahan Bubakan</span>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:order-2 space-x-3 item-center">
          {user ? (
            <div className="hidden md:block">
              {/* Desktop Logut Button */}
              <Button onClick={logout} variant="danger" >
                <LogoutIcon className="h-5 w-5 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex space-x-2">
              {/* Desktop Login Button */}
              <LinkComponent to="/register" variant="primary" className="m-6">
                <ClipboardListIcon className="h-5 w-5 mr-1" />
                Register
              </LinkComponent>
              <LinkComponent to="/login" variant="primary" className="m-6" >
                <LoginIcon className="h-5 w-5 mr-1" />
                Login
              </LinkComponent>
            </div>
          )}

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            {user && (
              <>
                <li className="my-2 md:my-0">
                  <NavLink
                    to="/data"
                    className={styleLink}
                    onClick={closeMenu}
                  >
                    <HomeIcon className="h-5 w-5 mr-1" />
                    Data
                  </NavLink>
                </li>
                {user.role === 'admin' && <>
                  <li className="my-2 md:my-0">
                    <NavLink
                      to="/dashboard"
                      className={styleLink}
                      onClick={closeMenu}
                    >
                      <ChartPieIcon className="h-5 w-5 mr-1" />
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="my-2 md:my-0">
                    <NavLink
                      to="/users"
                      className={styleLink}
                      onClick={closeMenu}
                    >
                      <UsersIcon className="h-5 w-5 mr-1" />
                      Users
                    </NavLink>
                  </li>
                </>
                }
                <li className="my-2 md:my-0">
                  <NavLink
                    to="/borrow"
                    className={styleLink}
                    onClick={closeMenu}
                  >
                    <BookmarkIcon className="h-5 w-5 mr-1" />
                    Data Peminjaman
                  </NavLink>
                </li>
                <li className="my-2 md:my-0">
                  <NavLink
                    to="/profile"
                    className={styleLink}
                    onClick={closeMenu}
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    {user.username}
                  </NavLink>
                </li>
                {/* Mobile Logout Button */}
                <li className="md:hidden mt-4 pt-4 border-t border-gray-200">
                  <Button onClick={() => { logout(); closeMenu(); }} variant="danger" className="w-full justify-center">
                    <LogoutIcon className="h-5 w-5 mr-1" />
                    Logout
                  </Button>
                </li>
              </>
            )}
            {/* Mobile Register/Login Buttons */}
            {!user && (
              <div className="md:hidden space-y-2">
                <li>
                  <LinkComponent to="/register" variant="primary" className="w-full justify-center" onClick={closeMenu}>
                    <ClipboardListIcon className="h-5 w-5 mr-1" />
                    Register
                  </LinkComponent>
                </li>
                <li>
                  <LinkComponent to="/login" variant="primary" className="w-full justify-center" onClick={closeMenu}>
                    <LoginIcon className="h-5 w-5 mr-1" />
                    Login
                  </LinkComponent>
                </li>
              </div>
            )}
          </ul>
        </div>

      </div>
    </nav >
  );
};

export default Navbar;

