import { FaShippingFast, FaShieldAlt, FaUndoAlt, FaHeadset } from 'react-icons/fa';

const MoreBenefits = () => {
  const features = [
    {
      icon: <FaShippingFast className="text-4xl text-green-600" />,
      title: 'Fast Delivery',
      description: 'Free on orders over $100',
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-600" />,
      title: 'Secure Payment',
      description: '100% protected payments',
    },
    {
      icon: <FaUndoAlt className="text-4xl text-purple-600" />,
      title: 'Easy Returns',
      description: '30 days return policy',
    },
    {
      icon: <FaHeadset className="text-4xl text-pink-600" />,
      title: '24/7 Support',
      description: 'Customer support',
    },
  ];

  return (
    <div className="w-full bg-blue-50 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-700 mb-4">More Reasons to Shop With Us</h2>
        <p className="text-lg text-gray-700">
          Experience unmatched convenience and support at every step.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white hover:bg-blue-100 transition-all rounded-2xl shadow-md hover:shadow-lg p-8 flex flex-col items-center text-center"
          >
            {feature.icon}
            <h3 className="mt-6 text-xl font-semibold text-gray-800">{feature.title}</h3>
            <p className="mt-2 text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreBenefits;
