type CaloriesDisplayProps = {
  calories: number;
  text: string;
  variant?: "positive" | "negative";
};


export default function CaloriesDisplay({
  calories,
  text,
  variant = "positive",
}: CaloriesDisplayProps) {
  const colorClass =
    variant === "negative" ? "text-red-500" : "text-lime-400";

  return (
    <p className="text-white font-bold rounded-2xl grid grid-cols-1 gap-3 text-center bg-slate-800 px-10 py-6 shadow">
      <span className={`font-black text-5xl ${colorClass}`}>
        {calories}
      </span>
      <span className="uppercase tracking-wide text-sm text-slate-300">
        {text}
      </span>
    </p>
  );
}

