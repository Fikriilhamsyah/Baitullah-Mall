"use client";
import React from "react";

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (value: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, selected, onChange }) => {
  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            value={opt.value}
            checked={selected.includes(opt.value)}
            onChange={() => toggleValue(opt.value)}
            className="w-4 h-4 text-brand-dark focus:ring-brand-light border-gray-300 rounded"
          />
          <span className="text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>

    // const [preferences, setPreferences] = useState<string[]>([]);

    // <CheckboxGroup
    //     options={[
    //         { label: "Berlangganan Newsletter", value: "newsletter" },
    //         { label: "Setuju Syarat & Ketentuan", value: "terms" },
    //     ]}
    //     selected={preferences}
    //     onChange={setPreferences}
    // />
  );
};

export default CheckboxGroup;
