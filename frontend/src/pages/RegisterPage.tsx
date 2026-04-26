import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("auth.register")}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Create your account today</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
