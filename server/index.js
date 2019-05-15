const express = require('express');
const next = require('next');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

const main = async () => {
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });
  const handle = app.getRequestHandler();

  try {
    await app.prepare();
  } catch (err) {
    console.error(err.stack); // eslint-disable-line
    process.exit(1);
  }

  const server = express();

  server.use('/posts', routes.posts(app));

  server.get('*', (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`); // eslint-disable-line
  });
};

main();