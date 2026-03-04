const GITHUB_TOKEN = "Your api key"

async function generatePortfolio(){

const loader=document.getElementById("loader")
const portfolio=document.getElementById("portfolio")

loader.style.display="block"
portfolio.innerHTML=""

const username=document.getElementById("username").value
const theme=document.getElementById("themeSelect").value
const sortType=document.getElementById("sortRepos").value

document.body.className=theme

const headers={
Authorization:`token ${GITHUB_TOKEN}`
}

const userRes=await fetch(`https://api.github.com/users/${username}`,{headers})
const user=await userRes.json()

const repoRes=await fetch(`https://api.github.com/users/${username}/repos`,{headers})
const repos=await repoRes.json()

const eventsRes=await fetch(`https://api.github.com/users/${username}/events`,{headers})
const events=await eventsRes.json()

if(sortType==="stars"){
repos.sort((a,b)=>b.stargazers_count-a.stargazers_count)
}

if(sortType==="name"){
repos.sort((a,b)=>a.name.localeCompare(b.name))
}

let stars=repos.reduce((acc,repo)=>acc+repo.stargazers_count,0)

let languages={}
repos.forEach(repo=>{
if(repo.language){
languages[repo.language]=(languages[repo.language]||0)+1
}
})

let skills=Object.keys(languages)

let score=calculateScore(user,repos,stars)

const topRepo=repos.sort((a,b)=>b.stargazers_count-a.stargazers_count)[0]

let html=`

<div class="card">
<img src="${user.avatar_url}">
<h2>${user.name||username}</h2>
<p>${user.bio||""}</p>
<p>Followers: ${user.followers}</p>
<p>Following: ${user.following}</p>
<p>Public Repos: ${user.public_repos}</p>
<p>Total Stars ⭐ ${stars}</p>
</div>

<div class="card">
<h3>Developer Score</h3>
<h1>${score} / 10</h1>
</div>

<div class="card">
<h3>Language Analytics</h3>
<canvas id="langChart"></canvas>
</div>

<div class="card">
<h3>GitHub Contributions</h3>
<img src="https://ghchart.rshah.org/${username}">
</div>

<div class="card">
<h3>GitHub Streak</h3>
<img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}">
</div>

<div class="card">
<h3>Top Languages</h3>
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact">
</div>

<div class="card">
<h3>Detected Skills</h3>
${skills.map(s=>`<span class="skill">${s}</span>`).join("")}
</div>

<div class="card">
<h3>Top Repository</h3>
<h2>${topRepo.name}</h2>
<p>⭐ ${topRepo.stargazers_count}</p>
<a href="${topRepo.html_url}" target="_blank">View Repo</a>
</div>

<div class="card">
<h3>Recent Activity</h3>
<ul>
${events.slice(0,5).map(e=>`<li>${e.type}</li>`).join("")}
</ul>
</div>
`

repos.slice(0,6).forEach(repo=>{

html+=`

<div class="card repo-card">
<h3>${repo.name}</h3>
<p>${repo.description||"Project repository"}</p>
<p>⭐ ${repo.stargazers_count}</p>
<a href="${repo.html_url}" target="_blank">View Repo</a>
</div>

`
})

portfolio.innerHTML=html

loader.style.display="none"

setTimeout(()=>{

const ctx=document.getElementById("langChart")

new Chart(ctx,{
type:"doughnut",
data:{
labels:Object.keys(languages),
datasets:[{
data:Object.values(languages)
}]
}
})

},500)

}

function calculateScore(user,repos,stars){

let score=0

score+=Math.min(user.followers*0.2,2)
score+=Math.min(repos.length*0.1,2)
score+=Math.min(stars*0.05,3)
score+=Math.min(user.public_repos*0.1,3)

return score.toFixed(1)

}

function filterRepos(){

const input=document.getElementById("repoSearch").value.toLowerCase()
const cards=document.querySelectorAll(".repo-card")

cards.forEach(card=>{
if(card.innerText.toLowerCase().includes(input)){
card.style.display="block"
}else{
card.style.display="none"
}
})

}

function downloadPortfolio(){

const html=document.getElementById("portfolio").innerHTML

const blob=new Blob([html],{type:"text/html"})
const url=URL.createObjectURL(blob)

const a=document.createElement("a")
a.href=url
a.download="github-portfolio.html"
a.click()

}

function sharePortfolio(){

const username=document.getElementById("username").value
const link=`${window.location.origin}?user=${username}`

navigator.clipboard.writeText(link)

alert("Portfolio link copied!")

}

const params=new URLSearchParams(window.location.search)

if(params.get("user")){
document.getElementById("username").value=params.get("user")
generatePortfolio()
}
