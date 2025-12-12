"use client";
import React from "react";

interface RadioOption {
  label?: string; // tetap support string label sederhana
  value: string | number;
  disabled?: boolean;
  // jika butuh konten kompleks (icon, deskripsi, badge), isi `content`
  content?: React.ReactNode;
  // optional additional meta class
  className?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selected: string | number;
  onChange: (value: string | number) => void;
  /**
   * Optional: custom renderer untuk setiap option.
   * Jika diberikan, fungsi ini akan dipakai untuk merender isi option.
   * Jika tidak, component akan memakai `option.content` (jika ada) atau `option.label`.
   */
  renderOption?: (opt: RadioOption) => React.ReactNode;
  className?: string;
  optionClassName?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selected,
  onChange,
  renderOption,
  className,
  optionClassName,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {options.map((opt) => {
        const isChecked = selected === opt.value;
        const disabled = Boolean(opt.disabled);

        // default content: prefer .content (JSX) > .label (string)
        const defaultContent = opt.content ?? (opt.label ?? opt.value);

        const contentNode = renderOption ? renderOption(opt) : defaultContent;

        return (
          <label
            key={opt.value}
            className={`flex items-center gap-2 cursor-pointer group ${opt.className ?? ""} ${optionClassName ?? ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-disabled={disabled}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isChecked}
              onChange={() => !disabled && onChange(opt.value)}
              disabled={disabled}
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
                ${disabled ? "text-gray-400" : ""}
              `}
            >
              {contentNode}
            </span>
          </label>
        );
      })}
    </div>
  );

  // contoh penggunaan (tetap ada sebagai komentar):
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
  //
  // contoh kompleks (mengisi content secara dinamis):
  // <RadioGroup
  //   name="shipping"
  //   options={[
  //     { value: "jne", content: (<div className="flex items-center gap-2"><img src="/jne.png" alt="jne" className="w-6 h-6" /><div><div className="font-medium">JNE</div><div className="text-xs text-gray-500">Reguler (2-3 hari)</div></div></div>) },
  //     { value: "pos", content: (<div><div className="font-medium">POS</div><div className="text-xs text-gray-500">Next day</div></div>) },
  //   ]}
  //   selected={selectedShipper}
  //   onChange={setSelectedShipper}
  // />
  //
  // contoh dengan renderOption:
  // <RadioGroup
  //   name="example"
  //   options={[{value: "a", label: "A"}, {value: "b", label: "B"}]}
  //   selected={sel}
  //   onChange={setSel}
  //   renderOption={(opt) => <div className="flex items-center gap-2"><strong>{opt.label}</strong><span className="text-xs text-gray-500"> — kode {opt.value}</span></div>}
  // />
};

export default RadioGroup;
