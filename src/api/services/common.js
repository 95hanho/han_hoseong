const commonService_doc = {
	getMenus: () => {
		return JSON.parse(localStorage.getItem("menus")) || "";
	},
	setMenus: (obj) => {
		localStorage.setItem("menus", JSON.stringify(obj));
	},
	getQuicks: () => {
		return JSON.parse(localStorage.getItem("quicks")) || [];
	},
	setQuicks: (obj) => {
		localStorage.setItem("quicks", JSON.stringify(obj));
	},
	getIcons: () => {
		return JSON.parse(localStorage.getItem("icons")) || [];
	},
	setIcons: (obj) => {
		localStorage.setItem("icons", JSON.stringify(obj));
	},
	getSchedules: () => {
		return JSON.parse(localStorage.getItem("schedule")) || [];
	},
	setSchedules: (obj) => {
		localStorage.setItem("schedule", JSON.stringify(obj));
	},
	getBgInfo: () => {
		return (
			JSON.parse(localStorage.getItem("bg-info")) || {
				["background-size"]: "cover" /* 배경 이미지를 화면에 맞게 조절 */,
				["background-repeat"]: "no-repeat" /* 배경 이미지 반복하지 않음 */,
				["background-position"]: "center" /* 배경 이미지를 가운데 정렬 */,
				["background-color"]: "#aaa",
			}
		);
	},
	setBgInfo: (obj) => {
		localStorage.setItem("bg-info", JSON.stringify(obj));
	},
};

export default commonService_doc;
