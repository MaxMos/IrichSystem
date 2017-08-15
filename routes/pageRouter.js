const express = require("express"),
	router = express.Router();

router.all("/*", (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		res.redirect("/");
	}
});

module.exports = router;
