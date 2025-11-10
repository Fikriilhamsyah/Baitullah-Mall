"use client";
import React from "react";

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

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selected,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
            className={`
              w-4 h-4 border-gray-300
              text-primary-500 focus:ring-primary-500
              checked:bg-primary-500 checked:border-primary-500
              transition-colors duration-200
              hover:border-primary-500
            `}
          />
          <span
            className={`
              text-gray-700 text-sm md:text-md
              group-hover:text-primary-600 transition-colors
            `}
          >
            {opt.label}
          </span>
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
