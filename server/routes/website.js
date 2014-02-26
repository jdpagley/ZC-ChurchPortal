
module.exports = function(app) {

    app.all('/api/*', function(req, res) {
        res.send(404);
    });

    app.get('/church', function(req, res) {
        res.render('website/church', {title: "Welcome to the church.ejs page!!"});
    });

    app.get('/member', function(req, res) {
        res.render('website/member', {title: "Welcome to the member.ejs page!!"});
    });

    app.get('*', function(req, res) {
        res.render('website/index', {title: "Welcome to the index.ejs page!!"});
    });
}