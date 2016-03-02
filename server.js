var connect = require('connect'),
    serveStatic = require('serve-static');

connect()
    .use(d)
    .use(serveStatic(__dirname))
    .listen(process.env.PORT || 5000);
