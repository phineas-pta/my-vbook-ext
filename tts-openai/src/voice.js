function execute() {
	let res = fetch(OPENAI_API_URL + "/audio/voices?model=" + OPENAI_API_MODEL, {
		method: "GET",
		headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_API_KEY }
	});
	if (!res.ok) return Response.error("error in voice.js: HTTP " + res.status);

	let arr = [], tmp = res.json().voices;
	if (tmp.length > 0) {
		for (const i of tmp) {
			arr.push({ id: i, name: i, language: "vi-VN" });
		}
	} else {
		arr.push({ id: "", name: OPENAI_API_MODEL + " default voice", language: "vi-VN" });
	}

	return Response.success(arr);
}
