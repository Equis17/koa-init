const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const Sequelize = require('sequelize');
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
    const prefix = fileName === 'index' ? '' : `/${fileName}`;
    routes = typeof routes === 'function' ? routes(app) : routes;
    Object.keys(routes).
    forEach(route => {
      const [method, path] = route.split(' ');
      console.log('正在映射地址', `${method.toLocaleUpperCase()} ${prefix}${path}`);
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
    controllers[fileName] = controller(app);
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
  load('config', (filename, conf) => {
    if (conf.db) {
      app.$db = new Sequelize(conf.db);
      app.$model = {};
      load('model', (fileName, {schema, options}) => {
        app.$model[fileName] = app.$db.define(fileName, schema, options);
      });
      app.$db.sync();
    }
    if (conf.middleware) {
      conf.middleware.forEach(mid => {
        const midPath = path.resolve(__dirname, 'middleware', mid);
        app.$app.use(require(midPath));
      });
    }
  });
}

function initSchedule() {
  load('schedule', (fileName, scheduleConfig) => {
    schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler);
  });
}


module.exports = {initRouter, initController, initService, initConfig, initSchedule};
