const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const USERNAME = process.env.GITHUB_USERNAME;

// ─── Fetch data profile & semua repo publik ───────────────────────────────────
async function fetchProfileData() {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USERNAME}`, { headers }),
    fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
      { headers }
    ),
  ]);

  const [user, repos] = await Promise.all([userRes.json(), reposRes.json()]);

  const ownRepos = Array.isArray(repos)
    ? repos
        .filter((r) => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
    : [];

  const totalStars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = ownRepos.reduce((s, r) => s + r.forks_count, 0);

  // Hitung bahasa favorit
  const langCount = {};
  ownRepos.forEach((r) => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  });
  const topLanguages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang]) => lang);

  const topRepos = ownRepos.slice(0, 6).map((r) => ({
    name: r.name,
    description: r.description || "Tidak ada deskripsi",
    url: r.html_url,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language || "Unknown",
    topics: r.topics || [],
  }));

  return {
    username: USERNAME,
    name: user.name || USERNAME,
    bio: user.bio || "",
    company: user.company || "",
    location: user.location || "",
    blog: user.blog || "",
    twitter: user.twitter_username || "",
    public_repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    total_stars: totalStars,
    total_forks: totalForks,
    top_languages: topLanguages,
    top_repos: topRepos,
    member_since: new Date(user.created_at).getFullYear(),
  };
}

// ─── Build prompt profile ─────────────────────────────────────────────────────
function buildProfilePrompt(data) {
  const repoList = data.top_repos
    .map(
      (r) =>
        `- **${r.name}** (⭐${r.stars} | 🍴${r.forks}): ${r.description} [${r.language}]`
    )
    .join("\n");

  return `Kamu adalah expert GitHub profile designer. Buatkan profile README.md yang kreatif, menarik, dan profesional.

## DATA PROFIL
- Username: ${data.username}
- Nama: ${data.name}
- Bio: ${data.bio || "(tidak ada)"}
- Perusahaan: ${data.company || "-"}
- Lokasi: ${data.location || "-"}
- Website: ${data.blog || "-"}
- Twitter: ${data.twitter ? "@" + data.twitter : "-"}
- Member sejak: ${data.member_since}
- Public repos: ${data.public_repos}
- Followers: ${data.followers} | Following: ${data.following}
- Total stars: ${data.total_stars}
- Total forks: ${data.total_forks}
- Bahasa favorit: ${data.top_languages.join(", ")}

## TOP REPOS
${repoList}

## INSTRUKSI

Buat profile README yang KREATIF dan MENARIK dengan elemen berikut:

1. **Header animasi** menggunakan capsule-render:
   \`\`\`
   https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=${encodeURIComponent(data.name)}&fontSize=50&fontAlignY=35&animation=fadeIn
   \`\`\`

2. **Typing animation** menggunakan readme-typing-svg:
   \`\`\`
   https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=20&pause=1000&width=500&lines=<isi+dengan+kalimat+relevan+berdasarkan+bio>
   \`\`\`

3. **Tentang saya** — paragraf singkat berdasarkan bio dan data yang ada

4. **Tech Stack badges** — gunakan shields.io berdasarkan top languages:
   Format: \`![Lang](https://img.shields.io/badge/Lang-COLOR?style=for-the-badge&logo=lang&logoColor=white)\`

5. **GitHub Stats** dalam satu baris tengah:
   - Stats card: \`https://github-readme-stats.vercel.app/api?username=${data.username}&show_icons=true&theme=tokyonight&hide_border=true\`
   - Top langs: \`https://github-readme-stats.vercel.app/api/top-langs/?username=${data.username}&layout=compact&theme=tokyonight&hide_border=true\`

6. **Streak stats**:
   \`https://github-readme-streak-stats.herokuapp.com/?user=${data.username}&theme=tokyonight&hide_border=true\`

7. **Repo unggulan** — tampilkan top 4 repo menggunakan repo card (grid 2 kolom):
   \`https://github-readme-stats.vercel.app/api/pin/?username=${data.username}&repo=NAMA_REPO&theme=tokyonight&hide_border=true\`

8. **Trophy**:
   \`https://github-profile-trophy.vercel.app/?username=${data.username}&theme=tokyonight&column=6&no-frame=true\`

9. **Footer wave** penutup dari capsule-render:
   \`https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer\`

10. **Visitor counter** (opsional):
    \`https://komarev.com/ghpvc/?username=${data.username}&color=blueviolet&style=flat-square\`

ATURAN:
- Tulis dalam Bahasa Indonesia kecuali nama teknis
- Gunakan \`<p align="center">\` untuk memusatkan elemen visual
- Buat semenarik dan sekreatif mungkin tapi tetap profesional
- Output HANYA konten Markdown, tanpa penjelasan di luar Markdown`;
}

// ─── Generate via Gemini ──────────────────────────────────────────────────────
async function generateProfileReadme(data) {
  console.log("🤖 Mengirim data profile ke Gemini API...");
  const result = await model.generateContent(buildProfilePrompt(data));
  let text = result.response.text();
  text = text.replace(/^```markdown\n?/i, "").replace(/\n?```$/i, "").trim();
  return text;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log(`📡 Mengambil data profile: ${USERNAME}`);
    const profileData = await fetchProfileData();

    console.log(`✅ Nama: ${profileData.name}`);
    console.log(`   Repos: ${profileData.public_repos}`);
    console.log(`   Top langs: ${profileData.top_languages.join(", ")}`);
    console.log(`   Total stars: ${profileData.total_stars}`);

    const readme = await generateProfileReadme(profileData);

    fs.writeFileSync("README.md", readme, "utf-8");
    console.log("✅ Profile README.md berhasil ditulis!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
