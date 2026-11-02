const SPLIT = " ――― ";

function execute(text, voiceId) {
	let tmp = voiceId.split(SPLIT); // separate field to retrieve info
	let audioBase64 = fetch(OPENAI_API_URL + "/audio/speech", {
		method: "POST",
		headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_API_KEY },
		body: { text: text, model: tmp[0], voice: tmp[1] },
	}).base64();
	return Response.success(audioBase64);
}
