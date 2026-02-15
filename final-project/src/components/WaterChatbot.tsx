import { useState } from "react";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const sampleQuestions = [
  "What is the expected water level of the Kinneret in one month?",
  "Which rainfall region had the greatest impact on the Coastal Aquifer?",
  "Is the water level in the Mountain Aquifer trending upward or downward?",
  "Show me the current status of all water sources",
];

const getBotResponse = (question: string): string => {
  const lowerQ = question.toLowerCase();

  if (lowerQ.includes("kinneret")) {
    if (lowerQ.includes("month") || lowerQ.includes("prediction")) {
      return "Based on our ML model predictions Kinneret is expected to reach -209.2 meters below sea level in one month. This represents an increase of approximately 0.8 meters from the current level of -210.0 meters. The prediction has a confidence level of 94.2%.";
    }
    return "Kinneret is currently at -210.0 meters below sea level, which is 98% of its operational capacity. The trend is upward due to recent rainfall in the North Galilee region.";
  }

  if (lowerQ.includes("rainfall") && lowerQ.includes("impact")) {
    return "For the Kinneret, the North Galilee region has the greatest impact, contributing 42% to water level changes. The Golan Heights region contributes 28%, and the Jezreel Valley contributes 15%. These regions are the primary drivers of water level fluctuations.";
  }

  if (lowerQ.includes("mountain aquifer") && lowerQ.includes("trend")) {
    return "The Mountain Aquifer is currently trending upward. Our analysis shows a 3.2% increase over the past month, with water levels at 85% of operational capacity. The upward trend is expected to continue based on rainfall patterns in the Central region.";
  }

  if (lowerQ.includes("status") || lowerQ.includes("all water sources")) {
    return "Current status of water sources:\n\n✅ Sea of Galilee: 98% - Good\n⚠️ Coastal Aquifer: 72% - Warning\n✅ Mountain Aquifer: 85% - Good\n⚠️ Yarkon River: 68% - Warning\n✅ Kishon River: 91% - Good\n🔴 Dead Sea: 45% - Critical\n\nOverall system capacity: 76.5%";
  }

  return "I can help you with information about water levels, predictions, rainfall impacts, and trends. Try asking about specific water sources or rainfall regions, or use one of the suggested questions above.";
};

export function WaterChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Water Vision AI Assistant. I can help you with water level predictions, rainfall impact analysis, and trend information. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    const botMessage: Message = {
      id: messages.length + 2,
      text: getBotResponse(input),
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3>Water Vision</h3>
          <p className="text-sm text-gray-600">Ask questions about water levels and predictions</p>
        </div>
      </div>

      {/* Sample Questions */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuestionClick(q)}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors"
            >
              {q.substring(0, 40)}...
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`p-2 rounded-lg ${
                message.sender === "user" ? "bg-blue-100" : "bg-white shadow"
              }`}
            >
              {message.sender === "user" ? (
                <User className="w-5 h-5 text-blue-600" />
              ) : (
                <Bot className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white shadow"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about water levels, predictions, or trends..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
}
