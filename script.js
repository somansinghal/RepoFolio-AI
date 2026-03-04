async function generatePortfolio(){

    const username = document.getElementById("username").value
    const theme = document.getElementById("themeSelect").value
    
    document.body.className = theme
    
    const portfolio = document.getElementById("portfolio")
    
    portfolio.innerHTML="Loading..."
    
    const user = await fetch(`https://api.github.com/users/${username}`)
    const userData = await user.json()
    
    const repos = await fetch(`https://api.github.com/users/${username}/repos`)
    const repoData = await repos.json()
    
    // AI Summary
    let summary = `Developer with ${repoData.length} public repositories and ${userData.followers} followers on GitHub.`
    
    let html = `
    
    <div class="card">
    
    <h2>${userData.name || username}</h2>
    
    <p>${summary}</p>
    
    <p>${userData.bio || ""}</p>
    
    <a href="${userData.html_url}" target="_blank">GitHub Profile</a>
    
    </div>
    
    `
    
    repoData.slice(0,6).forEach(repo=>{
    
    html += `
    
    <div class="card">
    
    <h3>${repo.name}</h3>
    
    <p>${repo.description || "Project repository"}</p>
    
    <a href="${repo.html_url}" target="_blank">View Repo</a>
    
    </div>
    
    `
    
    })
    
    portfolio.innerHTML = html
    
    }
    
    // Download portfolio
    
    function downloadPortfolio(){
    
    const content = document.documentElement.outerHTML
    
    const blob = new Blob([content], {type:"text/html"})
    
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement("a")
    
    a.href = url
    a.download = "portfolio.html"
    
    a.click()
    
    }