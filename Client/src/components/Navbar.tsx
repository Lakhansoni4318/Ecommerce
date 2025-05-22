import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faBars,
  faHome,
  faList,
  faHeart,
  faSignInAlt,
  faUserPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    setIsSeller(user.accountType === "Seller");
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setProfileOpen(false);
    navigate("/auth");
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">ShopEase</Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          {/* Cart */}
          <Link to="/cart">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-2xl cursor-pointer"
            />
          </Link>

          {/* Profile (only show when logged in) */}
          {isLoggedIn && (
            <div className="relative">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-2xl cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-20">
                  <ul className="p-4 space-y-3 text-gray-700">
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                      My Profile
                    </li>
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                      My Orders
                    </li>
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                      Wishlist
                    </li>
                    <hr />
                    {isSeller && (
                      <li
                        className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                        onClick={() => {
                          navigate("/SellerDashboard");
                          setProfileOpen(false);
                        }}
                      >
                        Seller Dashboard
                      </li>
                    )}
                    <li
                      className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Show SignIn and SignUp only when logged out */}
          {!isLoggedIn && (
            <div className="flex space-x-4">
              <Link
                to="/auth?type=signin"
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
                onClick={() => setProfileOpen(false)}
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Sign In
              </Link>
              <Link
                to="/auth?type=signup"
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                onClick={() => setProfileOpen(false)}
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Sign Up
              </Link>
            </div>
          )}

          {/* Sidebar Menu */}
          <FontAwesomeIcon
            icon={faBars}
            className="text-2xl cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        </div>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex justify-end z-30">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar Content */}
          <div className="relative w-80 bg-[#8DBFFD] h-full p-6 overflow-y-auto">
            {/* Sidebar Logo */}
            <div className="text-2xl font-bold text-white mb-8">ShopEase</div>

            {/* Browse Links */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-black mb-4">Browse</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-black hover:bg-blue-200 p-2 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faHome} className="mr-3" />
                  <Link to="/" onClick={() => setSidebarOpen(false)}>
                    Home
                  </Link>
                </li>
                <li className="flex items-center text-black hover:bg-blue-200 p-2 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faList} className="mr-3" />
                  <Link to="/categories" onClick={() => setSidebarOpen(false)}>
                    Categories
                  </Link>
                </li>
                <li className="flex items-center text-black hover:bg-blue-200 p-2 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faHeart} className="mr-3" />
                  <Link to="/watchlist" onClick={() => setSidebarOpen(false)}>
                    Wishlist
                  </Link>
                </li>
                <li className="flex items-center text-black hover:bg-blue-200 p-2 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
                  <Link to="/cart" onClick={() => setSidebarOpen(false)}>
                    Cart
                  </Link>
                </li>
              </ul>
            </div>

            <hr className="my-4 border-white" />

            {/* Account Links */}
            <div>
              <h4 className="text-lg font-semibold text-black mb-4">
                My Account
              </h4>
              <ul className="space-y-4">
                {isLoggedIn ? (
                  <>
                    <li className="text-black hover:bg-blue-200 p-2 rounded cursor-pointer">
                      Profile
                    </li>
                    <li className="text-black hover:bg-blue-200 p-2 rounded cursor-pointer">
                      Orders
                    </li>
                    {isSeller && (
                      <li className="text-black hover:bg-blue-200 p-2 rounded cursor-pointer">
                        <Link
                          to="/SellerDashboard"
                          onClick={() => setSidebarOpen(false)}
                        >
                          Seller Dashboard
                        </Link>
                      </li>
                    )}
                    <li
                      className="text-black hover:bg-blue-200 p-2 rounded cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setSidebarOpen(false);
                      }}
                    >
                      Logout
                    </li>
                  </>
                ) : (
                  <li className="text-black hover:bg-blue-200 p-2 rounded cursor-pointer">
                    <Link
                      to="/auth?type=signin"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
