import { get_normal } from "../apiFilter";
import API_URL from "../endpoints";

const commonService_doc = {
  get_menu_version: () => localStorage.getItem("menu_version") || 0,
  set_menu_version: (v) => localStorage.setItem("menu_version", v),
  get_menus: () =>
    get_normal(API_URL.MENU).then((data) => {
      // console.log({ ...data });
      const obj = {};
      data.menus.map((v) => {
        v.menu_list.map((v2) => {
          v2.frame_on = v.frame_on;
        });
        obj[v.parent_name] = v.menu_list;
      });
      // console.log(obj);
      data.menus = obj;
      return data;
    }),
  set_menus: (obj) => {
    console.log(obj);

  },
  get_local_menus: () => {
    return JSON.parse(localStorage.getItem("menus")) || {};
  },
  set_local_menus: (obj) => {
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
        ["background-color"]: "#aaa"
      }
    );
  },
  setBgInfo: (obj) => {
    localStorage.setItem("bg-info", JSON.stringify(obj));
  }
};

export default commonService_doc;
