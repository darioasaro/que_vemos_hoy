module.exports = routes = app => {
    app.use("/", require('./movies.js'));
}