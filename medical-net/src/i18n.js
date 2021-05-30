import i18n from 'i18next';
import {initReactI18next} from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: {
                    "sign_out": "Sign out",
                    "nav.home": "Home",
                    "nav.doctors": "Doctors",
                    "nav.medical_records": "Medical Records",
                    "nav.faq": "FAQ",
                    "nav.dashboard": "Dashboard",

                    "footer.rights_reserved": "All rights reserved.",

                    "home.heading": "One platform. All your medical history, securely accessible from everywhere.",
                    "home.feature1": "Find the best doctor to your needs. Explore doctors by specialty or hospital, together with their ratings",
                    "home.feature2": "Store all your medical history in a safe place, accessible only to you and to your doctors",

                    "faq.contact_us": "Contact us",
                    "faq.send_questions": "Send us your questions and we will reply you on the email as soon as possibile.",
                    "faq.faq": "Frequently Asked Questions",

                    "doctors.new": "New",
                    "doctors.export": "Export",
                    "doctors.filter": "Filter",
                }
            },
            ro: {
                translations: {
                    "sign_out": "Deconectare",
                    "nav.home": "Acasă",
                    "nav.doctors": "Medici",
                    "nav.medical_records": "Istoric medical",
                    "nav.faq": "FAQ",
                    "nav.dashboard": "Panou de control",

                    "footer.rights_reserved": "Toate drepturile rezervate.",

                    "home.heading": "O unică platformă. Tot istoricul tău medical, accesibil în mod sigur de oriunde.",
                    "home.feature1": "Găsește cel mai bun medic pentru nevoile tale personale. Explorează lista de medici în funcție de specialitate sau spital",
                    "home.feature2": "Salvează toate înregistrările tale medicale înr-un loc sigur, accesibile doar ție și medicilor tăi",

                    "faq.contact_us": "Contactați-ne",
                    "faq.send_questions": "Trimiteți întrebările dumneavoastră și vă vom răspunde curând prin email.",
                    "faq.faq": "Întrebări frecvente",

                    "doctors.new": "Adăugare înregistrare",
                    "doctors.export": "Export",
                    "doctors.filter": "Filtrare",
                }
            }
        },
        fallbackLng: 'en',
        debug: true,
        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',
        keySeparator: false, // we use content as keys
        interpolation: {
            escapeValue: false, // not needed for react
            formatSeparator: ','
        },
        react: {
            wait: true
        }
    });
export default i18n;