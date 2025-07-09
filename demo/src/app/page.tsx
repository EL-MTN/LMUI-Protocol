'use client';

import { useState, useRef, useEffect } from 'react';

// Define types for our data structures
type Message = {
  sender: 'user' | 'llm';
  content: string | React.ReactNode;
};

type UIComponent = {
  type: 'text_input' | 'interactive_select';
  id: string;
  label: string;
  options?: { text: string; value: string }[];
};

type LLMResponse = {
  type: 'form_submission';
  values: Record<string, string>;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial message from the LLM
    setMessages([
      { sender: 'llm', content: 'Hello! How can I help you today? Type "book a flight" to see a demo.' },
    ]);
  }, []);

  const appendMessage = (sender: 'user' | 'llm', content: string | React.ReactNode) => {
    setMessages((prev) => [...prev, { sender, content }]);
  };

  const llmResponse = (userInput: string | LLMResponse) => {
    if (typeof userInput === 'string') {
      const lowerCaseInput = userInput.toLowerCase();
      if (lowerCaseInput.includes('book a flight')) {
        const components: UIComponent[] = [
          {
            type: 'text_input',
            id: 'departure_city',
            label: 'Departure City:',
          },
          {
            type: 'interactive_select',
            id: 'travel_class',
            label: 'Travel Class:',
            options: [
              { text: 'Economy', value: 'economy' },
              { text: 'Business', value: 'business' },
              { text: 'First Class', value: 'first' },
            ],
          },
        ];
        const formComponent = <InteractiveFormComponent components={components} onSubmit={llmResponse} />;
        appendMessage('llm', formComponent);
      } else {
        appendMessage('llm', `You said: "${userInput}"`);
      }
    } else if (typeof userInput === 'object' && userInput.type === 'form_submission') {
      const { departure_city, travel_class } = userInput.values;
      appendMessage('llm', `Got it. Searching for ${travel_class} class flights from ${departure_city}.`);
    }
  };

  const handleUserMessage = () => {
    const messageText = inputValue.trim();
    if (messageText) {
      appendMessage('user', messageText);
      setInputValue('');
      setTimeout(() => {
        llmResponse(messageText);
      }, 500);
    }
  };

  const InteractiveFormComponent = ({ components, onSubmit }: { components: UIComponent[], onSubmit: (response: LLMResponse) => void }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const values: Record<string, string> = {};
      let userMessage = 'My choices are:';

      components.forEach(component => {
        const value = formData.get(component.id) as string;
        values[component.id] = value;
        if (component.type === 'interactive_select') {
            const selectedOption = component.options?.find(opt => opt.value === value);
            userMessage += `\n- ${selectedOption?.text}`;
        } else {
            userMessage += `\n- ${value}`;
        }
      });
      
      setIsSubmitted(true);
      appendMessage('user', userMessage);
      setTimeout(() => {
        onSubmit({ type: 'form_submission', values });
      }, 500);
    };

    return (
      <form onSubmit={handleSubmit} className="interactive-form">
        {components.map(component => (
          <div key={component.id} className="interactive-form-element">
            <label htmlFor={component.id}>{component.label}</label>
            {component.type === 'text_input' && (
              <input
                type="text"
                id={component.id}
                name={component.id}
                className="interactive-text-input"
                disabled={isSubmitted}
              />
            )}
            {component.type === 'interactive_select' && (
              <select
                id={component.id}
                name={component.id}
                className="interactive-select"
                disabled={isSubmitted}
              >
                {component.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.text}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        <button type="submit" className="interactive-submit" disabled={isSubmitted}>
          Submit
        </button>
      </form>
    );
  };

  return (
    <main>
      <div id="chat-container">
        <div id="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}-message`}>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div id="chat-input-container">
          <input
            type="text"
            id="chat-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
          />
          <button id="send-btn" onClick={handleUserMessage}>
            ➔
          </button>
        </div>
      </div>
    </main>
  );
}
