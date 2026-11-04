function execute(messagesJson, selectedModel) {
	// docs: https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create
	const tools = ai.getToolList().map((x) => ({ "type": "function", "function": x, }));
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
			tools: tools,
			stream: true,
		}),
		timeout: 300000,
	});
	if (!res.ok) return Response.error("error in chat_stream.js: HTTP " + res.status);

	let line;
	let toolCalls = [];
	while ((line = res.readLine()) !== null) {
		// check if stream end
		if (line.indexOf("data: ") !== 0) continue;
		let payload = line.substring(6);
		if (payload === "[DONE]") break;
		let delta = JSON.parse(payload).choices[0]?.delta;
		if (!delta) continue;

		if (delta.content) ai.emitToken(delta.content);
		if (delta.tool_calls) {
			for (let part of delta.tool_calls) {
				if (!toolCalls[part.index]) toolCalls.push({
					id: part.id ? part.id : "",
					type: "function",
					function: {
						name: part.function?.name ? part.function.name : "",
						args: part.function?.arguments ? part.function.arguments : "",
					},
				})
			}
		}
	}

	if (toolCalls.length > 0) {
		// messages.push({ role: "assistant", content: content || null, tool_calls: toolCalls, });
		for (let call of toolCalls) {
			let tmp = ai.executeTool(call.function.name, JSON.parse(call.function.args));
			// messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(tmp), });
		}
	}
	return Response.success("");
}
