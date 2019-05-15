const { Router } = require('express');

const PAGE = '/posts';

module.exports = (app) => {
  const posts = Router();

  posts.get('/create', (req, res) => {
    const queryParams = { create: true };
    app.render(req, res, PAGE, queryParams);
  });

  posts.get('/:id', (req, res) => {
    const queryParams = { id: req.params.id };
    app.render(req, res, PAGE, queryParams);
  });

  posts.get('/:id/edit', (req, res) => {
    const queryParams = { id: req.params.id, edit: true };
    app.render(req, res, PAGE, queryParams);
  });

  return posts;
};
