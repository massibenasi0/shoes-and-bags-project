import React from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";

// Full profile page (edit + order history) is implemented in Phase 3
const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("nav.profile")}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="font-semibold text-gray-900 dark:text-white">{user?.full_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("auth.email")}</p>
          <p className="font-semibold text-gray-900 dark:text-white">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded capitalize ${user?.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}`}>
            {user?.role}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-6 text-center">
        Order history and profile editing coming in Phase 3.
      </p>
    </div>
  );
};

export default UserProfilePage;
