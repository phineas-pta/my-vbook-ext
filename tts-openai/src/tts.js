function execute(text, voiceId) {
	let audioBase64 = fetch(OPENAI_API_URL + "/audio/speech", {
		method: "POST",
		headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_API_KEY },
		body: JSON.stringify({ model: OPENAI_API_MODEL, voice: voiceId, response_format: "wav", input: text }),
	}).base64();

	if (!res.ok) {
		return Response.error("error in tts.js: HTTP " + res.status);
	} else {
		return Response.success(audioBase64);
	}
}
