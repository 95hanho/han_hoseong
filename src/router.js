import { wrap } from "svelte-spa-router/wrap";
import Main from "./views/main.svelte";

const router = {
    "/": wrap({
        asyncComponent: async () => {
            return Main;
        },
    }),
};

export default router;
