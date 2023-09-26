const router = require('express').Router();
const { BearerAuth } = require('../middleware/auth.js');
const fs = require('fs');

fs.readdir("./routes", (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files
    .filter((f) => f !== 'index.js')
    .forEach((file) =>
    {
      const name = file.split('.')?.[0];
      if (!name) return;
      const args = [];
      // 1st arg
      args.push(`/${name}`);
      // 2nd arg
      if (!['auth'].includes(name)) args.push(BearerAuth);
      // 3rd arg
      args.push(require(`./${file}`))
      // Setting up router
      router.use(...args)
    }
    );
  console.log(files);
});
// router.use('/users', BearerAuth, usersRoutes)
// router.use('/auth', authRoutes)

module.exports = router;
