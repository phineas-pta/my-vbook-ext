/**
 * A.I. assistant request
 * @param {string} messagesJson
 * @param {string} selectedModel
 * @returns {undefined} nothing returned because text is streamed
 */
function execute(messagesJson, selectedModel) {
	let messages_array = JSON.parse(messagesJson);
	let res = send_req(messages_array, selectedModel);
	if (!res.ok) return Response.error("error in chat_stream.js: HTTP " + res.status);
	// TODO: also check for subsequent requests

	let tools = stream_resp(res);
	while (tools.length > 0) {
		messages_array.push({
			role: "assistant",
			tool_calls: tools,
		});

		for (let call of tools) {
			messages_array.push({
				role: "tool",
				tool_call_id: call.id,
				content: JSON.stringify(ai.executeTool(call.function.name, JSON.parse(call.function.arguments))),
			});
		}

		tools = stream_resp(send_req(messages_array, selectedModel));
	}

	return Response.success("");
}

/**
 * send 1 request
 * @see https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create
 * @param {{role: String, content: String}[]} messages
 * @param {string} model
 * @returns {Response} not Promise because of runtime
 */
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
			verbosity: OPENAI_API_verbosity,
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

/**
 * stream 1 response & collect tool calls trace
 * @see https://developers.openai.com/api/docs/guides/function-calling?api-mode=chat
 * @param {Response} resp
 * @returns {{index: String, id: String, type: String, function: {name: String, arguments: String}}[]} tool calls trace
 */
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
			// ai.emitToken(delta.reasoning_content); // DO NOT DO THIS because it modifies messages array
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
