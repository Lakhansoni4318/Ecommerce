const tabs = [
  { label: 'Products', value: 'products', icon: '🛍️' },
  { label: 'Orders', value: 'orders', icon: '📦' },
  { label: 'Customers', value: 'customers', icon: '👥' },
  { label: 'Feedback', value: 'feedback', icon: '📝' },
];

interface SectionTabsProps {
  activeTab: string;
  onTabChange: (tabValue: string) => void;
}

const SectionTabs = ({ activeTab, onTabChange }: SectionTabsProps) => {
  return (
    <div className="flex gap-4">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md 
                      ${activeTab === tab.value ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SectionTabs;
