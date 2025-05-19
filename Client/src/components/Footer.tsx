import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-100 text-gray-800 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-4">ShopEase</h1>
          <p className="text-gray-600 mb-6">
            Your one-stop shop for quality products, unbeatable deals, and a premium shopping experience.
          </p>
          <div className="flex space-x-4">
            <FaFacebookF className="text-blue-600 hover:text-blue-800 cursor-pointer text-xl" />
            <FaInstagram className="text-pink-500 hover:text-pink-700 cursor-pointer text-xl" />
            <FaTwitter className="text-sky-400 hover:text-sky-600 cursor-pointer text-xl" />
            <FaYoutube className="text-red-500 hover:text-red-700 cursor-pointer text-xl" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">Shop</li>
            <li className="hover:text-blue-600 cursor-pointer">Categories</li>
            <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Customer Support</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="hover:text-blue-600 cursor-pointer">FAQ</li>
            <li className="hover:text-blue-600 cursor-pointer">Shipping & Delivery</li>
            <li className="hover:text-blue-600 cursor-pointer">Returns & Exchanges</li>
            <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
          <p className="text-gray-600 mb-3">📍 123 Main Street, New York, USA</p>
          <p className="text-gray-600 mb-3">📞 +1 234 567 890</p>
          <p className="text-gray-600">✉️ support@ShopEase.com</p>
        </div>

      </div>

      <div className="mt-12 border-t border-gray-300 pt-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} ShopEase. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
