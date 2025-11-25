import { useState } from "react";
import CompanyCard from "./Components/CompanyCard";
import CreateFitnessHubsModel from "./Components/CreateFitnessHubsModel";

export default function FitnessHubs() {
  const [open, setOpen] = useState(false);

  const companies = [
    {
      plan: "Lifetime Plan",
      name: "Community Plus",
      email: "tapadir20@gmail.com",
      date: "2025-10-12",
      time: "12:01:49",
      stats: [3, 0, 0, 0],
    },
    {
      plan: "Free Plan",
      name: "Nex Gen Allied Services",
      email: "admin@nexgen.com",
      date: "2025-11-23",
      time: "16:27:21",
      stats: [1, 0, 0, 0],
    },
    {
      plan: "Free Plan",
      name: "MindBoxx India",
      email: "manzoor@mindboxxindia.com",
      date: "2025-11-21",
      time: "12:17:10",
      stats: [1, 0, 0, 0],
    },
  ];

  return (
    <div className="p-6 dark:bg-[#09090B] min-h-screen transition-all">
      {/* Grid */}
      <div className="grid grid-cols-4 gap-6">
        {companies.map((item, i) => (
          <CompanyCard key={i} {...item} />
        ))}

        {/* Create Company Card */}
        <div
          onClick={() => setOpen(true)}
          className="border-2 border-gray-300 dark:border-gray-700 
          rounded-xl flex flex-col items-center justify-center cursor-pointer 
          hover:border-black dark:hover:border-white transition p-4 
          bg-white dark:bg-[#0D0D0F]"
        >
          <div
            className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black 
          flex items-center justify-center rounded-lg text-3xl"
          >
            +
          </div>
          <h3 className="font-medium mt-3 text-lg dark:text-white">
            Create Company
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click here to add new company
          </p>
        </div>
      </div>

      <CreateFitnessHubsModel isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
