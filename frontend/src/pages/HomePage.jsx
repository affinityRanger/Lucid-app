// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../sections/Hero';         // Correct path for Hero.jsx
import Features from '../sections/Features'; // Correct path for Features.jsx
import Categories from '../sections/Categories'; // Correct path for Categories.jsx
import Footer from '../sections/Footer';     // <--- ADDED: Correct path for Footer.jsx

// You can continue to add any other components you want to use on the homepage
// from 'sections' or 'components'. For example:
// import StatBox from '../components/StatBox';
// import CommunitySection from '../sections/Community'; // If you have a dedicated Community section for home page

function HomePage() {
  return (
    <div>
      {/* Render your Hero section */}
      <Hero />

      {/* Example: Render a Features section */}
      <Features />

      {/* Example: Render a Categories section */}
      <Categories />

      {/* You can add more components here as needed, e.g.: */}
      {/* <StatBox /> */}
      {/* <CommunitySection /> */}


      {/* Your existing home page content (if any, typically you'd replace this with components) */}
      <h1>Welcome to Home Page!</h1>
      <p>This is where your main home page content will reside, built from various sections.</p>

      {/* Render your Footer component here */}
      <Footer /> {/* <--- ADDED: Render the Footer */}
    </div>
  );
}

export default HomePage;