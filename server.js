const koa = require('koa');
const cluster = require('cluster');
const process = require('process');
const {
  initRouter,
  initController,
  initService,
  initConfig,
  initSchedule
} = require('./koa-loader');

class Server {
  constructor(conf) {
    initSchedule();
    this.$app = new koa(conf);
    initConfig(this);
    this.$ctrl = initController(this);
    this.$service = initService(this);
    this.$router = initRouter(this);
    this.$app.use(this.$router.routes());
  }

  start(port) {
    this.$app.listen(port, () => {
      console.log('服务器启动成功,端口:', port, ' ', 'worker:', cluster.worker.id, ' ', 'PID:', process.pid);
    });
  }
}

module.exports = Server;
