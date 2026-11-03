function execute(messagesJson, selectedModel) {
	let res = fetch(OPENAI_API_URL + "/chat/completions", {
		method: "POST",
		stream: true,
		headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_API_KEY },
		body: JSON.stringify({ model: selectedModel || OPENAI_API_MODEL, messages: JSON.parse(messagesJson), stream: true }),
	});
	if (!res.ok) return Response.error("HTTP " + res.status);

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
