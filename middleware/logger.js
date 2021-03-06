const  cluster = require('cluster');

module.exports = async (ctx, next) => {
  console.log('worker:', cluster.worker.id, '------', 'PID:', process.pid);
  console.log('START:',' ',ctx.method.toLocaleUpperCase(), ' ', ctx.path);
  const start = new Date();
  await next();
  const duration = new Date() - start;
  console.log('END  :',' ',ctx.method.toLocaleUpperCase(), ' ', ctx.path, ' ', ctx.status, ' ', duration, 'ms');
};
