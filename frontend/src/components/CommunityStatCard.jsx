// src/components/CommunityStatCard.jsx

export default function CommunityStatCard({ number, label }) {
  return (
    <div>
      <span className="block text-3xl font-extrabold text-green-700">
        {number}
      </span>
      <span className="text-slate-600">{label}</span>
    </div>
  );
}
