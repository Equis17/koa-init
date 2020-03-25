const delay = (data, tick) => new Promise(resolve => {
  setTimeout(() => {
    resolve(data);
  }, tick);
});

module.exports = (app) => ({
  getName: () => app.$model.user.findAll(),
  getAge: () => 20
});
