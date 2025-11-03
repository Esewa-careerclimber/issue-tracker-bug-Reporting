import React from "react";
import "./LandingSecond.css";
import { FaRobot, FaChartLine, FaBolt, FaCopy, FaChartBar, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <FaRobot />,
    title: "AI Auto-Categorization",
    description:
      "Automatically categorize and tag issues based on content, saving hours of manual work.",
  },
  {
    icon: <FaChartLine />,
    title: "Smart Prioritization",
    description:
      "AI analyzes impact and urgency to prioritize bugs that matter most to your users.",
  },
  {
    icon: <FaBolt />,
    title: "Instant Insights",
    description:
      "Get real-time analytics and insights into your bug trends and team performance.",
  },
  {
    icon: <FaCopy />,
    title: "Duplicate Detection",
    description:
      "Automatically detect and merge duplicate issues to keep your board clean.",
  },
  {
    icon: <FaChartBar />,
    title: "Advanced Analytics",
    description:
      "Powerful reporting tools to track resolution times and team productivity.",
  },
  {
    icon: <FaUsers />,
    title: "Smart Assignments",
    description:
      "AI suggests the best team member to handle each issue based on expertise.",
  },
];

const LandingSecond = () => {
  return (
    <section id="features" className="landing-container">
      <div className="landing-header">
        <h2 className="landing-title">Powered by Intelligence</h2>
        <p className="landing-subtitle">
          Advanced AI features that make bug tracking effortless
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="icon-wrapper">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingSecond;
