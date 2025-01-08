import "font-awesome/css/font-awesome.css";
/*  */
import "./assets/css/reset.css";
import "./assets/css/style.css";
import "./assets/css/style_tablet.css";
import "./assets/css/style_pc.css";
/*  */
import "moment/locale/ko";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
