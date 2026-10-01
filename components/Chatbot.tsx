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
      text: "Hi there! 👋 I'm your Pamplona Uno Barangay Assistant. How can I help you today?",
      quickReplies: [
        "Our Mission",
        "Our Vision",
        "Our Values",
        "Contact Info",
        "Office Hours",
        "Services",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide on dashboard, login, and register routes
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

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: messageToSend }]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(messageToSend);
      setMessages((prev) => [...prev, botResponse]);
    }, 800);

    setInputMessage("");
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const getBotResponse = (message: string): Message => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("mission") || lowerMessage === "our mission") {
      return {
        type: "bot",
        text: "🎯 Our Mission:\n\nTo provide efficient, responsive, and inclusive barangay services that promote the welfare and development of every resident of Pamplona Uno.\n\nWe are committed to delivering accessible, transparent, and quality services that address the needs of our community.",
        quickReplies: ["Our Vision", "Our Values", "Contact Info", "Services"],
      };
    } else if (
      lowerMessage.includes("vision") ||
      lowerMessage === "our vision"
    ) {
      return {
        type: "bot",
        text: "🌟 Our Vision:\n\nA progressive, peaceful, and united Barangay Pamplona Uno where every resident enjoys a high quality of life through collaborative governance and sustainable development.\n\nWe envision our barangay as a model community in Las Piñas City, where tradition meets innovation for the betterment of all.",
        quickReplies: ["Our Mission", "Our Values", "Contact Info", "Services"],
      };
    } else if (
      lowerMessage.includes("values") ||
      lowerMessage === "our values"
    ) {
      return {
        type: "bot",
        text: "💎 Our Values:\n\n• Malasakit - We care deeply for our residents\n• Transparency - We operate with honesty and openness\n• Unity - We work together as one community\n• Service Excellence - We deliver the best for our barangay\n\nBarangay Pamplona Uno is dedicated to serving our community with integrity, fostering grassroots participation, and creating opportunities for every resident to thrive.",
        quickReplies: ["Our Mission", "Our Vision", "Visit Us", "Contact Info"],
      };
    } else if (lowerMessage.includes("visit") || lowerMessage === "visit us") {
      return {
        type: "bot",
        text: "📍 Visit Us:\n\nBarangay Pamplona Uno Office\nP1 Metals Rd., Camella 4A\nLas Piñas City, Metro Manila\nPhilippines\n\nWe welcome all residents to visit us for any barangay concerns, assistance, or inquiries. Our staff is ready to serve you!",
        quickReplies: [
          "Office Hours",
          "Contact Info",
          "Services",
          "Our Mission",
        ],
      };
    } else if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("kumusta")
    ) {
      return {
        type: "bot",
        text: "Hello! 👋 Kumusta! How can I help you with Barangay Pamplona Uno services today?",
        quickReplies: [
          "Our Mission",
          "Our Vision",
          "Services",
          "Contact Info",
          "Office Hours",
        ],
      };
    } else if (
      lowerMessage.includes("service") ||
      lowerMessage.includes("services")
    ) {
      return {
        type: "bot",
        text: "🏛️ Barangay Services Available:\n\n• Barangay Clearance\n• Cedula (Community Tax Certificate)\n• Business Permit\n• Indigency Certificate\n• Residency Certificate\n• Good Moral Certificate\n• Barangay Blotter\n\nWhat specific service do you need?",
        quickReplies: ["Clearance", "Cedula", "Business Permit", "Indigency"],
      };
    } else if (
      lowerMessage.includes("contact") ||
      lowerMessage === "contact info"
    ) {
      return {
        type: "bot",
        text: "📞 Contact Us:\n\n• Phone: (02) 8872-9664\n• Email: barangay.pamplonatres.lpc@gmail.com\n• Office: P1 Metals Rd., Camella 4A, Las Piñas, Philippines\n\nFeel free to reach out through any of these channels!",
        quickReplies: ["Office Hours", "Visit Us", "Services", "Our Mission"],
      };
    } else if (
      lowerMessage.includes("hours") ||
      lowerMessage.includes("time") ||
      lowerMessage.includes("schedule") ||
      lowerMessage === "office hours"
    ) {
      return {
        type: "bot",
        text: "🕐 Office Hours:\n\nMonday to Friday\n8:00 AM - 5:00 PM\n\n⚠️ For emergencies, please contact our barangay hotline.\n\nNeed help with a specific service?",
        quickReplies: ["Services", "Contact Info", "Visit Us"],
      };
    } else if (
      lowerMessage.includes("clearance") ||
      lowerMessage.includes("barangay clearance")
    ) {
      return {
        type: "bot",
        text: "📋 Barangay Clearance:\n\nApply for barangay clearance certificate\n\nRequirements:\n• Valid ID\n• Cedula\n• Recent Photo (1x1)\n• Processing Fee\n\nVisit the Barangay Hall during office hours. Processing time is usually same day.\n\nNeed help with anything else?",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Cedula"],
      };
    } else if (
      lowerMessage.includes("barangay id") ||
      lowerMessage.includes("id")
    ) {
      return {
        type: "bot",
        text: "🪪 Need a Barangay ID?\n\nPlease visit the Barangay Hall for ID processing during office hours. Bring valid identification and proof of residency.\n\nWhat else can I help you with?",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (
      lowerMessage.includes("cedula") ||
      lowerMessage.includes("community tax")
    ) {
      return {
        type: "bot",
        text: "📄 Cedula (Community Tax Certificate):\n\nCommunity tax certificate application\n\nRequirements:\n• Valid ID\n• Proof of income (for employed)\n• Real property declaration (if applicable)\n• Payment of tax\n\nVisit the Barangay Hall during office hours.\n\nWhat else can I help you with?",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (
      lowerMessage.includes("business permit") ||
      lowerMessage.includes("permit")
    ) {
      return {
        type: "bot",
        text: "🏢 Business Permit:\n\nBusiness permit assistance for barangay endorsement\n\nRequirements:\n• Valid ID\n• Business registration documents\n• Proof of business location\n• Barangay Clearance\n\nThe barangay will provide endorsement for your city business permit application.\n\nNeed help with anything else?",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (
      lowerMessage.includes("residency") ||
      lowerMessage.includes("residence certificate")
    ) {
      return {
        type: "bot",
        text: "🏠 Residency Certificate:\n\nProof of residency certification\n\nRequirements:\n• Valid ID\n• Proof of residency (utility bills, rental contract, etc.)\n• Barangay Clearance\n• Processing Fee\n\nFor new residents, minimum of 6 months residency may be required.\n\nWhat else can I help you with?",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (
      lowerMessage.includes("good moral") ||
      lowerMessage.includes("moral certificate")
    ) {
      return {
        type: "bot",
        text: "✅ Good Moral Certificate:\n\nCertificate of good moral character\n\nRequirements:\n• Valid ID\n• Barangay Clearance\n• Purpose of certificate (employment, school, etc.)\n• No pending cases in the barangay\n• Processing Fee\n\nVisit the Barangay Hall for processing.\n\nNeed help with anything else?",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (
      lowerMessage.includes("blotter") ||
      lowerMessage.includes("incident") ||
      lowerMessage.includes("report")
    ) {
      return {
        type: "bot",
        text: "📝 Barangay Blotter:\n\nReport and record incidents\n\nYou can file a blotter report for:\n• Theft or lost items\n• Disturbances\n• Minor disputes\n• Incidents within the barangay\n\nVisit the Barangay Hall to file a report. Bring valid ID and any evidence or witnesses if available.\n\nFor emergencies, call our hotline immediately!",
        quickReplies: ["Emergency", "Mediation", "Contact Info", "Services"],
      };
    } else if (
      lowerMessage.includes("health") ||
      lowerMessage.includes("medical") ||
      lowerMessage === "health services"
    ) {
      return {
        type: "bot",
        text: "🏥 Health Services:\n\nAvailable at the Barangay Health Center:\n• Free medical consultations\n• Immunizations for children\n• Prenatal care\n• Family planning\n• Blood pressure monitoring\n• Dental services (schedule varies)\n\nHealth Center Hours: Mon-Fri, 8:00 AM - 4:00 PM",
        quickReplies: ["Office Hours", "Contact Info", "Services"],
      };
    } else if (
      lowerMessage.includes("mediation") ||
      lowerMessage.includes("lupon") ||
      lowerMessage.includes("dispute")
    ) {
      return {
        type: "bot",
        text: "⚖️ Mediation Services (Lupong Tagapamayapa):\n\nWe help resolve disputes between neighbors, families, or community members through:\n• Mediation\n• Conciliation\n• Arbitration\n\nVisit the Barangay Hall to file a complaint or request mediation. Bring relevant documents and both parties if possible.",
        quickReplies: ["Office Hours", "Contact Info", "Services"],
      };
    } else if (
      lowerMessage.includes("indigency") ||
      lowerMessage === "indigency"
    ) {
      return {
        type: "bot",
        text: "📄 Certificate of Indigency:\n\nCertificate of indigency for qualified residents\n\nRequirements:\n• Valid ID\n• Proof of residency\n• Barangay Clearance\n• Purpose of certificate (medical, educational, legal aid, etc.)\n• Proof of financial status\n\nSubject to barangay assessment and verification.\n\nVisit the Barangay Hall for processing.",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (
      lowerMessage.includes("senior") ||
      lowerMessage.includes("pwd")
    ) {
      return {
        type: "bot",
        text: "👴👵♿ Senior Citizen & PWD Assistance:\n\nWe provide:\n• Senior Citizen ID\n• PWD ID\n• Assistance with benefits\n• Referrals to city programs\n• Monthly assistance programs\n\nVisit during office hours with required documents (birth certificate, medical certificate for PWD).",
        quickReplies: ["Office Hours", "Contact Info", "Services"],
      };
    } else if (
      lowerMessage.includes("emergency") ||
      lowerMessage.includes("hotline")
    ) {
      return {
        type: "bot",
        text: "🚨 Emergency Contacts:\n\nBarangay Hotline: (02) 8872-9664\n\nLas Piñas City Police Station (Brgy. Pamplona Uno):\n• (02) 8718-221\n• (02) 8808-7395\n\nMedical Emergency: 911\n\nFor barangay concerns, contact our hotline anytime!",
        quickReplies: ["Contact Info", "Services", "Office Hours"],
      };
    } else if (
      lowerMessage.includes("thank") ||
      lowerMessage.includes("salamat")
    ) {
      return {
        type: "bot",
        text: "Walang anuman! You're welcome! 😊 Feel free to ask if you need any other assistance. Mabuhay ang Pamplona Uno!",
        quickReplies: ["Our Mission", "Services", "Contact Info"],
      };
    } else {
      return {
        type: "bot",
        text: "Thank you for your message! For detailed information, please visit Barangay Pamplona Uno\ Hall during office hours or contact us through our hotline and social media channels. We're here to serve you!",
        quickReplies: [
          "Our Mission",
          "Services",
          "Contact Info",
          "Office Hours",
        ],
      };
    }
  };

  return (
    <>
      {/* Floating Promo Message */}
      {showPromoMessage && !isChatOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl z-50 p-4 max-w-xs border-2 border-orange-500 animate-bounce-slow">
          <button
            onClick={() => setShowPromoMessage(false)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
            aria-label="Close message"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
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
                We're Live! 💬
              </p>
              <p className="text-gray-600 text-xs">
                Chat with us now for quick assistance in Pamplona Uno!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Open Chatbot"
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
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
          1
        </span>
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 flex items-center gap-3">
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
            <div className="flex-1">
              <h3 className="font-bold text-lg">Pamplona Uno Assistant</h3>
              <p className="text-xs text-orange-100">Barangay Las Piñas City</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-orange-700 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl break-words ${
                      message.type === "user"
                        ? "bg-orange-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line break-words overflow-wrap-anywhere">
                      {message.text}
                    </p>
                  </div>
                </div>

                {/* Quick Reply Buttons */}
                {message.type === "bot" && message.quickReplies && (
                  <div className="mt-3 flex flex-wrap gap-2 justify-start">
                    {message.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply)}
                        className="px-4 py-2 text-xs bg-white border-2 border-orange-500 text-orange-600 rounded-full hover:bg-orange-500 hover:text-white transition-colors duration-200 shadow-sm"
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

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
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
