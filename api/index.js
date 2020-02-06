const express = require('express');
const app = express();
const port = 3001;
const fetchGithub = require('../worker/tasks/fetch-github');

var redis = require("redis"),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    client = redis.createClient();

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

// app.use(
//   session({
//     store: new RedisStore({ client: null }),
//     secret: 'keyboard cat',
//     resave: false,
//   })
// )


app.get('/jobs', async (req, res) => {
  fetchGithub();
  const jobs = await getAsync('github');
  res.header("Access-Control-Allow-Origin", "http://localhost:3000/" );
  return res.send(jobs);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));