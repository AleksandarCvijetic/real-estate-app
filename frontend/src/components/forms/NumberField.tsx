interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  step?: number | "any";
  required?: boolean;
}

export function NumberField({ label, value, onChange, min = 0, step = 1, required = false }: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        className="control"
        type="number"
        min={min}
        step={step}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
