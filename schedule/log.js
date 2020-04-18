module.exports = {
  interval: '*/3 * * * * *',
  handler() {
    console.log('调用定时任务,定时保存日志,三秒执行一次' + new Date());
  }
};
