import Router from "vue-router";

//	路由与对应的组件文件
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import Profile from "@/components/D_profile";
import Order from "@/components/D_orders";
import Product from "@/components/D_product";
import ProductEdit from "@/components/D_product_edit";

const router = new Router({
	mode	:	"history",
	routes	:	[{
			path		:	"/",
			name		:	"login",
			component	:	Login
		},
		{
			path		:	"/dashboard",
			component	:	Dashboard,
			children	:	[
				{
					path		:	"",
					name		:	"dashboard",
					component	:	Profile
				}, {
					path		:	"profile",
					name		:	"profile",
					component	:	Profile
				}, {
					path		:	"order",
					name		:	"order",
					component	:	Order
				},
				{
					path		:	"product",
					name		:	"product",
					component	:	Product
				},
				{
					path		:	"product/edit/:productId",
					name		:	"productEdit",
					component	:	ProductEdit
				}
			]
		}
	]
});

export default router;
