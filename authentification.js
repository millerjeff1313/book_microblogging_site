async function checkStatus(req, res, next) {
    console.log(`Session Checker: ${req.session.userid}`);
    if (req.session.userid) {
        next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = {checkStatus}
