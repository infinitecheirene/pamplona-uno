"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Send } from "lucide-react";
import Image from "next/image";

interface Message {
  type: "bot" | "user";
  text: string;
  quickReplies?: string[];
}

export default function Chatbot() {
  const pathname = usePathname();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPromoMessage, setShowPromoMessage] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text:
        "Hello! 👋 Welcome to the Pamplona Uno Citizen Assistant.\n\n" +
        "I can help you find information about barangay services, documents, office hours, community programs, and contact details.\n\n" +
        "What would you like to know?",
      quickReplies: [
        "Barangay Services",
        "Requirements",
        "Office Hours",
        "Contact Us",
        "Emergency",
        "About Pamplona Uno",
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide chatbot on dashboard, login, and register routes
  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage;

    if (messageToSend.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: messageToSend,
      },
    ]);

    setTimeout(() => {
      const botResponse = getBotResponse(messageToSend);

      setMessages((prev) => [...prev, botResponse]);
    }, 700);

    setInputMessage("");
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const getBotResponse = (message: string): Message => {
    const lowerMessage = message.toLowerCase().trim();

    /*
    |--------------------------------------------------------------------------
    | GREETINGS
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage.includes("kumusta") ||
      lowerMessage.includes("musta")
    ) {
      return {
        type: "bot",
        text:
          "Hello! 👋 Kumusta!\n\n" +
          "I'm the Pamplona Uno Citizen Assistant. " +
          "I can help you with barangay services, requirements, schedules, " +
          "community programs, and other general inquiries.\n\n" +
          "How may I assist you today?",
        quickReplies: [
          "Barangay Services",
          "Requirements",
          "Office Hours",
          "Contact Us",
          "Emergency",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | ABOUT BARANGAY
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("about") ||
      lowerMessage.includes("pamplona uno") ||
      lowerMessage.includes("barangay information")
    ) {
      return {
        type: "bot",
        text:
          "🏘️ About Barangay Pamplona Uno\n\n" +
          "Barangay Pamplona Uno is a community in Las Piñas City, Metro Manila. " +
          "The barangay serves residents through local programs, public services, " +
          "community activities, and initiatives focused on safety, health, " +
          "environment, and community development.\n\n" +
          "Our goal is to provide accessible and responsive barangay services " +
          "while encouraging residents to actively participate in building a " +
          "safe, organized, and progressive community.",
        quickReplies: [
          "Our Mission",
          "Our Vision",
          "Community Programs",
          "Contact Us",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | MISSION
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("mission") ||
      lowerMessage === "our mission"
    ) {
      return {
        type: "bot",
        text:
          "🎯 Our Mission\n\n" +
          "To provide responsive, accessible, and community-centered barangay " +
          "services that promote the welfare, safety, and development of residents " +
          "of Pamplona Uno.\n\n" +
          "We strive to serve residents with integrity, transparency, respect, " +
          "and a strong commitment to public service.",
        quickReplies: [
          "Our Vision",
          "Our Values",
          "Community Programs",
          "Contact Us",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | VISION
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("vision") ||
      lowerMessage === "our vision"
    ) {
      return {
        type: "bot",
        text:
          "🌟 Our Vision\n\n" +
          "A safe, peaceful, inclusive, and progressive Barangay Pamplona Uno " +
          "where residents, families, organizations, and local leaders work " +
          "together toward a better quality of life.\n\n" +
          "We envision a community where public services are accessible, " +
          "residents are informed and engaged, and community development is " +
          "supported through cooperation and responsible citizenship.",
        quickReplies: [
          "Our Mission",
          "Our Values",
          "Community Programs",
          "Services",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | VALUES
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("values") ||
      lowerMessage === "our values"
    ) {
      return {
        type: "bot",
        text:
          "💎 Our Community Values\n\n" +
          "• Malasakit – Caring for residents and the community\n" +
          "• Integrity – Acting honestly and responsibly\n" +
          "• Transparency – Promoting clear and accountable public service\n" +
          "• Unity – Working together for common goals\n" +
          "• Respect – Treating every resident with dignity\n" +
          "• Service – Putting community needs at the heart of our work",
        quickReplies: [
          "Our Mission",
          "Our Vision",
          "Community Programs",
          "Contact Us",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | COMMUNITY PROGRAMS
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("program") ||
      lowerMessage.includes("community programs") ||
      lowerMessage.includes("activities")
    ) {
      return {
        type: "bot",
        text:
          "🤝 Community Programs & Activities\n\n" +
          "Barangay programs may include:\n\n" +
          "• Community clean-up and environmental activities\n" +
          "• Health and wellness programs\n" +
          "• Senior citizen and PWD assistance\n" +
          "• Youth and sports development activities\n" +
          "• Community meetings and assemblies\n" +
          "• Disaster preparedness activities\n" +
          "• Livelihood and skills development initiatives\n" +
          "• School and community coordination\n\n" +
          "Schedules may vary depending on the program and available resources.",
        quickReplies: [
          "Health Services",
          "Senior & PWD",
          "Youth Programs",
          "Emergency",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICES
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("service") ||
      lowerMessage.includes("services") ||
      lowerMessage === "barangay services"
    ) {
      return {
        type: "bot",
        text:
          "🏛️ Barangay Services\n\n" +
          "Common barangay services include:\n\n" +
          "📋 Barangay Clearance\n" +
          "📄 Certificate of Residency\n" +
          "📄 Certificate of Indigency\n" +
          "📄 Certificate of Good Moral Character\n" +
          "🪪 Barangay ID assistance\n" +
          "🏢 Business permit assistance / barangay endorsement\n" +
          "📝 Barangay blotter and incident reporting\n" +
          "⚖️ Community dispute mediation\n" +
          "👴 Senior citizen assistance\n" +
          "♿ PWD assistance\n" +
          "🏥 Health and community wellness programs\n\n" +
          "Select a service below to learn more.",
        quickReplies: [
          "Barangay Clearance",
          "Residency Certificate",
          "Indigency Certificate",
          "Business Permit",
          "Blotter",
          "Mediation",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | REQUIREMENTS
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("requirement") ||
      lowerMessage.includes("requirements") ||
      lowerMessage === "documents"
    ) {
      return {
        type: "bot",
        text:
          "📑 General Document Requirements\n\n" +
          "Requirements depend on the service you are requesting. " +
          "You may commonly be asked to provide:\n\n" +
          "• Valid government-issued ID\n" +
          "• Proof of residency\n" +
          "• Cedula, when applicable\n" +
          "• Supporting documents related to your request\n" +
          "• Proof of purpose, when required\n\n" +
          "Please confirm the specific requirements with the barangay office " +
          "before visiting, as requirements may vary depending on your request.",
        quickReplies: [
          "Barangay Clearance",
          "Indigency Certificate",
          "Residency Certificate",
          "Business Permit",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | BARANGAY CLEARANCE
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("clearance") ||
      lowerMessage === "barangay clearance"
    ) {
      return {
        type: "bot",
        text:
          "📋 Barangay Clearance\n\n" +
          "Barangay clearance is commonly requested for employment, business, " +
          "school, transactions, and other official purposes.\n\n" +
          "Common requirements may include:\n" +
          "• Valid ID\n" +
          "• Proof of residency\n" +
          "• Cedula, when applicable\n" +
          "• Purpose of request\n" +
          "• Applicable processing fee\n\n" +
          "For the exact requirements, fees, and processing time, please contact " +
          "the barangay office before visiting.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Other Services",
          "Requirements",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | RESIDENCY
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("residency") ||
      lowerMessage.includes("residence certificate") ||
      lowerMessage.includes("certificate of residency")
    ) {
      return {
        type: "bot",
        text:
          "🏠 Certificate of Residency\n\n" +
          "A Certificate of Residency may be requested as proof that a person " +
          "resides within the barangay.\n\n" +
          "You may be asked for:\n" +
          "• Valid ID\n" +
          "• Proof of address or residency\n" +
          "• Barangay Clearance, when applicable\n" +
          "• Purpose of certification\n\n" +
          "Additional verification may be required depending on your situation.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Barangay Clearance",
          "Requirements",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | INDIGENCY
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("indigency") ||
      lowerMessage.includes("certificate of indigency")
    ) {
      return {
        type: "bot",
        text:
          "📄 Certificate of Indigency\n\n" +
          "A Certificate of Indigency may be issued to qualified residents " +
          "for purposes such as medical assistance, educational assistance, " +
          "legal assistance, and other social support requirements.\n\n" +
          "Possible requirements include:\n" +
          "• Valid ID\n" +
          "• Proof of residency\n" +
          "• Statement or proof of purpose\n" +
          "• Supporting documents, when applicable\n\n" +
          "The barangay may conduct verification or assessment before issuance.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Other Services",
          "Requirements",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | BUSINESS PERMIT
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("business permit") ||
      lowerMessage.includes("business") ||
      lowerMessage.includes("permit")
    ) {
      return {
        type: "bot",
        text:
          "🏢 Business Permit Assistance\n\n" +
          "The barangay may assist business owners with barangay clearance " +
          "or endorsement requirements related to business permit applications.\n\n" +
          "Common documents may include:\n" +
          "• Valid ID\n" +
          "• Business registration documents\n" +
          "• Proof of business location\n" +
          "• Barangay clearance requirements\n" +
          "• Other documents requested by the appropriate office\n\n" +
          "City permit requirements are handled by the appropriate Las Piñas " +
          "City office. Please verify current requirements before processing.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Barangay Services",
          "Requirements",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | GOOD MORAL
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("good moral") ||
      lowerMessage.includes("moral certificate")
    ) {
      return {
        type: "bot",
        text:
          "✅ Certificate of Good Moral Character\n\n" +
          "This certificate may be requested for employment, school, applications, " +
          "or other official purposes.\n\n" +
          "You may be asked for:\n" +
          "• Valid ID\n" +
          "• Proof of residency\n" +
          "• Purpose of request\n" +
          "• Barangay records verification, when applicable\n\n" +
          "Please contact the barangay office for current requirements and processing details.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Other Services",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | BARANGAY ID
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("barangay id") ||
      lowerMessage === "id"
    ) {
      return {
        type: "bot",
        text:
          "🪪 Barangay ID Assistance\n\n" +
          "For Barangay ID-related concerns, please visit the barangay office " +
          "during designated processing hours.\n\n" +
          "Bring a valid identification document and proof of residency " +
          "when available. Additional requirements may apply depending on " +
          "the type of request.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Barangay Services",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | CEDULA
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("cedula") ||
      lowerMessage.includes("community tax certificate")
    ) {
      return {
        type: "bot",
        text:
          "📄 Cedula / Community Tax Certificate\n\n" +
          "For Cedula or Community Tax Certificate concerns, please visit " +
          "the appropriate barangay or city office handling the transaction.\n\n" +
          "Bring valid identification and the information needed for the " +
          "community tax assessment.\n\n" +
          "Applicable taxes, fees, and requirements depend on the transaction.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Barangay Services",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | BLOTTER / INCIDENT
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("blotter") ||
      lowerMessage.includes("incident") ||
      lowerMessage.includes("report")
    ) {
      return {
        type: "bot",
        text:
          "📝 Barangay Blotter & Incident Reporting\n\n" +
          "Residents may report incidents or community concerns to the barangay " +
          "for proper recording, assessment, or referral.\n\n" +
          "Examples include:\n" +
          "• Neighborhood disputes\n" +
          "• Disturbances\n" +
          "• Lost or recovered property\n" +
          "• Community-related incidents\n" +
          "• Other concerns within the barangay\n\n" +
          "Bring a valid ID and any relevant information, documents, or evidence " +
          "that may help in recording the incident.\n\n" +
          "🚨 For emergencies or situations requiring immediate assistance, call 911.",
        quickReplies: [
          "Emergency",
          "Mediation",
          "Contact Us",
          "Office Hours",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | MEDIATION
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("mediation") ||
      lowerMessage.includes("lupon") ||
      lowerMessage.includes("dispute") ||
      lowerMessage.includes("away")
    ) {
      return {
        type: "bot",
        text:
          "⚖️ Community Mediation\n\n" +
          "The barangay may assist residents in addressing certain community " +
          "disputes through the appropriate barangay justice and mediation process.\n\n" +
          "Concerns may involve:\n" +
          "• Neighbor disputes\n" +
          "• Property-related disagreements\n" +
          "• Community conflicts\n" +
          "• Other disputes covered by the barangay process\n\n" +
          "Please visit the barangay office to discuss your concern and determine " +
          "the appropriate procedure.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Barangay Services",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | HEALTH
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("health") ||
      lowerMessage.includes("medical") ||
      lowerMessage.includes("health center")
    ) {
      return {
        type: "bot",
        text:
          "🏥 Community Health Services\n\n" +
          "Barangay health programs may include:\n\n" +
          "• Basic health consultations\n" +
          "• Health monitoring\n" +
          "• Immunization activities\n" +
          "• Maternal and child health programs\n" +
          "• Nutrition and wellness activities\n" +
          "• Health education\n" +
          "• Community medical missions\n" +
          "• Dental or specialty services during scheduled activities\n\n" +
          "Schedules and available services may change depending on the program.",
        quickReplies: [
          "Community Programs",
          "Office Hours",
          "Contact Us",
          "Emergency",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SENIOR / PWD
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("senior") ||
      lowerMessage.includes("elderly") ||
      lowerMessage.includes("pwd") ||
      lowerMessage.includes("person with disability")
    ) {
      return {
        type: "bot",
        text:
          "👴👵♿ Senior Citizen & PWD Assistance\n\n" +
          "The barangay may provide assistance or referrals for programs intended " +
          "for senior citizens and persons with disabilities.\n\n" +
          "Services may include:\n" +
          "• ID-related assistance\n" +
          "• Program registration or referrals\n" +
          "• Access to city or government programs\n" +
          "• Community assistance activities\n" +
          "• Information about available benefits\n\n" +
          "Please bring the necessary identification and supporting documents " +
          "when visiting the office.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Community Programs",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | EMERGENCY
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("emergency") ||
      lowerMessage.includes("hotline") ||
      lowerMessage.includes("urgent")
    ) {
      return {
        type: "bot",
        text:
          "🚨 Emergency Assistance\n\n" +
          "For immediate emergencies, call 911.\n\n" +
          "Barangay Contact:\n" +
          "📞 (02) 8872-9664\n\n" +
          "For urgent situations involving fire, crime, medical emergencies, " +
          "or threats to life and safety, contact the appropriate emergency " +
          "response service immediately.\n\n" +
          "If the situation is not an emergency, you may contact the barangay " +
          "office for assistance during office hours.",
        quickReplies: [
          "Contact Us",
          "Office Hours",
          "Barangay Services",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | CONTACT
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("contact") ||
      lowerMessage.includes("phone") ||
      lowerMessage.includes("email") ||
      lowerMessage === "contact us"
    ) {
      return {
        type: "bot",
        text:
          "📞 Contact Barangay Pamplona Uno\n\n" +
          "Barangay Office\n" +
          "📍 P1 Metals Rd., Camella 4A\n" +
          "Las Piñas City, Metro Manila\n\n" +
          "☎️ Telephone:\n" +
          "(02) 8872-9664\n\n" +
          "✉️ Email:\n" +
          "barangay.pamplonatres.lpc@gmail.com\n\n" +
          "For urgent emergencies, please call 911.",
        quickReplies: [
          "Office Hours",
          "Visit Us",
          "Emergency",
          "Barangay Services",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | VISIT
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("visit") ||
      lowerMessage.includes("location") ||
      lowerMessage.includes("address") ||
      lowerMessage === "visit us"
    ) {
      return {
        type: "bot",
        text:
          "📍 Visit Barangay Pamplona Uno\n\n" +
          "Barangay Pamplona Uno Office\n" +
          "P1 Metals Rd., Camella 4A\n" +
          "Las Piñas City, Metro Manila\n\n" +
          "Residents may visit the barangay office for inquiries, document " +
          "requests, community concerns, and available public services.\n\n" +
          "Please check office hours before visiting.",
        quickReplies: [
          "Office Hours",
          "Contact Us",
          "Barangay Services",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | OFFICE HOURS
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("hours") ||
      lowerMessage.includes("office hours") ||
      lowerMessage.includes("time") ||
      lowerMessage.includes("schedule")
    ) {
      return {
        type: "bot",
        text:
          "🕐 Barangay Office Hours\n\n" +
          "Monday to Friday\n" +
          "8:00 AM – 5:00 PM\n\n" +
          "Some services, programs, and special activities may follow different " +
          "schedules.\n\n" +
          "For emergencies outside regular office hours, please call 911 or " +
          "the appropriate emergency response service.",
        quickReplies: [
          "Contact Us",
          "Visit Us",
          "Barangay Services",
          "Emergency",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | THANK YOU
    |--------------------------------------------------------------------------
    */
    if (
      lowerMessage.includes("thank") ||
      lowerMessage.includes("salamat") ||
      lowerMessage.includes("thanks")
    ) {
      return {
        type: "bot",
        text:
          "Walang anuman! 😊\n\n" +
          "I'm glad I could help. If you have another question about " +
          "Barangay Pamplona Uno, feel free to ask anytime.\n\n" +
          "Mabuhay ang Pamplona Uno! 🤝",
        quickReplies: [
          "Barangay Services",
          "Contact Us",
          "Office Hours",
          "Emergency",
        ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | DEFAULT RESPONSE
    |--------------------------------------------------------------------------
    */
    return {
      type: "bot",
      text:
        "Thank you for reaching out! 😊\n\n" +
        "I can currently help with:\n\n" +
        "🏛️ Barangay Services\n" +
        "📑 Requirements\n" +
        "🕐 Office Hours\n" +
        "📍 Office Location\n" +
        "📞 Contact Information\n" +
        "🏥 Health Services\n" +
        "👴 Senior Citizen & PWD Assistance\n" +
        "⚖️ Community Mediation\n" +
        "🚨 Emergency Information\n" +
        "🤝 Community Programs\n\n" +
        "Please choose a topic below or type your question.",
      quickReplies: [
        "Barangay Services",
        "Requirements",
        "Office Hours",
        "Contact Us",
        "Emergency",
        "Community Programs",
      ],
    };
  };

  return (
    <>
      {/* Floating Promo Message */}
      {showPromoMessage && !isChatOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl z-50 p-4 max-w-xs border-2 border-brand-secondary-500 animate-bounce-slow">
          <button
            type="button"
            onClick={() => setShowPromoMessage(false)}
            className="absolute -top-2 -right-2 bg-brand-primary-500 text-white rounded-full p-1 hover:bg-brand-primary-600 transition-colors shadow-lg"
            aria-label="Close message"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="bg-brand-secondary-100 p-2 rounded-full flex-shrink-0">
              <Image
                src="/pamplona_tres.png"
                alt="Pamplona Uno Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                priority
              />
            </div>

            <div>
              <p className="font-bold text-gray-800 text-sm mb-1">
                Need Assistance? 💬
              </p>

              <p className="text-gray-600 text-xs leading-relaxed">
                Ask the Pamplona Uno Citizen Assistant about services,
                requirements, schedules, and community information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label={isChatOpen ? "Close Chatbot" : "Open Chatbot"}
      >
        {isChatOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5">
            <Image
              src="/pamplona_tres.png"
              alt="Pamplona Uno Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain animate-pulse"
              priority
            />
          </div>
        )}

        {!isChatOpen && (
          <span className="absolute -top-1 -right-1 bg-brand-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
            1
          </span>
        )}
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-500 text-white p-4 flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Image
                src="/pamplona_tres.png"
                alt="Pamplona Uno Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                priority
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg">
                Pamplona Uno Assistant
              </h3>

              <p className="text-xs text-brand-secondary-100">
                Las Piñas City • Citizen Assistant
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-brand-secondary-700 p-1 rounded transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${
                    message.type === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl break-words ${
                      message.type === "user"
                        ? "bg-brand-secondary-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line break-words overflow-wrap-anywhere leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                </div>

                {/* Quick Replies */}
                {message.type === "bot" &&
                  message.quickReplies &&
                  message.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 justify-start">
                      {message.quickReplies.map((reply, idx) => (
                        <button
                          type="button"
                          key={`${reply}-${idx}`}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3.5 py-2 text-xs bg-white border-2 border-brand-secondary-500 text-brand-secondary-600 rounded-full hover:bg-brand-secondary-500 hover:text-white transition-colors duration-200 shadow-sm"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about barangay services..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-secondary-500 focus:border-transparent text-sm"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="bg-brand-secondary-600 text-white p-2.5 rounded-full hover:bg-brand-secondary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-2">
              For emergencies, please call 911.
            </p>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .fixed.bottom-24.right-6.w-96 {
            width: calc(100vw - 2rem);
            right: 1rem;
            left: 1rem;
            bottom: 5rem;
            height: calc(100vh - 10rem);
            max-height: 550px;
          }

          .fixed.bottom-24.right-6.max-w-xs {
            right: 1rem;
            left: 1rem;
            max-width: calc(100vw - 2rem);
            bottom: 6rem;
          }

          .fixed.bottom-6.right-6 {
            bottom: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </>
  );
}