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
			if (lowerCaseInput.includes('color')) {
				const selectComponent = {
					type: 'interactive_select',
					id: 'color_preference',
					label: 'What is your favorite color?',
					options: [
						{ text: 'Red', value: 'red' },
						{ text: 'Green', value: 'green' },
						{ text: 'Blue', value: 'blue' }
					]
				};
				renderInteractiveComponent(selectComponent);
			} else {
				appendMessage('llm', `You said: "${userInput}"`);
			}
		} else if (typeof userInput === 'object' && userInput.type === 'selection') {
			if (userInput.id === 'color_preference') {
				appendMessage('llm', `Ah, ${userInput.value}! A fine color indeed.`);
			}
		}
	};

	const renderInteractiveComponent = (component) => {
		if (component.type === 'interactive_select') {
			const container = document.createElement('div');

			const label = document.createElement('label');
			label.textContent = component.label;
			container.appendChild(label);

			const select = document.createElement('select');
			select.id = component.id;
			select.classList.add('interactive-select');

			component.options.forEach((opt) => {
				const option = document.createElement('option');
				option.value = opt.value;
				option.textContent = opt.text;
				select.appendChild(option);
			});

			container.appendChild(select);

			const submitBtn = document.createElement('button');
			submitBtn.textContent = 'Submit';
			submitBtn.classList.add('interactive-submit');
			container.appendChild(submitBtn);

			submitBtn.addEventListener('click', () => {
				const selectedValue = select.value;
				const selectedOption = component.options.find(o => o.value === selectedValue);

				select.disabled = true;
				submitBtn.disabled = true;

				appendMessage('user', `I choose ${selectedOption.text.toLowerCase()}.`);

				setTimeout(() => {
					llmResponse({ type: 'selection', id: component.id, value: selectedValue });
				}, 500);
			});

			appendMessage('llm', container);
		}
	};

	sendBtn.addEventListener('click', handleUserMessage);

	chatInput.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			handleUserMessage();
		}
	});

	appendMessage('llm', 'Hello! How can I help you today?');
});
