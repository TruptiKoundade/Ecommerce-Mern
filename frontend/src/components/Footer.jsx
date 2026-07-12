const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        <p className="text-gray-500">Built with the MERN stack — MongoDB, Express, React, Node.js</p>
      </div>
    </footer>
  );
};

export default Footer;
