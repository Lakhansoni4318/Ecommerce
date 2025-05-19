import { FaLock, FaStar, FaTags } from 'react-icons/fa';

const WhyShopWithUs = () => {
  const benefits = [
    {
      icon: <FaLock className="text-4xl text-blue-600" />,
      title: '100% Secure Payment',
      description: 'We ensure your transactions are protected with the latest security protocols and encryption.',
    },
    {
      icon: <FaStar className="text-4xl text-yellow-500" />,
      title: 'Premium Quality',
      description: 'All our products go through strict quality checks to ensure you receive only the best.',
    },
    {
      icon: <FaTags className="text-4xl text-pink-500" />,
      title: 'Special Offers',
      description: 'Enjoy exclusive deals and promotions regularly updated to give you the best value.',
    },
  ];

  return (
    <div className="w-full bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-600 mb-4">Why Shop With Us</h2>
        <p className="text-lg text-gray-700">
          Join thousands of satisfied customers enjoying our premium shopping experience
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-gray-50 hover:bg-blue-50 transition-all rounded-2xl shadow-md hover:shadow-lg p-8 flex flex-col items-center text-center"
          >
            {benefit.icon}
            <h3 className="mt-6 text-xl font-semibold text-gray-800">{benefit.title}</h3>
            <p className="mt-4 text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyShopWithUs;
