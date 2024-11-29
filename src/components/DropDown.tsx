import { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  onClickOutside: () => void;
}

const Dropdown = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  onClickOutside,
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClickOutside]);

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <div
        onClick={onToggle}
        className="flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-200 cursor-pointer text-white"
      >
        <span>{value}</span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 animate-dropdown text-white">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                onSelect(option);
              }}
              className="p-3 hover:bg-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
