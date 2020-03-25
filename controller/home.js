module.exports = (app) => ({
  index: async () => {
    app.ctx.body = await app.$service.user.getName();
  },
  detail: async () => {
    app.ctx.body = 'detail';
  }
});
