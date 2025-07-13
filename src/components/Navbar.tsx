import React from 'react';

type Props = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const Navbar: React.FC<Props> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow flex justify-between items-center">
      <div className="text-xl font-bold">MyApp</div>
      <div className="space-x-4">
        <button 
        onClick={() => setCurrentPage('reservations')}
        className={`hover:underline ${
            currentPage === 'reservations' ? 'underline font-semibold' : ''
          }`}>Rezervasyonlar</button>
          <button
          onClick={() => setCurrentPage('inventory')}
          className={`hover:underline ${
            currentPage === 'inventory' ? 'underline font-semibold' : ''
          }`}
        >
          Envanter
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
