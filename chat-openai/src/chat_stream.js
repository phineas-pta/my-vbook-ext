function execute(messagesJson, selectedModel) {
	// docs: https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create
	let res = fetch(OPENAI_API_URL + "/chat/completions", {
		method: "POST",
		stream: true,
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + OPENAI_API_KEY,
		},
		body: JSON.stringify({
			model: selectedModel || OPENAI_API_MODEL,
			messages: JSON.parse(messagesJson),
			reasoning_effort: OPENAI_API_reasoning_effort,
			temperature: parseFloat(OPENAI_API_temperature),
			top_p: parseFloat(OPENAI_API_top_p),
			frequency_penalty: parseFloat(OPENAI_API_frequency_penalty),
			presence_penalty: parseFloat(OPENAI_API_presence_penalty),
			stream: true,
		}),
		timeout: 300000,
	});
	if (!res.ok) return Response.error("error in chat_stream.js: HTTP " + res.status);

	let line;
	while ((line = res.readLine()) !== null) {
		if (line.indexOf("data: ") !== 0) continue;
		let payload = line.substring(6);
		if (payload === "[DONE]") break;
		let token = JSON.parse(payload).choices[0].delta.content;
		if (token) ai.emitToken(token);
	}
	return Response.success("");
}
