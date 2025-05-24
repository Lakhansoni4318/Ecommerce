import { useEffect, useState } from "react";
import api from "../../api/apiService";

interface SummaryData {
  totalProducts: number;
  totalSales: number;
  totalUsers: number;
  totalSellers: number;
  averageRating: string;
  totalReviews: number;
}

const formatCurrency = (num?: number) => {
  if (typeof num !== "number") return "$0";
  return `$${num.toLocaleString()}`;
};

const DashboardCards = () => {
  const [summary, setSummary] = useState<SummaryData>({
    totalProducts: 0,
    totalSales: 0,
    totalUsers: 0,
    totalSellers: 0,
    averageRating: "N/A",
    totalReviews: 0,
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

  const cardsTop = [
    { title: "Total Products", value: summary.totalProducts ?? 0, icon: "📦" },
    { title: "Total Sales", value: formatCurrency(summary.totalSales), icon: "💰" },
    { title: "Total Users", value: summary.totalUsers ?? 0, icon: "🧑‍🤝‍🧑" },
    { title: "Total Sellers", value: summary.totalSellers ?? 0, icon: "🛒" },
    {
      title: "Average Rating",
      value: summary.averageRating !== "N/A" ? `${summary.averageRating}/5` : "N/A",
      icon: "⭐",
    },
  ];

  const cardBottom = {
    title: "Total Reviews",
    value: summary.totalReviews ?? 0,
    icon: "📝",
  };

  return (
    <div>
      {/* Top Grid: 5 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cardsTop.map((card, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-6 flex flex-col items-center justify-center bg-white shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-5xl">{card.icon}</div>
            <div className="mt-3 text-lg font-semibold">{card.title}</div>
            <div className="text-3xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Bottom single card */}
      <div className="flex justify-center">
        <div className="border rounded-lg p-8 w-64 flex flex-col items-center justify-center bg-white shadow hover:shadow-lg transition-shadow">
          <div className="text-6xl">{cardBottom.icon}</div>
          <div className="mt-4 text-xl font-semibold">{cardBottom.title}</div>
          <div className="text-4xl font-bold">{cardBottom.value}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
