const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// This function is responsible to log all reqs of the api
function logreqs(req, res, next) {
  const { method, url} = req
  const logLabel = `[${method.toUpperCase()}] ${url}`
  console.time(logLabel)
  next();
  console.timeEnd(logLabel)
}

// This function is responsible to validate if the repository ID is the
// type uid.
function validadeRepositoryId(req, res, next){
  const { id } = req.params
  if (!isUuid(id)){
    return res.status(400).json({error: 'Invalid repository ID.'})
  }
  return next();
}

app.use(logreqs);
app.use('/repositories/:id', validadeRepositoryId)

app.get("/repositories", (req, res) => {

  return res.json(repositories)

});

app.post("/repositories", (req, res) => {

  const { title, url, techs } = req.body

  const repository = { 
    id: uuid(), 
    title,
    url,
    techs,
    likes: 0
 }

 repositories.push(repository)
 return res.json(repository)
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  let repository = repositories[repositoryIndex]

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' })
  }

  repository.title = title
  repository.url = url
  repository.techs = techs

  repositories[repositoryIndex] = repository;
  return res.json(repository)

});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repositoryIndex, 1)

  return res.status(204).send();


});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' })
  }

  let repository = repositories[repositoryIndex]
  
  repository.likes++

  return res.json(repository)
  
});

module.exports = app;
