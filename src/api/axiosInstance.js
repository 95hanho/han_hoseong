// Axios 인스턴스 생성 및 설정
import axios from "axios";
import { cookies } from "../cookies";
import API_URL from "./endpoints";
import { modal_alert } from "../store/modalSlice";

const instance = axios.create({
  baseURL: process.env.VITE_BASEURL,
  timeout: 5000
});
instance.defaults.withCredentials = true; // 쿠키 전송 허락락

let disconnected = false;

// 토큰체크 안하는 url
const notTokenCheckUrl = [
  API_URL.TESTLOGIN,
  API_URL.TESTTOKEN,
  API_URL.TESTUSER
];

instance.interceptors.request.use(
  async (res) => {
    // console.log(res.url);

    return res;
  },
  (err) => {
    return Promise.reject(err.response);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err);
    if (err.response.status == 403 && !disconnected) {
      modal_alert.open("권한이 없어서 정보가 저장되지 않습니다.");
      disconnected = true;
    }
    return Promise.reject(err.response.data);
  }
);

export default instance;
