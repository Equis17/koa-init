const fs = require('fs');
const Router = require('koa-router');
const schedule = require('node-schedule');

function load(dir, cb) {
  const url = path.resolve(__dirname, dir);
  const files = fs.readdirSync(url);
  files.forEach(fileName => {
    fileName = fileName.replace('.js', '');
    const file = require(`${url}/${fileName}`);
    cb(fileName, file);
  });
}

function initRouter(app) {
  const router = new Router();
  load('routes', (fileName, routes) => {
    const prefix = fileName === 'index' ? '' : fileName;
    routes = typeof routes === 'function' ? routes(app) : routes;
    Object.keys(routes).
    forEach(route => {
      const [method, path] = route.split(' ');
      router[method](prefix + path, async ctx => {
        app.ctx = ctx;
        await routes[route](app);
      });
    });
  });
  return router;
}

function initController(app) {
  const controllers = {};
  load('controller', (fileName, controller) => {
    controllers[fileName] = controller[app];
  });
  return controllers;
}

function initService(app) {
  const services = {};
  load('service', (fileName, service) => {
    services[fileName] = service(app);
  });
  return services;
}

function initConfig(app) {
  load('config', (fileName, config) => {
    if (config.db) {
      app.$db = new Sequelize(config.db);
      app.$model = {};
      load('model', (fileName, {schema, options}) => {
        app.$model[fileName] = app.$db.define(fileName, schema, options);
      });
      app.$db.sync({force: false});
    }
    if (config.middleWares) {
      config.middleWares.forEach(mid => {
        const midPath = path.resolve(__dirname, 'middleware', mid);
        app.$app.use(midPath);
      });
    }
  });
}

function initSchedule() {
  load('schedule', (fileName, scheduleConfig) => {
    schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler);
  });
}
