import { Link, useLocation } from 'react-router-dom';

const pages = [
  { path: '/app/dashboard', label: 'Dashboard' },
  { path: '/app/reservations', label: 'Rezervasyonlar' },
  { path: '/app/transfer-list', label: 'Transfer Listesi' },
  { path: '/app/welcome-list', label: 'Karşılama Listesi' },
  { path: '/app/employees', label: 'Personel' },
  { path: '/app/employee-groups', label: 'Personel Grupları' },
  { path: '/app/clients', label: 'Müşteriler' },
  { path: '/app/saloons', label: 'Salonlar' },
  { path: '/app/tables', label: 'Masa Düzeni' },
  { path: '/app/transfer-locations', label: 'Bölgeler' },
  { path: '/app/company-rates', label: 'Şirket Fiyatları' },
  { path: '/app/general-income', label: 'Genel Fiyatlar' },
];

const shipMenuPaths = [
  '/app/reservations',
  '/app/transfer-list',
  '/app/welcome-list',
];

const definitionGroups: { [title: string]: string[] } = {
  'Müşteri Tanımları': ['/app/clients', '/app/company-rates'],
  'Mekan Tanımları': ['/app/saloons', '/app/tables'],
  'Transfer Tanımları': ['/app/transfer-locations'],
  Genel: ['/app/employees', '/app/employee-groups', '/app/general-income'],
};

const Header = () => {
  const location = useLocation();

  const getPageLabel = (path: string) =>
    pages.find((p) => p.path === path)?.label || path;

  return (
    <header className="shadow bg-[#C4D9FF] text-black items-center justify-center flex">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start h-16 space-x-8 items-center">

          {/* ===== Gemi Menüsü ===== */}
          <div className="relative group">
            <button className="text-black hover:text-blue-600 font-medium px-3 py-2">
              Gemi
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg 
                            opacity-0 invisible group-hover:visible group-hover:opacity-100 
                            transition-all duration-200 z-20">
              <div className="py-1 text-sm text-black">
                {shipMenuPaths.map((path) => (
                  <Link
                    key={path}
                    to={path}
                    className={`block px-4 py-2 hover:bg-gray-100 ${
                      location.pathname === path ? 'text-blue-600' : ''
                    }`}
                  >
                    {getPageLabel(path)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Muhasebe Menüsü ===== */}
          <div className="relative group">
            <button className="text-black hover:text-blue-600 font-medium px-3 py-2">
              Muhasebe
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg 
                            opacity-0 invisible group-hover:visible group-hover:opacity-100 
                            transition-all duration-200 z-20">
              <div className="py-1 text-sm text-black">
                <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Gelirler
                </span>
                <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Giderler
                </span>
                <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Raporlar
                </span>
              </div>
            </div>
          </div>

          {/* ===== Tanımlar Menüsü ===== */}
          <div className="relative group">
            <button className="text-black hover:text-blue-600 font-medium px-3 py-2">
              Tanımlar
            </button>
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg 
                            opacity-0 invisible group-hover:visible group-hover:opacity-100 
                            transition-all duration-200 z-20">
              <div className="py-2 text-sm text-black px-2 space-y-3">
                {Object.entries(definitionGroups).map(([groupTitle, paths]) => (
                  <div key={groupTitle}>
                    <div className="px-2 py-1 text-gray-500 font-semibold cursor-default">
                      {groupTitle}
                    </div>
                    {paths.map((path) => (
                      <Link
                        key={path}
                        to={path}
                        className={`block px-4 py-1 hover:bg-gray-100 ${
                          location.pathname === path ? 'text-blue-600' : ''
                        }`}
                      >
                        {getPageLabel(path)}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
