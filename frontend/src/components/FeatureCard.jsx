// src/components/FeatureCard.jsx

export default function FeatureCard({ icon, title, text }) {
  return (
    <article className="rounded-2xl bg-white/90 p-8 shadow-lg backdrop-blur hover:-translate-y-2 transition">
      <span className="mb-4 block text-4xl">{icon}</span>
      <h3 className="mb-2 text-xl font-semibold text-green-800">{title}</h3>
      <p className="text-slate-600">{text}</p>
    </article>
  );
}
