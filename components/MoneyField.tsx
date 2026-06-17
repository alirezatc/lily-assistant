"use client";
export default function MoneyField({
  label, value, onChange, step = "0.01", prefix = "$",
}: {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  step?: string;
  prefix?: string;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <div className="mt-1 flex items-center rounded-lg border bg-white">
        <span className="pl-3 text-gray-400">{prefix}</span>
        <input
          type="number"
          inputMode="decimal"
          step={step}
          className="w-full rounded-lg p-3 text-lg outline-none"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </label>
  );
}
