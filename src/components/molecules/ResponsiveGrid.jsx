const ResponsiveGrid = ({ children }) => (
  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
    {children}
  </div>
);

export default ResponsiveGrid;
