const Server = require('./server');
const app = new Server();

if (!module.parent) {
  console.log('运行单进程');
  app.start(3000);
} else {
  module.exports = app;
}
