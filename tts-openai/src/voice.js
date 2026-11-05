/**
 * get voices list + languages
 * @returns {{id: String, name: String, language: String}[]}
 */
function execute() {
	let res = fetch(OPENAI_API_URL + "/audio/voices", {
		method: "GET",
		headers: { "Authorization": "Bearer " + OPENAI_API_KEY },
		queries: { model: OPENAI_API_MODEL },
	});
	if (!res.ok) return Response.error("error in voice.js: HTTP " + res.status);

	let arr = [], tmp = res.json().voices;
	if (tmp.length > 0) {
		for (let i of tmp) {
			arr.push({
				id: i,
				name: i,
				language: "vi-VN"
			});
		}
	} else {
		arr.push({
			id: "",
			name: OPENAI_API_MODEL + " default voice",
			language: "vi-VN"
		});
	}

	return Response.success(arr);
}
