function execute(messagesJson, selectedModel) {
	// https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create
	let messages_array = JSON.parse(messagesJson);
	let res = send_req(messages_array, selectedModel);
	if (!res.ok) return Response.error("error in chat_stream.js: HTTP " + res.status);

	// https://developers.openai.com/api/docs/guides/function-calling?api-mode=chat
	let tools = stream_resp(res);

	if (tools.length > 0) {
		messages_array.push({
			role: "assistant",
			content: "",
			tool_calls: tools,
		});

		for (let call of tools) {
			let yolo = ai.executeTool(call.function.name, JSON.parse(call.function.arguments));
			messages_array.push({
				role: "tool",
				tool_call_id: call.id,
				content: JSON.stringify(yolo), // TODO unknown error in vbook
			});
		}

		if (OPENAI_API_DEBUGGING === "true")
			ai.emitToken(JSON.stringify(messages_array));
		stream_resp(send_req(messages_array, selectedModel));
	}

	return Response.success("finished request");
}

function send_req(messages, model) {
	const TOOLS_LIST = ai.getToolList().map((x) => ({
		type: "function",
		function: {
			name: x.name,
			description: x.description,
			parameters: x.parameters,
			strict: true,
		},
	}));

	return fetch(OPENAI_API_URL + "/chat/completions", {
		method: "POST",
		stream: true,
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + OPENAI_API_KEY,
		},
		body: JSON.stringify({
			model: model || OPENAI_API_MODEL,
			messages: messages,
			reasoning_effort: OPENAI_API_reasoning_effort,
			temperature: parseFloat(OPENAI_API_temperature),
			top_p: parseFloat(OPENAI_API_top_p),
			frequency_penalty: parseFloat(OPENAI_API_frequency_penalty),
			presence_penalty: parseFloat(OPENAI_API_presence_penalty),
			tools: TOOLS_LIST,
			stream: true,
		}),
		timeout: 300000,
	});
}

function stream_resp(resp) {
	let tool_calls_map = {}, line;
	while ((line = resp.readLine()) !== null) {
		// check if stream end
		if (line.indexOf("data: ") !== 0) continue;
		let payload = line.substring(6);
		if (payload === "[DONE]") break;
		let delta = JSON.parse(payload).choices[0].delta;
		if (!delta) continue;

		if (delta.content) {
			ai.emitStatus(JSON.stringify({ type: "generating" }));
			ai.emitToken(delta.content);
		}
		if (delta.reasoning_content) {
			ai.emitStatus(JSON.stringify({ type: "thinking" }));
			if (OPENAI_API_DEBUGGING === "true")
				ai.emitToken(delta.reasoning_content);
		}
		if (delta.tool_calls) {
			ai.emitStatus(JSON.stringify({ type: "tool_call" }));
			for (let part of delta.tool_calls) {
				// tool calls arrive incrementally, so accumulate each field by index
				let accumulated = (tool_calls_map[part.index] ??= {
					// re-create the exact schema to be executed later
					index: part.index,
					id: part.id,
					type: part.type,
					function: {
						name: part.function.name,
						arguments: part.function.arguments,
					},
				});

				accumulated.index ??= part.index;
				accumulated.id ??= part.id;
				accumulated.type ??= part.type;
				accumulated.function.name ??= part.function.name;
				if (accumulated.function.arguments !== "{}") // avoid JSON.parse error
					accumulated.function.arguments += part.function.arguments ?? "";
			}
		}
	}
	return Object.values(tool_calls_map);
}
