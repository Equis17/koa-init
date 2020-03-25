module.exports = {
  'get /': async app => {
    app.ctx.body = await app.$service.user.getName();
  },
  'get /info': app => {
    app.ctx.body = app.$service.user.getAge();
  }
};
