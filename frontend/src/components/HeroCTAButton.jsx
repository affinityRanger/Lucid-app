// src/components/HeroCTAButton.jsx

export default function HeroCTAButton({ label = "Get Started Today", href = "#resources" }) {
  return (
    <a
      href={href}
      className="inline-block rounded-full bg-gradient-to-r from-green-700 to-green-500 px-8 py-3 font-semibold text-white shadow-lg hover:-translate-y-1 transition"
    >
      {label}
    </a>
  );
}
