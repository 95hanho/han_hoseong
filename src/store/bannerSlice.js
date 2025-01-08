import { writable } from "svelte/store";

export const banners = writable({
  calendar: {
    name: "오늘 할일",
    interface: null,
    view: true,
    iconClass: "bi bi-calendar2-check-fill",
  },
  weather: {
    name: "날씨",
    interface: null,
    view: true,
    iconClass: "bi bi-cloud-sun-fill",
  },
});
