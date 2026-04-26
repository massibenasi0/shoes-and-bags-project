import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerSchema, RegisterFormData } from "../../utils/validators";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { register as registerUser } from "../../store/authSlice";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t("auth.full_name")}
        type="text"
        autoComplete="name"
        error={errors.full_name?.message}
        {...register("full_name")}
      />
      <Input
        label={t("auth.email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("auth.password")}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        {t("auth.register")}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t("auth.have_account")}{" "}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">
          {t("auth.sign_in")}
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
