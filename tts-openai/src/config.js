/**
 * dynamic setting schema
 * @returns {{title: String, mode: String, format: String, default: String}[]} options specific to audio.cpp
 */
function execute() {
	if (OPENAI_API_show_advanced === "true") {
		return Response.success({
			// values not universal, effects depend on models
			// i choose these options because they are present in almost any TTS models
			temperature: {
				title: "temperature",
				mode: "input",
				format: "number",
				default: localConfig.getItem("temperature", "0.8"),
			},
			top_k: {
				title: "top K",
				mode: "input",
				format: "number",
				default: localConfig.getItem("top_k", "25"),
			},
			top_p: {
				title: "top P",
				mode: "input",
				format: "number",
				default: localConfig.getItem("top_p", "0.95"),
			},
			repetition_penalty: {
				title: "repetition penalty",
				mode: "input",
				format: "number",
				default: localConfig.getItem("repetition_penalty", "1.2"),
			},
			max_tokens: {
				title: "max tokens",
				mode: "input",
				format: "number",
				default: localConfig.getItem("max_tokens", "300"),
			},
			text_chunk_size: {
				title: "text_chunk_size",
				mode: "input",
				format: "number",
				default: localConfig.getItem("text_chunk_size", "200"),
			},
			text_chunk_mode: {
				title: "text chunk mode",
				mode: "select",
				format: "single",
				values: ["default", "tag_aware", "japanese", "endline"],
				default: localConfig.getItem("text_chunk_mode", "default"),
			},
			instruct: {
				title: "instruct",
				mode: "input",
				format: "text",
				default: localConfig.getItem("instruct", "female, young adult, moderate pitch"),
			},
			num_inference_steps: {
				title: "num inference steps",
				mode: "input",
				format: "number",
				default: localConfig.getItem("num_inference_steps", "32"),
			},
			guidance_scale: {
				title: "guidance scale",
				mode: "input",
				format: "number",
				default: localConfig.getItem("guidance_scale", "2.0"),
			},
		});
	} else {
		return Response.success({});
	}
}
