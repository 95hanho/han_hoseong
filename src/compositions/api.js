//
export const getMenus = () => {
	return JSON.parse(localStorage.getItem("menus")) || "";
};
//
export const setMenus = (obj) => {
	localStorage.setItem("menus", JSON.stringify(obj));
};
//
export const getQuicks = () => {
	return JSON.parse(localStorage.getItem("quicks")) || [];
};
//
export const setQuicks = (obj) => {
	localStorage.setItem("quicks", JSON.stringify(obj));
};
//
export const getIcons = () => {
	return JSON.parse(localStorage.getItem("icons")) || [];
};
//
export const setIcons = (obj) => {
	localStorage.setItem("icons", JSON.stringify(obj));
};
//
export const getSchedules = () => {
	return JSON.parse(localStorage.getItem("schedule")) || [];
};
//
export const setSchedules = (obj) => {
	localStorage.setItem("schedule", JSON.stringify(obj));
};
//
export const getBgInfo = () => {
	return (
		JSON.parse(localStorage.getItem("bg-info")) || {
			["background-size"]: "cover" /* 배경 이미지를 화면에 맞게 조절 */,
			["background-repeat"]: "no-repeat" /* 배경 이미지 반복하지 않음 */,
			["background-position"]: "center" /* 배경 이미지를 가운데 정렬 */,
			["background-color"]: "#aaa",
		}
	);
};
//
export const setBgInfo = (obj) => {
	localStorage.setItem("bg-info", JSON.stringify(obj));
};
