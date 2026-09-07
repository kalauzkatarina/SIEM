import { useState } from "react";

type Option = {
  label: string;
  value: string | number;
};

type GraphParametersSelectProps = {
  value: string | number;
  options: Option[];
  onChange: (value: string | number) => void;
  placeholder?: string;
};

export default function GraphParametersSelect({
  value,
  options,
  onChange,
  placeholder = "Select",
}: GraphParametersSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between border! border-gray-300! bg-white hover:bg-gray-100! text-gray-800 rounded-[10px]! w-[180px]! h-[40px]! px-3 cursor-pointer outline-none transition-colors"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          width={16}
          height={16}
          fill="none"
          viewBox="0 0 24 24"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute mt-[10px]! border! border-gray-300! bg-white rounded-[15px]! w-[185px]! z-20 shadow-xl">
          <ul 
            className="p-[6px]! list-none! text-[14px] font-[500] m-0 max-h-[250px] overflow-y-auto 
            scrollbar-thin scrollbar-thumb-[#5a5a5a] scrollbar-track-transparent"
          >
            {options.map((opt, index) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`h-[40px] px-[12px]! flex items-center text-gray-800 cursor-pointer hover:bg-gray-100! transition-colors
                ${index !== options.length - 1 ? "border-b border-[#5a5a5a]" : ""} 
                ${index === 0 ? "rounded-t-[10px]" : ""} 
                ${index === options.length - 1 ? "rounded-b-[10px]" : ""}`}
              >
                <span className="truncate">{opt.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}