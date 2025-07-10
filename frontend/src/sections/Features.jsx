import FeatureCard from "../components/FeatureCard";

export default function Features() {
  const items = [
    {
      icon: "🚜",
      title: "Equipment Sharing",
      text: "Share and borrow tractors and tools with trusted farmers in your area.",
    },
    {
      icon: "🌱",
      title: "Resource Exchange",
      text: "Swap seeds, fertilisers, pesticides and other inputs.",
    },
    {
      icon: "💡",
      title: "Knowledge Hub",
      text: "Access expert advice, weather updates and market insights.",
    },
  ];

  return (
    <section
      id="resources"
      className="container mx-auto my-16 grid gap-8 px-4 md:grid-cols-3"
    >
      {items.map((item) => (
        <FeatureCard key={item.title} {...item} />
      ))}
    </section>
  );
}
