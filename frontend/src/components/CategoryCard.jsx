// src/components/CategoryCard.jsx

export default function CategoryCard({ icon, label }) {
  return (
    <div className="cursor-pointer rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center transition hover:scale-105">
      <span className="mb-2 block text-3xl">{icon}</span>
      <h4 className="font-semibold text-green-700">{label}</h4>
    </div>
  );
}
