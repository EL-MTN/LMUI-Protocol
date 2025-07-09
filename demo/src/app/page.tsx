'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// --- TYPE DEFINITIONS ---
type Message = {
	sender: 'user' | 'llm';
	content: string | React.ReactNode;
};

type ComponentOption = { text: string; value: string };

type UIComponent = {
	type:
		| 'text_input'
		| 'interactive_select'
		| 'textarea'
		| 'checkbox_group'
		| 'radio_button_group'
		| 'slider'
		| 'static_markdown';
	id: string;
	label?: string; // Optional for markdown
	options?: ComponentOption[];
	min?: number;
	max?: number;
	step?: number;
	content?: string; // For markdown
};

type LLMResponse = {
	type: 'form_submission';
	form_id: string;
	values: Record<string, string | number | string[]>;
};

// --- MAIN PAGE COMPONENT ---
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
			{
				sender: 'llm',
				content:
					'Hello! How can I help you today? Try "book a flight" or "customer survey".',
			},
		]);
	}, []);

	const appendMessage = (sender: 'user' | 'llm', content: string | React.ReactNode) => {
		setMessages((prev) => [...prev, { sender, content }]);
	};

	// --- MOCK LLM LOGIC ---
	const llmResponse = (userInput: string | LLMResponse) => {
		// Handle form submissions
		if (typeof userInput === 'object' && userInput.type === 'form_submission') {
			if (userInput.form_id === 'flight_booking') {
				const { departure_city, travel_class } = userInput.values;
				appendMessage(
					'llm',
					`Got it. Searching for ${travel_class} class flights from ${departure_city}.`
				);
			} else if (userInput.form_id === 'customer_survey') {
				let summary =
					"Thank you for completing the survey! Here's a summary of your responses:\n";
				for (const [key, value] of Object.entries(userInput.values)) {
					summary += `\n- **${key.replace(/_/g, ' ')}:** ${
						Array.isArray(value) ? value.join(', ') : value
					}`;
				}
				appendMessage('llm', <ReactMarkdown>{summary}</ReactMarkdown>);
			}
		} else {
			// Handle text input
			const textInput = userInput as string;
			const lowerCaseInput = textInput.toLowerCase();
			if (lowerCaseInput.includes('book a flight')) {
				const components: UIComponent[] = [
					{ type: 'text_input', id: 'departure_city', label: 'Departure City:' },
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
				const formComponent = (
					<InteractiveFormComponent
						formId="flight_booking"
						components={components}
						onSubmit={llmResponse}
					/>
				);
				appendMessage('llm', formComponent);
			} else if (lowerCaseInput.includes('customer survey')) {
				const components: UIComponent[] = [
					{
						type: 'static_markdown',
						id: 'survey_intro',
						content:
							'### Customer Satisfaction Survey\n\nPlease take a moment to provide your valuable feedback.',
					},
					{
						type: 'radio_button_group',
						id: 'satisfaction',
						label: 'Overall, how satisfied are you?',
						options: [
							{ text: 'Very Satisfied', value: '5' },
							{ text: 'Satisfied', value: '4' },
							{ text: 'Neutral', value: '3' },
							{ text: 'Unsatisfied', value: '2' },
						],
					},
					{
						type: 'checkbox_group',
						id: 'features_used',
						label: 'Which features have you used?',
						options: [
							{ text: 'Flight Booking', value: 'booking' },
							{ text: 'Price Alerts', value: 'alerts' },
							{ text: 'Customer Support', value: 'support' },
						],
					},
					{
						type: 'slider',
						id: 'recommend_likelihood',
						label: 'How likely are you to recommend us?',
						min: 0,
						max: 10,
						step: 1,
					},
					{
						type: 'textarea',
						id: 'additional_feedback',
						label: 'Any additional feedback?',
					},
				];
				const formComponent = (
					<InteractiveFormComponent
						formId="customer_survey"
						components={components}
						onSubmit={llmResponse}
					/>
				);
				appendMessage('llm', formComponent);
			} else {
				appendMessage('llm', `You said: "${userInput}"`);
			}
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

	// --- UI COMPONENTS ---
	const InteractiveFormComponent = ({
		formId,
		components,
		onSubmit,
	}: {
		formId: string;
		components: UIComponent[];
		onSubmit: (response: LLMResponse) => void;
	}) => {
		const [isSubmitted, setIsSubmitted] = useState(false);
		const [sliderValues, setSliderValues] = useState<Record<string, number>>({});

		useEffect(() => {
			const initialSliderValues: Record<string, number> = {};
			components.forEach((c) => {
				if (c.type === 'slider' && c.min !== undefined) {
					initialSliderValues[c.id] = c.min;
				}
			});
			setSliderValues(initialSliderValues);
		}, [components]);

		const handleSliderChange = (id: string, value: string) => {
			setSliderValues((prev) => ({ ...prev, [id]: Number(value) }));
		};

		const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const formData = new FormData(event.currentTarget);
			const values: Record<string, string | number | string[]> = {};
			let userMessage = 'Survey submitted with the following responses:';

			components.forEach((component) => {
				if (component.type === 'static_markdown') return;

				let value: string | number | string[] | null = null;
				if (component.type === 'checkbox_group') {
					value = formData.getAll(component.id) as string[];
				} else {
					const rawValue = formData.get(component.id);
					if (typeof rawValue === 'string') {
						value = component.type === 'slider' ? Number(rawValue) : rawValue;
					}
				}

				if (value !== null) {
					values[component.id] = value;
				}
			});

			setIsSubmitted(true);
			appendMessage('user', 'Form submitted. Thank you!');
			setTimeout(() => {
				onSubmit({ type: 'form_submission', form_id: formId, values });
			}, 500);
		};

		return (
			<form onSubmit={handleSubmit} className="interactive-form">
				{components.map((c) => (
					<div key={c.id} className="interactive-form-element">
						{c.label &&
							c.type !== 'checkbox_group' &&
							c.type !== 'radio_button_group' && (
								<label htmlFor={c.id}>{c.label}</label>
							)}

						{c.type === 'text_input' && (
							<input
								type="text"
								id={c.id}
								name={c.id}
								className="interactive-text-input"
								disabled={isSubmitted}
							/>
						)}
						{c.type === 'textarea' && (
							<textarea
								id={c.id}
								name={c.id}
								className="interactive-textarea"
								disabled={isSubmitted}
							/>
						)}
						{c.type === 'interactive_select' && (
							<select
								id={c.id}
								name={c.id}
								className="interactive-select"
								disabled={isSubmitted}
							>
								{c.options?.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.text}
									</option>
								))}
							</select>
						)}
						{(c.type === 'checkbox_group' || c.type === 'radio_button_group') && (
							<div role="group" aria-labelledby={`${c.id}-label`}>
								<div id={`${c.id}-label`} className="interactive-group-label">
									{c.label}
								</div>
								{c.options?.map((opt) => (
									<div
										key={opt.value}
										className={
											c.type === 'checkbox_group'
												? 'interactive-checkbox-option'
												: 'interactive-radio-option'
										}
									>
										<input
											type={
												c.type === 'checkbox_group' ? 'checkbox' : 'radio'
											}
											id={`${c.id}-${opt.value}`}
											name={c.id}
											value={opt.value}
											disabled={isSubmitted}
										/>
										<label htmlFor={`${c.id}-${opt.value}`}>{opt.text}</label>
									</div>
								))}
							</div>
						)}
						{c.type === 'slider' && (
							<div className="interactive-slider-container">
								<input
									type="range"
									id={c.id}
									name={c.id}
									min={c.min}
									max={c.max}
									step={c.step}
									disabled={isSubmitted}
									value={sliderValues[c.id] || c.min}
									onChange={(e) => handleSliderChange(c.id, e.target.value)}
								/>
								<span className="interactive-slider-output">
									{sliderValues[c.id] || c.min}
								</span>
							</div>
						)}
						{c.type === 'static_markdown' && c.content && (
							<div className="interactive-markdown">
								<ReactMarkdown>{c.content}</ReactMarkdown>
							</div>
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
			<div id="page-container">
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
			</div>
		</main>
	);
}
