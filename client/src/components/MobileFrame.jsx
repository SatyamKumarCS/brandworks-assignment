const MobileFrame = ({ children }) => {
  return (
    <div 
      className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-900 relative"
      style={{ 
        width: '350px', 
        height: '667px',
        minWidth: '350px',
        minHeight: '667px',
        maxWidth: '350px',
        maxHeight: '667px'
      }}
    >
      {/* Home Indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full z-50" />
      
      {/* Screen Content */}
      <div className="h-full w-full overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default MobileFrame;
