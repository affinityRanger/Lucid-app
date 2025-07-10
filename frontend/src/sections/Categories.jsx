import CategoryCard from "../components/CategoryCard";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const navigate = useNavigate();

  const cats = [
    { icon: "🚜", label: "Tractors & Machinery" },
    { icon: "🔧", label: "Tools & Equipment" },
    { icon: "🌾", label: "Seeds & Crops" },
    { icon: "💧", label: "Irrigation Systems" },
    { icon: "🧪", label: "Fertilisers & Chemicals" },
    { icon: "🏗️", label: "Infrastructure" },
    { icon: "📱", label: "Farm Technology" },
    { icon: "🎓", label: "Education & Training" },
  ];

  const handleCardClick = () => {
    navigate("/marketplace");
  };

  return (
    <section className="bg-white/90 py-16 backdrop-blur" id="marketplace">
      <h2 className="mb-12 text-center text-3xl font-bold text-green-800">
        Resource Categories
      </h2>
      <div className="container mx-auto grid gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cats.map((cat) => (
          <div key={cat.label} onClick={handleCardClick} className="cursor-pointer">
            <CategoryCard {...cat} />
          </div>
        ))}
      </div>
    </section>
  );
}
