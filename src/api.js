import axios from "axios";
import { push } from "svelte-spa-router";

const instance = axios.create({
	// baseURL: "https://ds-api.exc.co.kr",
});
// 토큰체크 안하는 url
const notTokenCheckUrl = [];

instance.interceptors.request.use(
	async (res) => {
		// console.log(res.url);
		// res.url = hostUrl + res.url;
		// console.log(res.url, res.data);
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
		return Promise.reject(err.response.data?.msg);
	}
);

export default instance;

// 403
