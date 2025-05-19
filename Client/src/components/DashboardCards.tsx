import { useEffect, useState } from "react";
import api from "../../api/apiService";

interface SummaryData {
  totalProducts: number;
  totalSales: number;
  totalCustomers: number;
  averageRating: string;
  totalRatingCount: number;
}

const formatCurrency = (num?: number) => {
  if (typeof num !== "number") return "$0";
  return `$${num.toLocaleString()}`;
};

const DashboardCards = () => {
  const [summary, setSummary] = useState<SummaryData>({
    totalProducts: 0,
    totalSales: 0,
    totalCustomers: 0,
    averageRating: "N/A",
    totalRatingCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.summary();
        setSummary(res.data);
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      }
    };
    fetchData();
  }, []);

  const cardData = [
    { title: 'Total Products', value: summary.totalProducts ?? 0, icon: '📦' },
    { title: 'Total Sales', value: formatCurrency(summary.totalSales), icon: '💰' },
    { title: 'Total Customers', value: summary.totalCustomers ?? 0, icon: '🧑‍🤝‍🧑' },
    { title: 'Average Rating', value: summary.averageRating !== "N/A" ? `${summary.averageRating}/5` : "N/A", icon: '⭐' },
    { title: 'Total Reviews', value: summary.totalRatingCount ?? 0, icon: '📝' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cardData.map((card, idx) => (
        <div key={idx} className="border rounded-lg p-4 flex flex-col items-center justify-center bg-white shadow">
          <div className="text-4xl">{card.icon}</div>
          <div className="mt-2 text-lg font-semibold">{card.title}</div>
          <div className="text-2xl font-bold">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
