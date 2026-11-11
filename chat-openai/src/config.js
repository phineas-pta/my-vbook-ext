/**
 * dynamic setting schema
 * @returns {{title: String, mode: String, format: String, default: String}[]} advanced options for OpenAI API
 */
function execute() {
	if (OPENAI_API_show_advanced === "true") {
		return Response.success({
			verbosity: {
				title: "Verbosity of the model’s response",
				subtitle: "lower values = more concise",
				mode: "select",
				format: "single",
				values: ["low", "medium", "high"],
				default: localConfig.getItem("verbosity", "medium"),
			},
			reasoning_effort: {
				title: "Reasoning effort",
				mode: "select",
				format: "single",
				values: ["none", "minimal", "low", "medium", "high", "xhigh", "max"],
				default: localConfig.getItem("reasoning_effort", "medium"),
			},
			temperature: {
				title: "Sampling: temperature",
				subtitle: "0.0 → 2.0: lower = more deterministic, higher = more random",
				mode: "input",
				format: "number",
				default: localConfig.getItem("temperature", "1.0"),
			},
			top_p: {
				title: "Sampling: top P",
				subtitle: "0.0 → 1.0: for example 0.1 = output sampled only from the top 10% probability tokens",
				mode: "input",
				format: "number",
				default: localConfig.getItem("top_p", "1.0"),
			},
			frequency_penalty: {
				title: "Frequency penalty",
				subtitle: "-2.0 → 2.0: higher = prevent repetition = reduction if the token has appeared has appeared multiple times",
				mode: "input",
				format: "number",
				default: localConfig.getItem("frequency_penalty", "0.0"),
			},
			presence_penalty: {
				title: "Presence penalty",
				subtitle: "-2.0 → 2.0: higher = newer things = reduction if the token has appeared at least once before",
				mode: "input",
				format: "number",
				default: localConfig.getItem("presence_penalty", "0.0"),
			},
		});
	} else {
		return Response.success({});
	}
}
