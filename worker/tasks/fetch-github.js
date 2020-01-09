var fetch = require('node-fetch')
var redis = require("redis"),
    client = redis.createClient();

const {promisify} = require('util');
const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json?';

async function fetchGithub(){
  let resultCount = 1,
      onPage = 0; 
  const allJobs = [];

  while(resultCount > 0){
    const res = await fetch(`${baseURL}page=${onPage}`);
    const jobs = await res.json();
    
    // spreads object into array
    allJobs.push(...jobs);
    resultCount = jobs.length;

    console.log('got', jobs.length, 'jobs');
    onPage++;
  }
  console.log('got', allJobs.length, 'jobs');

  //  filter junior jobs 
  const jrJobs = allJobs.filter(job => {
    jobtitle = job.title.toLowerCase();
    let isJunior = true;

    // algo logic 
    if(
      jobtitle.includes('senior') ||
      jobtitle.includes('manager') ||
      jobtitle.includes('sr.') ||
      jobtitle.includes('architect')
    ) {
      return false;
    }
    return true;
  });
  console.log('filtered down to', jrJobs.length);

  // sets github jobs to redis 
  const success = await setAsync('github', JSON.stringify(jrJobs));

  console.log({success});
}

fetchGithub();

module.exports = fetchGithub;