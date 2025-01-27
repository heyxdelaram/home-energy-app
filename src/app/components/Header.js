import React from "react";
import {FaCalendarAlt} from "react-icons/fa";
const formatShortDate = (date) => {
  return date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDetailedDate = (date) => {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  });
};
function Header({ user }) {
  const todayDate = new Date();
  return (
    <header className="">
      <div className="flex justify-between items-center">
        <div>
          {user && user.user_metadata && user.user_metadata.first_name ? (
            <h1 className="text-3xl font-bold text-gray-700">
              Hello, {user.user_metadata.first_name}
            </h1>
          ) : (
            <h1 className="text-3xl font-bold text-gray-700">Hello, User</h1>
          )}
          <p className="text-gray-600">Track your energy consumption</p>
        </div>
          <div className="bg-gray-100 flex flex-row gap-2 px-4 py-2 rounded-full shadow-sm text-sm text-black">
            <FaCalendarAlt/>
            <span>{formatShortDate(todayDate)}</span>
            <div>
      </div>
        </div>
      </div>
      <div className="bg-gray-100 text-sm font-semibold text-gray-500 p-2 rounded-full mt-4">
        <p>⚠️ You have 3 unassigned monthly reports.</p>
      </div>
    </header>
  );
}

export default Header;
