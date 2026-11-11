/**
 * A.I. assistant request
 * @param {string} messagesJson
 * @param {string} selectedModel ignored, won’t be used
 * @returns {undefined} nothing returned because text is streamed
 */
function execute(messagesJson, selectedModel) {
	let messages_array = JSON.parse(messagesJson);
	let res = send_req(messages_array);
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

		tools = stream_resp(send_req(messages_array));
	}

	return Response.success("");
}

/**
 * send 1 request
 * @see https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create
 * @param {{role: String, content: String}[]} messages
 * @returns {Response} not Promise because of runtime
 */
function send_req(messages) {
	const advanced_options = get_advanced_options();
	const tools_list = ai.getToolList().map((x) => ({
		type: "function",
		function: {
			name: x.name,
			description: x.description,
			parameters: x.parameters,
			strict: true,
		},
	}));

	let req_body = {
		model: OPENAI_API_MODEL,
		messages: messages,
		stream: true,
	};
	for (let [key, value] of Object.entries(advanced_options)) req_body[key] = value;
	if (Object.keys(tools_list).length > 0) req_body.tools = tools_list;

	return fetch(OPENAI_API_URL + "/chat/completions", {
		method: "POST",
		stream: true,
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + OPENAI_API_KEY,
		},
		body: JSON.stringify(req_body),
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

/**
 * advanced options for OpenAI API
 * @returns {object[]}
 */
function get_advanced_options() {
	let res = {};
	for (let i of ["temperature", "top_p", "frequency_penalty", "presence_penalty"]) {
		if (localConfig.getItem(i, "-1") !== "-1") {
			let tmp = parseFloat(localConfig.getItem(i));
			if (!isNaN(tmp) && isFinite(tmp) && tmp > 0) {
				res[i] = tmp;
			}
		}
	}
	for (let i of ["verbosity", "reasoning_effort"]) {
		if (localConfig.getItem(i, "NULL") !== "NULL") {
			res[i] = localConfig.getItem(i);
		}
	}
	return res;
}
