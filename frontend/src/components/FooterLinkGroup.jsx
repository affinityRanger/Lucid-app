// src/components/FooterLinkGroup.jsx

export default function FooterLinkGroup({ title, links }) {
  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-green-200">{title}</h3>
      {links.map((l) => (
        <p
          key={l}
          className="text-sm hover:text-green-200 cursor-pointer"
        >
          {l}
        </p>
      ))}
    </section>
  );
}
