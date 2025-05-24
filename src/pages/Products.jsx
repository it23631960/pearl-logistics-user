import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleBar from "../Components/TitleBar";
import ProductCard from "../Components/ProductCard";
import searchIcon from "../assets/icons/searchIcon.svg";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [filters, setFilters] = useState({
    category: "All Categories",
    minPrice: "",
    maxPrice: "",
    bestSeller: false,
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}api/items/get-items`);
        setProducts(response.data);
        
        const uniqueCategories = [...new Set(response.data.map(item => item.category))].filter(Boolean);
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: "All Categories",
      minPrice: "",
      maxPrice: "",
      bestSeller: false,
    });
    setAppliedFilters({
      category: "All Categories",
      minPrice: "",
      maxPrice: "",
      bestSeller: false,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      appliedFilters.category === "All Categories" ||
      product.category === appliedFilters.category;
    const matchesMinPrice =
      appliedFilters.minPrice === "" ||
      product.price >= Number(appliedFilters.minPrice);
    const matchesMaxPrice =
      appliedFilters.maxPrice === "" ||
      product.price <= Number(appliedFilters.maxPrice);
    const matchesBestSeller =
      !appliedFilters.bestSeller || product.bestseller === true;
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBestSeller &&
      matchesSearch
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  if (loading) {
    return (
      <div>
        <TitleBar cart={true} />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <TitleBar cart={true} />
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TitleBar cart={true} />
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
        <div className="w-full md:w-64 lg:w-72 xl:w-80 px-4 sm:px-6">
          <div className="flex px-4 sm:px-6 py-2 rounded-full border-2 border-gray-200">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-gray-600 text-xs sm:text-sm font-lexend focus:outline-none"
            />
            <img src={searchIcon} alt="" className="w-5 sm:w-6" />
          </div>
          <div className="mt-3 sm:mt-4">
            <h4 className="font-quicksand text-sm sm:text-base">Sort By</h4>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded text-xs sm:text-sm"
            >
              <option value="">Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
          <div className="mt-3 sm:mt-4">
            <h4 className="font-quicksand text-sm sm:text-base">Category</h4>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded text-xs sm:text-sm"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 sm:mt-4">
            <h4 className="font-quicksand text-sm sm:text-base">Price Range</h4>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="w-1/2 px-2 py-1 border rounded text-xs sm:text-sm"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="w-1/2 px-2 py-1 border rounded text-xs sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center">
            <input
              type="checkbox"
              checked={filters.bestSeller}
              onChange={(e) =>
                setFilters({ ...filters, bestSeller: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-xs sm:text-sm">Best Sellers Only</span>
          </div>
          
          <div className="mt-3 sm:mt-4 flex gap-2">
            <button
              onClick={handleClearFilters}
              className="w-1/2 bg-gray-200 py-1 sm:py-2 rounded text-xs sm:text-sm"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="w-1/2 bg-blue-500 text-white py-1 sm:py-2 rounded text-xs sm:text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard 
                key={product.itemId} 
                productsData={product} 
              />
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8">
              <p className="text-gray-600">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;