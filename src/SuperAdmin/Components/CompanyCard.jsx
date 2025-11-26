import { FiClock, FiCalendar, FiMoreVertical } from "react-icons/fi";

export default function CompanyCard({
  plan = "Free Plan",
  name = "Unnamed Gym",
  email = "--",
  date,
  time,
  stats = [],
}) {
  return (
    <div
      className="w-full bg-white dark:bg-[#0D0D0F] rounded-xl shadow-2xl 
      border border-gray-400 dark:border-gray-700 p-4 transition-all"
    >
      {/* Plan Tag */}
      <div
        className="text-xs font-semibold px-2 py-1 inline-block rounded-md 
        bg-gray-900 dark:bg-white text-white dark:text-black mb-3"
      >
        {plan}
      </div>

      {/* Logo + Name */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg 
          flex items-center justify-center"
        >
          <span className="text-gray-500 dark:text-gray-300 text-xl">🏢</span>
        </div>

        <div className="flex-1">
          <h2 className="text-base font-semibold dark:text-white">{name}</h2>
        </div>

        <FiMoreVertical className="text-gray-500 dark:text-gray-300 cursor-pointer" />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-wrap">
        {email}
      </p>

      {/* Date – Time */}
      <div
        className="flex items-center gap-4 mt-4 text-sm 
        text-gray-600 dark:text-gray-400"
      >
        <div className="flex items-center gap-1">
          <FiCalendar />
          <span>{date || "--"}</span>
        </div>

        <div className="flex items-center gap-1">
          <FiClock />
          <span>{time || "--"}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          className="bg-[#FF0000] dark:bg-white text-white dark:text-black 
          rounded-md px-4 py-2 text-sm w-full"
        >
          Upgrade Plan
        </button>

        <button
          className="bg-black dark:bg-[#FF0000]
          text-white dark:text-purple-200 rounded-md px-4 py-2 
          text-sm w-full"
        >
          Admin Hub
        </button>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Plan Expired : Lifetime
      </p>

      {/* Stats (Optional) */}
      {stats?.length > 0 && (
        <div className="flex gap-3 mt-3">
          {stats.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-8 h-8 
              rounded-md bg-pink-200 dark:bg-pink-900 text-sm 
              text-black dark:text-white"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
