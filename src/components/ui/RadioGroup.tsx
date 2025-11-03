"use client";
import React, { useState } from "react";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selected: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, selected, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-4 h-4 text-brand-dark focus:ring-brand-light border-gray-300"
          />
          <span className="text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>

    // const [gender, setGender] = useState("male");
    
    // <RadioGroup
    //     name="gender"
    //     options={[
    //         { label: "Laki-laki", value: "male" },
    //         { label: "Perempuan", value: "female" },
    //     ]}
    //     selected={gender}
    //     onChange={setGender}
    // />
  );
};

export default RadioGroup;
