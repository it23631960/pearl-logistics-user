import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const navItems = [
  { title: "Home", icon: "/icons/home.png", href: "/" },
  { title: "Request Product", icon: "/icons/request.png", href: "/request" },
  { title: "Our Products", icon: "/icons/products.png", href: "/products" },
  { title: "Contact Us", icon: "/icons/contact.png", href: "/contact" },
  { title: "My Cart", icon: "/icons/cart.png", href: "/cart" },
  { title: "Profile", icon: "/icons/profile.png", href: "/profile" },
];

const profileMenuItems = [
  { title: "Settings", icon: "/icons/settings.png", href: "/settings" },
  { title: "My Orders", icon: "/icons/myorders.png", href: "/myorders" },
  { title: "My Reports", icon: "/icons/report.png", href: "/myreports" },
  { title: "Log Out", icon: "/icons/logout.png", href: "/logout", isLogout: true },
];

export const FloatingNav = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);
  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    toast.success("Logged out successfully!");
    setShowProfileMenu(false);
    navigate("/login");
  };

  return (
    <>
      <AnimatePresence>
        {showProfileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
            onClick={() => setShowProfileMenu(false)}
          />
        )}
      </AnimatePresence>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex h-12 md:h-16 lg:h-20 gap-2 sm:gap-4 md:gap-6 items-center px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-full bg-[#DFF3FF] shadow-lg z-50">
        {navItems.map((item) => {
          if (item.title === "Profile") {
            return (
              <div key={item.title} className="relative" ref={profileMenuRef}>
                <ProfileItem 
                  item={item} 
                  showMenu={showProfileMenu} 
                  setShowMenu={setShowProfileMenu}
                  handleLogout={handleLogout}
                />
              </div>
            );
          }
          return <NavItem key={item.title} item={item} />;
        })}
      </div>
    </>
  );
};

const NavItem = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Link to={item.href} className="relative">
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col items-center gap-0 sm:gap-1"
      >
        <motion.div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#CAC8C8] rounded-full transition-all duration-300 hover:scale-110">
          <img src={item.icon} alt={item.title} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </motion.div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-[-10px] -translate-y-full left-1/2 -translate-x-1/2 bg-gray-500 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap z-50"
            >
              {item.title}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

const ProfileItem = ({ item, showMenu, setShowMenu, handleLogout }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <>
      <div className="relative">
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setShowMenu(!showMenu)}
          className="flex flex-col items-center gap-0 sm:gap-1 cursor-pointer"
        >
          <motion.div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#CAC8C8] rounded-full transition-all duration-300 hover:scale-110">
            <img src={item.icon} alt={item.title} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </motion.div>
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[-10px] -translate-y-full left-1/2 -translate-x-1/2 bg-gray-500 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap z-40"
              >
                {item.title}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 sm:bottom-20 md:bottom-24 right-0 bg-gray-200 rounded-lg shadow-lg overflow-hidden w-48 sm:w-56 md:w-64 z-50"
          >
            {profileMenuItems.map((menuItem) => (
              menuItem.isLogout ? (
                <a
                  key={menuItem.title}
                  href={menuItem.href}
                  onClick={handleLogout}
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 py-3 sm:py-4 hover:bg-gray-300 border-b border-gray-300 last:border-0"
                >
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-300 rounded-full">
                    <img src={menuItem.icon} alt={menuItem.title} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-sm sm:text-base md:text-lg">{menuItem.title}</span>
                </a>
              ) : (
                <Link
                  key={menuItem.title}
                  to={menuItem.href}
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 py-3 sm:py-4 hover:bg-gray-300 border-b border-gray-300 last:border-0"
                >
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-300 rounded-full">
                    <img src={menuItem.icon} alt={menuItem.title} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-sm sm:text-base md:text-lg">{menuItem.title}</span>
                </Link>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};