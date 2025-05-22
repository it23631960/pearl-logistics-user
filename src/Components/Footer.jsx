const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-300 px-6 md:px-12 py-8">
            <div className="max-w-7xl mx-auto">
                
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Learn how to ship <span className="inline-block">🚢</span>
                        </h2>
                        <h2 className="text-2xl font-semibold text-gray-800">cargo faster and smarter!</h2>
                    </div>
                    <button className="bg-black text-white px-6 py-3 rounded-full">
                        Connect with Us
                    </button>
                </div>

                <hr className="my-6 border-gray-300" />

               
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-600 text-sm">
                    
                    <div>
                        <h3 className="font-semibold text-gray-800">About Rareblocks</h3>
                        <p className="mt-2 text-gray-500">
                            Reliable cargo shipping worldwide. Seamless logistics, timely deliveries, and trusted service—your shipment, our priority.
                        </p>
                        
                        <div className="flex gap-4 mt-4">
                            <a href="#" aria-label="Twitter">
                                <img src="/icons/twitter.png" alt="Twitter" className="w-5 h-5 hover:opacity-80" />
                            </a>
                            <a href="#" aria-label="Facebook">
                                <img src="/icons/facebook.png" alt="Facebook" className="w-5 h-5 hover:opacity-80" />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <img src="/icons/instagram.png" alt="Instagram" className="w-5 h-5 hover:opacity-80" />
                            </a>
                            <a href="#" aria-label="GitHub">
                                <img src="/icons/github.png" alt="GitHub" className="w-5 h-5 hover:opacity-80" />
                            </a>
                        </div>
                    </div>

                    
                    <div className="hidden md:block">
                        <h3 className="font-semibold text-gray-800">Company</h3>
                        <ul className="mt-2 space-y-2">
                            <li>About</li>
                            <li>Features</li>
                            <li>Works</li>
                            <li>Career</li>
                        </ul>
                    </div>

                    <div className="hidden md:block">
                        <h3 className="font-semibold text-gray-800">Help</h3>
                        <ul className="mt-2 space-y-2">
                            <li>Customer Support</li>
                            <li>Delivery Details</li>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>

                    <div className="hidden md:block">
                        <h3 className="font-semibold text-gray-800">Resources</h3>
                        <ul className="mt-2 space-y-2">
                            <li>Free eBooks</li>
                            <li>Development Tutorial</li>
                            <li>How to - Blog</li>
                            <li>YouTube Playlist</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
