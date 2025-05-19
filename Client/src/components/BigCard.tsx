const BigCard = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 shadow-2xl rounded-2xl p-10 my-10 w-full">
      <div className="md:w-1/2 space-y-6">
        <div>
          <p className="text-purple-700 font-semibold text-lg mb-2">
            ✨ New Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 drop-shadow-sm">
            Luxury Shopping <br /> Experience
          </h1>
        </div>

        <p className="text-gray-700 text-lg">
          Discover premium products from trusted sellers around the world, with
          secure payment and fast delivery options.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-lg shadow-sm">
            <span className="text-green-600 text-xl">✔️</span>
            <p className="text-gray-800 font-medium">Secure Payment</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-lg shadow-sm">
            <span className="text-blue-600 text-xl">🚚</span>
            <p className="text-gray-800 font-medium">Fast Delivery</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-lg shadow-sm">
            <span className="text-yellow-600 text-xl">🏆</span>
            <p className="text-gray-800 font-medium">Quality Guarantee</p>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
        <img
          src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?semt=ais_hybrid&w=740"
          alt="Luxury Shopping"
          className="rounded-2xl w-full h-auto object-cover max-w-xl md:max-w-2xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default BigCard;
