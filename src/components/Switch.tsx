import clsx from "clsx";

export interface SwitchProps {
  value: boolean;
  onChange?: () => void;
  disabled?: boolean;
}

export default function Switch({ value, onChange, disabled }: SwitchProps) {
  return (
    <label
      className={clsx(
        "relative inline-flex items-center",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={onChange}
        disabled={disabled}
      />
      <div className="w-11 h-6 bg-red-300/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-black/70 after:content-[''] after:absolute after:top-1 after:left-[6px] after:bg-red-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600 peer-disabled:opacity-20" />
    </label>
  );
}
