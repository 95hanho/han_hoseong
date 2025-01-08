import { writable } from "svelte/store";
import bg_example from "../assets/img/bg/coming-soon.jpg";

export const modal_result = writable("");

export const modal_alert = create_modal_alert();
export const modal_alert_txt = writable("");

export const modal_menuModify = create_modal_menuModify();
export const modal_menu = writable({});

export const modal_bgModify = create_modal_bgModify();
export const bg_info = writable({
	["background-image"]: bg_example,
	["background-size"]: "cover" /* 배경 이미지를 화면에 맞게 조절 */,
	["background-repeat"]: "no-repeat" /* 배경 이미지 반복하지 않음 */,
	["background-position"]: "center" /* 배경 이미지를 가운데 정렬 */,
	["background-color"]: "#eee",
});

function create_modal_alert() {
	const { set, subscribe } = writable(false);
	const open = (txt) => {
		set(true);
		modal_alert_txt.set(txt);
	};
	const close = () => set(false);
	return { open, close, subscribe };
}

function create_modal_menuModify() {
	const { set, subscribe } = writable(false);

	const open = (subMenu) => {
		set(true);
		modal_menu.set(subMenu);
	};
	const close = () => {
		set(false);
	};

	return { open, close, subscribe };
}

function create_modal_bgModify() {
	const { set, subscribe } = writable(false);

	const open = () => {
		set(true);
	};
	const close = () => {
		set(false);
	};

	return { open, close, subscribe };
}
