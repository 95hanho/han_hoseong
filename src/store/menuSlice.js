import { writable } from "svelte/store";

export const menuList = create_menuList();

function create_menuList() {
	const { set, subscribe, update } = writable({});

	return { set, subscribe, update };
}
