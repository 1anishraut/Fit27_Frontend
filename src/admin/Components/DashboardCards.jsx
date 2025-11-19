import { NavLink } from "react-router-dom";

const DashboardCard = ({ icon, title, route }) => {
  return (
    <NavLink
      to={route}
      className="border border-blue-900 rounded-md p-6 flex flex-col items-center 
                 gap-3 hover:shadow-md hover:-translate-y-1 transition cursor-pointer
                 bg-white"
    >
      <div className="bg-blue-200 p-2 rounded-full text-blue-900 text-2xl">
        {icon}
      </div>
      <p className="text-blue-900 font-semibold text-lg">{title}</p>
    </NavLink>
  );
};

export default DashboardCard;
