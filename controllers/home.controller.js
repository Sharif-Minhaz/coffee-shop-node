const Checkout = require("../models/Checkout.model");
const Menu = require("../models/Menu.model");
const Flash = require("../utils/Flash");

exports.homeGetController = async (req, res, next) => {
	try {
		let menus = await Menu.find({ category: "menu" }).limit(6);
		let products = await Menu.find({ category: "product" }).limit(3);
		let coffeeMachine = await Menu.findOne({ name: "Coffee Machine" });
		if (req.user) {
			return res.render("pages/home", {
				title: "Coffee Shop",
				values: {},
				flashMessage: Flash.getMessage(req),
				errors: {},
				orders: req.session.orders,
				menus,
				products,
				coffeeMachine,
			});
		}
		res.render("pages/home", {
			title: "Coffee Shop",
			values: {},
			flashMessage: Flash.getMessage(req),
			errors: {},
			orders: {},
			menus,
			products,
			coffeeMachine,
		});
	} catch (err) {
		next(err);
	}
};

exports.homePostController = async (req, res, next) => {
	const { checkoutProductName, productImg, checkoutPrice, quantity, name, address, phone } =
		req.body;
	let order = new Checkout({
		user: req.user._id,
		checkoutProductName,
		productImg,
		checkoutPrice,
		quantity,
		name,
		address,
		phone,
	});
	try {
		await order.save();
		req.flash("success", "Order placed successfully");
		let menus = await Menu.find({ category: "menu" }).limit(6);
		let products = await Menu.find({ category: "products" }).limit(3);
		let orders = await Checkout.find({ user: req.user._id });
		let coffeeMachine = await Menu.findOne({ name: "Coffee Machine" });
		req.session.orders = orders;
		res.render("pages/home", {
			title: "Coffee Shop",
			values: {},
			flashMessage: Flash.getMessage(req),
			errors: {},
			orders: req.session.orders,
			menus,
			products,
			coffeeMachine,
		});
	} catch (err) {
		next(err);
	}
};
