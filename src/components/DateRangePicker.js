import { useState, useEffect } from 'react';

const DateRangePicker = ({ onApply,value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);
  const [showMonthList, setShowMonthList] = useState(false);
  const [showYearList, setShowYearList] = useState(false);

  const handleApply = () => {
    const start = new Date(selectedRange.start);
   const end = new Date(selectedRange.end);
   onApply({ start, end }); // Pass the date range to the parent component
   console.log("Selected Range:", start, end);
    setIsOpen(false); // Close the calendar dropdown
  };

  useEffect(() => {
    // Update selectedRange when the parent component's value changes
    if (value) {
      setSelectedRange(value);
    }
  }, [value]);

  // Generate array of past 20 years
  const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 20; year--) {
      years.push(year);
    }
    return years;
  };

  // Array of all months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Handle month navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  // Get dates for current month view
  const getDatesForMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dates = [];
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  };

  const handleDateClick = (date) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
    } else {
      if (date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
      }
    }
  };

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), monthIndex));
    setShowMonthList(false);
  };

  const handleYearSelect = (year) => {
    setSelectedMonth(new Date(year, selectedMonth.getMonth()));
    setShowYearList(false);
  };

  const isInRange = (date) => {
    if (!date || !selectedRange.start) return false;
    if (!selectedRange.end && hoverDate) {
      return (date >= selectedRange.start && date <= hoverDate) ||
             (date <= selectedRange.start && date >= hoverDate);
    }
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.month-year-selector')) {
        setShowMonthList(false);
        setShowYearList(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Date Display Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-lg m-0 bg-white hover:bg-gray-50 flex items-center gap-2 min-w-[250px]"
      >
        <span className="text-gray-600">
          {selectedRange.start 
            ? `${formatDate(selectedRange.start)} - ${selectedRange.end ? formatDate(selectedRange.end) : 'Select end date'}`
            : 'Select date range'}
        </span>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 bg-white border rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
          {/* Month/Year Navigation and Selection */}
          <div className="flex justify-between items-center mb-4">
            {/* Left Arrow */}
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded text-gray-600"
            >
              ←
            </button>

            {/* Month/Year Selectors */}
            <div className="flex gap-2 relative month-year-selector">
              {/* Month Selection */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMonthList(!showMonthList);
                    setShowYearList(false);
                  }}
                  className="px-2 py-1 hover:bg-gray-100 rounded font-medium"
                >
                  {months[selectedMonth.getMonth()]}
                </button>
                {showMonthList && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {months.map((month, index) => (
                      <div
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Selection */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowYearList(!showYearList);
                    setShowMonthList(false);
                  }}
                  className="px-2 py-1 hover:bg-gray-100 rounded font-medium"
                >
                  {selectedMonth.getFullYear()}
                </button>
                {showYearList && (
                  <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {getYearsList().map(year => (
                      <div
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded text-gray-600"
            >
              →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDatesForMonth().map((date, index) => (
              <div
                key={index}
                onMouseEnter={() => date && setHoverDate(date)}
                onClick={() => date && handleDateClick(date)}
                className={`
                  h-8 flex items-center justify-center rounded cursor-pointer
                  ${!date ? 'invisible' : ''}
                  ${isInRange(date) ? 'bg-blue-100' : 'hover:bg-gray-100'}
                  ${date && date.getTime() === selectedRange.start?.getTime() ? 'bg-blue-500 text-white' : ''}
                  ${date && date.getTime() === selectedRange.end?.getTime() ? 'bg-blue-500 text-white' : ''}
                `}
              >
                {date?.getDate()}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setSelectedRange({ start: null, end: null });
                setIsOpen(false);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!selectedRange.start || !selectedRange.end}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;