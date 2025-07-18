
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const pages = [
    { path: '/app/dashboard', label: 'Dashboard' },
    { path: '/app/reservations', label: 'Rezervasyonlar' },
    { path: '/app/employees', label: 'Personel' },
    { path: '/app/employee-groups', label: 'Personel Grupları' },
    { path: '/app/clients', label: 'Müşteriler' },
    { path: '/app/saloons', label: 'Salonlar' },
    { path: '/app/tables', label: 'Masa Düzeni' },
    { path: '/app/transfer-locations', label: 'Bölgeler' },
    { path: '/app/company-rates', label: 'Şirket Fiyatları' },
    { path: '/app/general-income', label: 'Genel Fiyatlar' },
  ];

  return (
    <nav className="bg-[#749BC2] text-white p-4 flex gap-6 px-4 py-4 items-center justify-center">
      {pages.map((page) => (
        <Link
          key={page.path}
          to={page.path}
          className={`font-semibold hover:underline ${
            location.pathname === page.path ? 'underline' : ''
          }`}
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
};

export default Header;
