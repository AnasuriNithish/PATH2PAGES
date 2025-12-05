export default function Widget({ title, value, subtitle }) {
  return (
    <div className="bg-white p-6 rounded shadow flex flex-col">
      <span className="text-sm text-gray-500">{title}</span>
      <span className="text-2xl font-bold mt-2">{value}</span>
      {subtitle && <span className="text-xs text-gray-400 mt-1">{subtitle}</span>}
    </div>
  );
}
