import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faShieldAlt,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../api/apiService";

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("User");
  const [error, setError] = useState<string | null>(null);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    if (type === "signup") {
      setIsSignIn(false);
    }
  }, [location]);

  
  const handleSignIn = async () => {
    try {
      const response = await api.signIn({ email: username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/'); // Redirect to home
    } catch (err) {
      setError('Sign-in failed. Please check your credentials.');
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await api.signUp({
        username,
        email,
        password,
        accountType,
      });
      console.log("Sign-up successful:", response);
      if (response?.data?.message?.toLowerCase().includes("otp sent")) {
        setShowOtpScreen(true);
      }
    } catch (err) {
      console.error(err);
      setError("Sign-up failed. Please try again.");
    }
  };

  const handleOtpChange = (
    element: HTMLInputElement,
    index: number
  ): void => {
    const newOtp = [...otp];
    newOtp[index] = element.value.replace(/[^0-9]/g, "");
    setOtp(newOtp);

    if (element.value && index < otp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    try {
      const enteredOtp = otp.join("");
      const request = {
        email: email,
        otp: enteredOtp,
      };
      const response = await api.verifyOtp(request);

      console.log("OTP Verified:", response);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("OTP verification failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-100 overflow-hidden justify-center items-center">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white shadow-lg rounded-lg h-full">
        {/* Left Form Side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center h-full">
          {showOtpScreen ? (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center">
                Verify your Email
              </h2>
              <p className="mb-6 text-gray-600 text-center">
                Enter the 6-digit OTP sent to your email.
              </p>
              <div className="flex justify-center space-x-4 mb-6">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-12 text-2xl text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ))}
              </div>
              <button
                onClick={verifyOtp}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 mb-4"
              >
                Verify OTP
              </button>
            </>
          ) : (
            <>
              {isSignIn ? (
                <>
                  <h2 className="text-3xl font-bold mb-6">
                    Sign in to your account
                  </h2>
                  <p className="mb-6 text-gray-600">
                    Enter your credentials to access your account
                  </p>
                  <input
                    type="text"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="text-right mb-6">
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    onClick={handleSignIn}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 mb-4"
                  >
                    Sign In
                  </button>
                  <p className="text-center">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsSignIn(false)}
                      className="text-blue-600 hover:underline"
                    >
                      Create a new account
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-6">
                    Create a new account
                  </h2>
                  <p className="mb-6 text-gray-600">
                    Fill in the form below to create your account
                  </p>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex space-x-4">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="my-4">
                    <label className="block mb-2 font-medium">
                      Account Type
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="User">User (Customer)</option>
                      <option value="Seller">Seller</option>
                    </select>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="flex items-center mb-6">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600 text-sm">
                      I agree to the Terms of Service and Privacy Policy
                    </span>
                  </div>
                  <button
                    onClick={handleSignUp}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 mb-4"
                  >
                    Create Account
                  </button>
                  <p className="text-center">
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsSignIn(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Sign in instead
                    </button>
                  </p>
                </>
              )}
            </>
          )}
        </div>

        {/* Right Side Welcome Section */}
        <div className="w-full md:w-1/2 p-8 bg-blue-50 flex flex-col justify-center h-full">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            Welcome to ShopEase
          </h2>
          <p className="text-gray-600 mb-8">
            Discover a world of amazing products at competitive prices.{" "}
            {isSignIn
              ? "Sign in to continue your shopping journey."
              : "Join us today and start your shopping journey."}
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon
                icon={faBoxOpen}
                className="text-blue-600 text-2xl"
              />
              <span>Thousands of Products</span>
            </div>
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon
                icon={faShieldAlt}
                className="text-blue-600 text-2xl"
              />
              <span>Secure Shopping</span>
            </div>
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-blue-600 text-2xl"
              />
              <span>Safe Payment Methods</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
