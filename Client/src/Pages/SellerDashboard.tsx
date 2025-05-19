import  { useState } from 'react';
import ProductList from '../components/ProductList';
import OrderManagement from '../components/OrderManagement';
import CustomerList from '../components/CustomerList';
import FeedbackList from '../components/FeedbackList';
import DashboardCards from '../components/DashboardCards';
import SectionTabs from '../components/SectionTabs';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductList />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <CustomerList />;
      case 'feedback':
        return <FeedbackList />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      <DashboardCards />
      <SectionTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default SellerDashboard;
