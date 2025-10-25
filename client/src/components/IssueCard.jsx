import React from "react";
import { FaBug, FaLightbulb, FaComments, FaClipboardList } from "react-icons/fa";

const IssueCard = ({ issue }) => {
  const getIcon = (type) => {
    switch (type) {
      case "Bug":
        return <FaBug className="text-red-500 text-lg" />;
      case "Feature Request":
        return <FaLightbulb className="text-yellow-500 text-lg" />;
      case "Feedback":
        return <FaComments className="text-green-500 text-lg" />;
      default:
        return <FaClipboardList className="text-blue-500 text-lg" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition duration-200 border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        {getIcon(issue.type)}
        <h2 className="text-lg font-semibold text-gray-800">{issue.title}</h2>
      </div>

      <p className="text-sm text-gray-600 mb-3">{issue.description}</p>

      <div className="flex flex-wrap items-center justify-between text-sm">
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
          {issue.type}
        </span>
        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">
          {issue.severity}
        </span>
        <span className={`px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
          {issue.status}
        </span>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Created on: {issue.createdAt}
      </p>
    </div>
  );
};

export default IssueCard;
