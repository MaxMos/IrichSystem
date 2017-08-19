import Router from "vue-router";

//	路由与对应的组件文件
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import Chnlist from "@/components/Chnlist";
import Adlist from "@/components/Adlist";
import Applist from "@/components/Applist";


const router = new Router({
	mode: "history",
	routes: [{
		path: "/",
		name: "login",
		component: Login
	}, {
		path: "/dashboard",
		component: Dashboard,
		children: [{
			path: "",
			name: "dashboard",
			component: Chnlist
		}, {
			path: "chnlist",
			name: "chnlist",
			component: Chnlist
		}, {
			path: "adlist",
			name: "adlist",
			component: Adlist
		}, {
			path: "applist",
			name: "applist",
			component: Applist
		}]
	}]
});

export default router;
