const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Data Management App. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              Made with ❤️ using React & TailwindCSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

