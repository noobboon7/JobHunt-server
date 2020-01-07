var fetch = require('node-fetch')
var redis = require("redis"),
    client = redis.createClient();

const {promisify} = require('util');
// const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json?'

async function fetchGithub(){
  let resultCount = 1,
      onPage = 0; 
  const allJobs = [];

  while(resultCount > 0){
    const res = await fetch(`${baseURL}page=${onPage}`);
    const jobs = await res.json();

    allJobs.push(...jobs);
    resultCount = jobs.length;

    console.log('got', jobs.length, 'jobs');
    onPage++;
  }

  console.log('got', allJobs.length, 'jobs');
  // sets github to redis 
  const success = await setAsync('github', JSON.stringify(allJobs));

  console.log({success});
}

fetchGithub()

module.exports = fetchGithub;