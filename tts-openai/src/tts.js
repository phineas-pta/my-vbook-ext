/**
 * voice synthesis
 * @param {string} text
 * @param {string} voiceId
 * @returns {string} base64-encoded wav
 */
function execute(text, voiceId) {
	// docs: https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create
	let res = fetch(OPENAI_API_URL + "/audio/speech", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + OPENAI_API_KEY
		},
		body: JSON.stringify({
			model: OPENAI_API_MODEL,
			voice: voiceId,
			response_format: "wav",
			input: text
		}),
		timeout: 300000,
	});

	if (!res.ok) {
		return Response.error("error in tts.js: HTTP " + res.status);
	} else {
		return Response.success(res.base64());
	}
}
