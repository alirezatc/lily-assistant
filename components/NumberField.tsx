"use client";
export default function NumberField({
  label, value, onChange, suffix, placeholder = "", min, max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block text-sm font-semibold text-gray-700">
      {label}
      <div className="mt-1 flex items-center rounded-2xl border border-pink-100 bg-white shadow-sm focus-within:border-brand">
        <input
          type="text"
          inputMode="numeric"
          className="w-full rounded-2xl bg-transparent p-3 text-lg outline-none"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value;
            const intMode = min != null || max != null;
            const ok = v === "" || (intMode ? /^\d*$/.test(v) : /^\d*\.?\d*$/.test(v));
            if (ok) {
              if (v === "") return onChange(v);
              let n = parseFloat(v);
              if (min != null && n < min) return onChange(String(min));
              if (max != null && n > max) return onChange(String(max));
              onChange(v);
            }
          }}
        />
        {suffix && <span className="pr-4 text-gray-400">{suffix}</span>}
      </div>
    </label>
  );
}
