document.addEventListener('DOMContentLoaded', () => {
	const chatMessages = document.getElementById('chat-messages');
	const chatInput = document.getElementById('chat-input');
	const sendBtn = document.getElementById('send-btn');

	const appendMessage = (sender, text) => {
		const messageElement = document.createElement('div');
		messageElement.classList.add('message', `${sender}-message`);

		if (typeof text === 'string') {
			messageElement.textContent = text;
		} else {
			messageElement.appendChild(text);
		}

		chatMessages.appendChild(messageElement);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	};

	const handleUserMessage = () => {
		const messageText = chatInput.value.trim();
		if (messageText) {
			appendMessage('user', messageText);
			chatInput.value = '';
			// Simulate LLM response
			setTimeout(() => {
				llmResponse(messageText);
			}, 500);
		}
	};

	const llmResponse = (userInput) => {
		if (typeof userInput === 'string') {
			const lowerCaseInput = userInput.toLowerCase();
			if (lowerCaseInput.includes('book a flight')) {
				const components = [
					{
						type: 'text_input',
						id: 'departure_city',
						label: 'Departure City:'
					},
					{
						type: 'interactive_select',
						id: 'travel_class',
						label: 'Travel Class:',
						options: [
							{ text: 'Economy', value: 'economy' },
							{ text: 'Business', value: 'business' },
							{ text: 'First Class', value: 'first' }
						]
					}
				];
				renderInteractiveComponents(components);
			} else {
				appendMessage('llm', `You said: "${userInput}"`);
			}
		} else if (typeof userInput === 'object' && userInput.type === 'form_submission') {
			const { departure_city, travel_class } = userInput.values;
			appendMessage('llm', `Got it. Searching for ${travel_class} class flights from ${departure_city}.`);
		}
	};

	const renderInteractiveComponents = (components = []) => {
		const form = document.createElement('form');
		form.classList.add('interactive-form');

		components.forEach(component => {
			const elementContainer = document.createElement('div');
			elementContainer.classList.add('interactive-form-element');

			const label = document.createElement('label');
			label.textContent = component.label;
			label.htmlFor = component.id;
			elementContainer.appendChild(label);

			let inputElement;

			switch (component.type) {
				case 'interactive_select':
					inputElement = document.createElement('select');
					inputElement.id = component.id;
					inputElement.classList.add('interactive-select');
					component.options.forEach(opt => {
						const option = document.createElement('option');
						option.value = opt.value;
						option.textContent = opt.text;
						inputElement.appendChild(option);
					});
					break;

				case 'text_input':
					inputElement = document.createElement('input');
					inputElement.type = 'text';
					inputElement.id = component.id;
					inputElement.classList.add('interactive-text-input');
					break;
			}

			if (inputElement) {
				elementContainer.appendChild(inputElement);
				form.appendChild(elementContainer);
			}
		});

		const submitBtn = document.createElement('button');
		submitBtn.textContent = 'Submit';
		submitBtn.classList.add('interactive-submit');
		form.appendChild(submitBtn);

		form.addEventListener('submit', (event) => {
			event.preventDefault(); // Prevent default form submission

			const values = {};
			const inputs = form.querySelectorAll('.interactive-select, .interactive-text-input');
			let userMessage = 'My choices are:';

			inputs.forEach(input => {
				values[input.id] = input.value;
				input.disabled = true;

				if (input.tagName.toLowerCase() === 'select') {
					const selectedOption = input.options[input.selectedIndex];
					userMessage += `\n- ${selectedOption.textContent}`;
				} else {
					userMessage += `\n- ${input.value}`;
				}
			});

			submitBtn.disabled = true;

			appendMessage('user', userMessage);

			setTimeout(() => {
				llmResponse({ type: 'form_submission', values });
			}, 500);
		});

		appendMessage('llm', form);
	};

	sendBtn.addEventListener('click', handleUserMessage);

	chatInput.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			handleUserMessage();
		}
	});

	appendMessage('llm', 'Hello! How can I help you today?');
});
