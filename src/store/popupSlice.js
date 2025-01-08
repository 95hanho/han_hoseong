import { writable } from "svelte/store";

export const popup_command = writable(0);

export const scheduleList = writable([
	// {
	// 	id: 1,
	// 	name: "가나다라마바사",
	// 	date: "2024-04-03 15:00",
	// 	complete: false,
	// },
]);
