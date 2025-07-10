// src/components/StatBox.jsx

export default function StatBox({ number, label }) {
  return (
    <div className="text-center">
      <span className="block text-3xl font-extrabold text-green-700">
        {number}
      </span>
      <span className="text-slate-600">{label}</span>
    </div>
  );
}
