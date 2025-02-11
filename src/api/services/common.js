import { delete_normal, get_normal, post_json, post_urlFormData } from "../apiFilter";
import API_URL from "../endpoints";

const commonService_doc = {
	get_menu_version: () => localStorage.getItem("menu_version") || 0,
	set_menu_version: (v) => localStorage.setItem("menu_version", v),
	get_menus: async () =>
		await get_normal(API_URL.MENU).then((data) => {
			const obj = {};
			data.menus.map((v) => {
				obj[v.parent_name] = v.menu_list;
			});
			// console.log(obj);
			data.menus = obj;
			return data;
		}),
	set_menus: (obj) => {
		post_urlFormData(API_URL.MENU, obj).then((data) => {
			console.log(data);
		});
	},
	get_local_menus: () => {
		return JSON.parse(localStorage.getItem("menus")) || {};
	},
	set_local_menus: (obj) => {
		localStorage.setItem("menus", JSON.stringify(obj));
	},
	get_quicks: async () =>
		await get_normal(API_URL.QUICK).then((data) => {
			console.log("가져온 quickList", data.quickList);
			return data;
		}),
	set_quicks: (obj) => {
		console.log("저장할 퀵리스트", obj);
		post_json(API_URL.QUICK, obj);
	},
	getIcons: () => {
		return JSON.parse(localStorage.getItem("icons")) || [];
	},
	get_icons: async () =>
		await get_normal(API_URL.ICON).then((data) => {
			console.log("가져온 icons", data.icons);
			return data.icons;
		}),
	set_icons: (obj) => {
		console.log("아이콘 변경", obj);
		localStorage.setItem("icons", JSON.stringify(obj));
	},
	set_icon: (obj) => {
		console.log("set_icon", obj);
		post_urlFormData(API_URL.ICON, obj).then((data) => {
			console.log(data);
		});
	},
	delete_icon: (obj) => {
		console.log("delete_icon", obj);
		delete_normal(API_URL.ICON, obj).then((data) => {
			console.log(data);
		});
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
