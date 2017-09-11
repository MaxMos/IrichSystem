import Router from "vue-router";

//	路由与对应的组件文件
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import Chnlist from "@/components/Chnlist";
import Adlist from "@/components/Adlist";
import Applist from "@/components/Applist";
import Aderlist from "@/components/Aderlist";
import AderIncome from "@/components/AderIncome";
import AmIncome from "@/components/AmIncome";
import AppIncome from "@/components/AppIncome";


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
			component: AppIncome
		}, {
			path: "chnlist",
			name: "chnlist",
			component: Chnlist
		}, {
			path: "applist",
			name: "applist",
			component: Applist
		}, {
			path: "adlist",
			name: "adlist",
			component: Adlist
		}, {
			path: "aderlist",
			name: "aderlist",
			component: Aderlist
		}, {
			path: "aderIncome",
			name: "aderIncome",
			component: AderIncome
		}, {
			path: "amIncome",
			name: "amIncome",
			component: AmIncome
		}, {
			path: "appIncome",
			name: "appIncome",
			component: AppIncome
		}]
	}]
});

export default router;
