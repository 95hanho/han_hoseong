import { writable } from "svelte/store";

export const modal_result = writable("");

export const modal_alert = create_modal_alert();
export const modal_alert_txt = writable("");
/*  */
export const modal_confirm = create_modal_confirm();
export const modal_confirm_txt = writable("");
export const modal_confirm_result = writable("");
/*  */
export const modal_menuModify = create_modal_menuModify();
export const modal_menu = writable({
	parent: "",
});
/*  */
export const modal_bgModify = create_modal_bgModify();
export const bg_info = writable({});

function create_modal_alert() {
	const { set, subscribe } = writable(false);
	const open = (txt) => {
		set(true);
		modal_alert_txt.set(txt);
	};
	const close = () => set(false);
	return { open, close, subscribe };
}
function create_modal_confirm() {
	const { set, subscribe } = writable(false);
	let setTxt = "";

	const open = (txt, inSetTxt) => {
		set(true);
		modal_confirm_txt.set(txt);
		setTxt = inSetTxt;
		modal_confirm_result.set("");
	};
	const close = () => set(false);
	const check = () => {
		modal_confirm_result.set(setTxt);
		close();
	};

	return {
		subscribe,
		open,
		close,
		check,
	};
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
	const reset = () => {
		modal_menu.set({
			parent: "",
		});
	};

	return { open, close, subscribe, reset };
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
