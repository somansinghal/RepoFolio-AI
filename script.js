const GITHUB_TOKEN = "Your api key"

const portfolio=document.getElementById("portfolio")

let repos=[]



const params=new URLSearchParams(window.location.search)
const sharedUser=params.get("user")

if(sharedUser){

document.getElementById("username").value=sharedUser
generatePortfolio()

}


async function generatePortfolio(){

const username=document.getElementById("username").value

const userRes=await fetch(`https://api.github.com/users/${username}`)
const user=await userRes.json()

const repoRes=await fetch(`https://api.github.com/users/${username}/repos`)
repos=await repoRes.json()

let totalStars=0
let languages={}

repos.forEach(r=>{

totalStars+=r.stargazers_count

if(r.language)
languages[r.language]=(languages[r.language]||0)+1

})


const score=Math.min(10,Math.floor((repos.length+user.followers+totalStars)/10))


let html=`

<div class="card">

<img src="${user.avatar_url}" width="80">

<h2>${user.name||user.login}</h2>

<p>Followers: ${user.followers}</p>

<p>Repos: ${user.public_repos}</p>

<p>Total Stars: ${totalStars}</p>

</div>

`




html+=`

<div class="card">

<h3>Developer Badge</h3>

<h2>${getDeveloperBadge(score)}</h2>

</div>

`



html+=`

<div class="card">

<h3>Developer Rank</h3>

<h2>${calculateRank(score)}</h2>

</div>

`



const review=generateAIReview(user,repos,totalStars)

html+=`

<div class="card">

<h3>AI GitHub Profile Review</h3>

<h4>Strengths</h4>

<ul>
${review.strengths.map(s=>`<li>✔ ${s}</li>`).join("")}
</ul>

<h4>Improvements</h4>

<ul>
${review.improvements.map(i=>`<li>⚠ ${i}</li>`).join("")}
</ul>

</div>

`




html+=`

<div class="card">

<h3>Detected Skills</h3>

${Object.keys(languages).map(l=>`<span class="skill">${l}</span>`).join("")}

</div>

`



html+=`

<div class="card">

<h3>Activity Heatmap</h3>

<div id="heatmap"></div>

</div>

`



const topRepo=repos.sort((a,b)=>b.stargazers_count-a.stargazers_count)[0]

html+=`

<div class="card">

<h3>Top Repository</h3>

<h2>${topRepo.name}</h2>

<p>⭐ ${topRepo.stargazers_count}</p>

</div>

`




repos.forEach(r=>{

html+=`

<div class="card repo">

<h3>${r.name}</h3>

<p>${r.description||"Project repository"}</p>

<p>⭐ ${r.stargazers_count}</p>

<a href="${r.html_url}" target="_blank">View Repo</a>

</div>

`

})


portfolio.innerHTML=html

generateHeatmap()

}



function getDeveloperBadge(score){

if(score>8) return "🏆 Elite Developer"
if(score>6) return "🚀 Advanced Developer"
if(score>4) return "💻 Intermediate Developer"

return "🌱 Beginner Developer"

}



function calculateRank(score){

if(score>8) return "Top 5% Developer"
if(score>6) return "Top 10% Developer"
if(score>4) return "Top 25% Developer"

return "Rising Developer"

}




function generateAIReview(user,repos,totalStars){

let strengths=[]
let improvements=[]

if(user.followers>20)
strengths.push("Strong community presence")

if(repos.length>20)
strengths.push("Highly active open-source contributor")

if(totalStars>50)
strengths.push("Projects gaining popularity")

if(repos.length<5)
improvements.push("Build more repositories")

if(totalStars<10)
improvements.push("Promote projects to gain stars")

if(!strengths.length)
strengths.push("Building early stage developer portfolio")

return {strengths,improvements}

}



function generateHeatmap(){

const heat=document.getElementById("heatmap")

let grid=""

for(let i=0;i<50;i++){

const level=Math.floor(Math.random()*4)

grid+=`<div class="heat level-${level}"></div>`

}

heat.innerHTML=grid

}




function filterRepos(){

const value=document.getElementById("repoSearch").value.toLowerCase()

document.querySelectorAll(".repo").forEach(r=>{

r.style.display=r.innerText.toLowerCase().includes(value)?"block":"none"

})

}




function sharePortfolio(){

const username=document.getElementById("username").value

const url=`${window.location.origin}?user=${username}`

navigator.clipboard.writeText(url)

alert("Share link copied: "+url)

}




function downloadPortfolio(){

const content=portfolio.innerHTML

const blob=new Blob([content],{type:"text/html"})

const url=URL.createObjectURL(blob)

const a=document.createElement("a")

a.href=url
a.download="portfolio.html"

a.click()

}




async function compareDevelopers(){

const u1=document.getElementById("username").value
const u2=document.getElementById("compareUser").value

if(!u1||!u2)return

const user1=await fetch(`https://api.github.com/users/${u1}`).then(r=>r.json())
const user2=await fetch(`https://api.github.com/users/${u2}`).then(r=>r.json())

document.getElementById("comparison").innerHTML=`

<div class="card">

<h2>Developer Comparison</h2>

<p>${user1.login} Followers: ${user1.followers}</p>

<p>${user2.login} Followers: ${user2.followers}</p>

<p>${user1.login} Repos: ${user1.public_repos}</p>

<p>${user2.login} Repos: ${user2.public_repos}</p>

</div>

`

}
