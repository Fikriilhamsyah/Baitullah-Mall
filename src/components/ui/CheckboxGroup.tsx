"use client";

import React from "react";

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps<T extends string | number> {
  options: { label: string; value: T }[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

export default function CheckboxGroup<T extends string | number>({
  options,
  selected,
  onChange,
}: CheckboxGroupProps<T>) {
  const toggleValue = (value: T) => {
    const exist = selected.includes(value);
    console.log("toggleValue", value, selected);

    if (exist) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          className="flex items-center gap-2 cursor-pointer"
          key={opt.value}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggleValue(opt.value)}
            className="w-4 h-4 border-gray-300 rounded"
          />
          <span className="text-sm md:text-md text-neutral-700">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
  // const [preferences, setPreferences] = useState<string[]>([]);
  // <CheckboxGroup
  //     options={[
  //         { label: "Berlangganan Newsletter", value: "newsletter" },
  //         { label: "Setuju Syarat & Ketentuan", value: "terms" },
  //     ]}
  //     selected={preferences}
  //     onChange={setPreferences}
  // />
}