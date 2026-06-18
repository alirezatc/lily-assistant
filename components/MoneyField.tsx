"use client";
export default function MoneyField({
  label, value, onChange, prefix = "$", placeholder = "0.00",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-gray-700">
      {label}
      <div className="mt-1 flex items-center rounded-2xl glass focus-within:border-brand">
        <span className="pl-4 text-brand">{prefix}</span>
        <input
          type="text"
          inputMode="decimal"
          className="w-full rounded-2xl bg-transparent p-3 text-lg outline-none"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value;
            // allow only numbers + one dot; empty allowed so backspace clears
            if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(v);
          }}
        />
      </div>
    </label>
  );
}
