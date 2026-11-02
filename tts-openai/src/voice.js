const SPLIT = " ――― ";

function execute() {
	// 1st: get list of all models
	let res = fetch(OPENAI_API_URL + "/models", {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	});
	if (!res.ok) return Response.error("HTTP " + res.status);

	// get list all voices for each model
	var arr = [];
	for (const i of res.json()["data"]) {
		let tmp = fetch(OPENAI_API_URL + "/audio/voices?model=" + i.id, {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		});
		if (!tmp.ok) return Response.error("HTTP " + tmp.status);

		if (tmp.json().voices.length > 0) {
			for (const j of tmp.json().voices) {
				arr.push({
					id: i.id + SPLIT + j, // concat to combine all info into 1 field
					name: i.id + SPLIT + j,
					language: "vi-VN"
				})
			}
		} else {
			arr.push({
				id: i.id + SPLIT,
				name: i.id + SPLIT,
				language: "vi-VN"
			})
		}

	}
	return Response.success(arr);
}
