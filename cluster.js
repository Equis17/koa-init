const os = require('os');
const process = require('process');
const cluster = require('cluster');
const numCPUs = os.cpus().length;


const workers = {};

if (cluster.isMaster) {
  console.log('numCPUs', numCPUs);
  console.log('启动多进程');
  //进程挂掉重启
  cluster.on('death', (worker) => {
    //复制进程到work中
    console.log(111)
    worker = cluster.fork();
    workers[worker.pid] = worker;
  });
  //启动进程
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    workers[worker.pid] = worker;
  }
} else {
  const app = require('./app');
  console.log('worker:', cluster.worker.id, '------', 'PID:', process.pid);
  app.start(3000);
}

process.on('SIGTERM', () => {
  for (let pid in workers) {
    console.log('关闭进程:', pid);
    process.kill(~~pid);
  }
  process.exit(0);
});

