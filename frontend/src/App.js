import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./sections/Header";
import HomePage from "./pages/HomePage";
import Marketplace from "./pages/Marketplace";
import Community from "./sections/Community";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Join from "./pages/Join";
import DiscussionsPage from "./pages/DiscussionsPage";
import EventsPage from "./pages/EventsPage";
import ListingDetail from "./pages/listingDetail";
import SingleDiscussionPostPage from "./pages/SingleDiscussionPostPage";
import EditDiscussionPage from './pages/EditDiscussionPage';
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/marketplace" element={<PageWrapper><Marketplace /></PageWrapper>} />
        <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/join" element={<PageWrapper><Join /></PageWrapper>} />
        <Route path="/community/discussions" element={<PageWrapper><DiscussionsPage /></PageWrapper>} />
        <Route path="/community/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
        <Route path="/community/discussions/:id" element={<PageWrapper><SingleDiscussionPostPage /></PageWrapper>} />
        <Route path="/community/discussions/edit/:id" element={<PageWrapper><EditDiscussionPage /></PageWrapper>} />
        <Route path="/listing/:id" element={<PageWrapper><ListingDetail /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Header />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
