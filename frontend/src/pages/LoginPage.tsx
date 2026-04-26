import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCurrentUser, setTokensFromUrl } from "../store/authSlice";
import LoginForm from "../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  // Handle Google OAuth redirect with tokens in URL params
  useEffect(() => {
    const access = searchParams.get("access_token");
    const refresh = searchParams.get("refresh_token");
    if (access && refresh) {
      dispatch(setTokensFromUrl({ access_token: access, refresh_token: refresh }));
      dispatch(fetchCurrentUser());
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("auth.login")}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back!</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
