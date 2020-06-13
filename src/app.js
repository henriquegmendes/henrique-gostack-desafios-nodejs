const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");
const { finder: { findIndexByProp } } = require('./utils/helpers');
const { errorMessages: 
  { invalidIdMessage, projectNotFoundMessage },
} = require('./utils/enums');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newProject = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newProject);

  response.status(200).json(newProject);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) return response.status(400).json(invalidIdMessage);

  const projectIndex = findIndexByProp(repositories, id, 'id');

  if (projectIndex < 0) response.status(400).json(projectNotFoundMessage);

  repositories[projectIndex] = { ...repositories[projectIndex], title, url, techs };

  response.status(200).json(repositories[projectIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json(invalidIdMessage);

  const projectIndex = findIndexByProp(repositories, id, 'id');

  if (projectIndex < 0) response.status(400).json(projectNotFoundMessage);

  repositories.splice(projectIndex, 1);

  response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json(invalidIdMessage);

  const projectIndex = findIndexByProp(repositories, id, 'id');

  if (projectIndex < 0) response.status(400).json(projectNotFoundMessage);

  repositories[projectIndex].likes += 1;

  response.status(200).json({ likes: repositories[projectIndex].likes });
});

module.exports = app;
