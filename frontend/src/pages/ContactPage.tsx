import React from "react";
import { useTranslation } from "react-i18next";

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("contact.title")}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-12">{t("contact.subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">

          {/* Contact 1 */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">Mesroua Abderrahmen Massinissa</p>
                <a
                  href="https://www.linkedin.com/in/mesroua-abderrahmen-massinissa-92b08432a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.027-3.059-1.864-3.059-1.865 0-2.151 1.456-2.151 2.961v5.702h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.002 3.604 4.604v5.592z"/>
                  </svg>
                  LinkedIn Profile
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+48500513960" className="text-gray-900 dark:text-white font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                +48 500 513 960
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:mesrouamassinisaL@gmail.com" className="text-gray-900 dark:text-white font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">
                mesrouamassinisaL@gmail.com
              </a>
            </div>
          </div>

          {/* Contact 2 */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">Jaadi Mohamed</p>
                <a
                  href="https://pl.linkedin.com/in/simo-jaadi-92b209389"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.027-3.059-1.864-3.059-1.865 0-2.151 1.456-2.151 2.961v5.702h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.002 3.604 4.604v5.592z"/>
                  </svg>
                  LinkedIn Profile
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+48787058156" className="text-gray-900 dark:text-white font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                +48 787 058 156
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:jaadisimou80@gmail.com" className="text-gray-900 dark:text-white font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">
                jaadisimou80@gmail.com
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("contact.address")}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Galeria Echo</p>
              <p className="text-gray-600 dark:text-gray-400">Kielce, Poland</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("contact.hours")}</p>
              <p className="text-gray-900 dark:text-white font-medium">{t("contact.hours_weekdays")}</p>
              <p className="text-gray-900 dark:text-white font-medium">{t("contact.hours_weekend")}</p>
            </div>
          </div>
        </div>

        {/* Map placeholder + message card */}
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <a
              href="https://maps.google.com/?q=Galeria+Echo+Kielce+Poland"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-sm font-medium">{t("contact.view_map")}</span>
            </a>
          </div>

          <div className="rounded-2xl bg-primary-600 p-6 text-white">
            <h3 className="font-bold text-lg mb-2">{t("contact.online_support")}</h3>
            <p className="text-primary-100 text-sm mb-4">{t("contact.online_support_desc")}</p>
            <a
              href="mailto:mesrouamassinisaL@gmail.com"
              className="inline-block bg-white text-primary-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
            >
              {t("contact.send_email")}
            </a>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ContactPage;
