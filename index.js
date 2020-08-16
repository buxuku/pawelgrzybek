const fs = require("fs");
const { spawn } = require("child_process");
const fetch = require("node-fetch");
const parser = require("xml2json");

const FEED_URL = "https://pawelgrzybek.com/feed.xml";
const TITLE = "Hi y'all 👋";
const DESCRIPTION =
  "I am a self-taught front-end developer looking for an opportunity to work with the latest web technologies. Coming from a background in photography, I have progressed through UI/UX design into front-end development with a growing interest in other bleeding edge technologies. Over time I have become strongly involved in the open-source community where I regularly contribute and create projects, frequently attend conferences and follow other liked-minded geeks. This enables me to always stay fresh in finding the best solutions for technical problems. When I’m not learning or working on another blog post, I indulge my passion for jazz and funk music that helps me to maintain a balance between my virtual and real life.";
const TITLE_MOST_RECENT_POSTS = "Recent blog posts";

const exec = (cmd, args = []) =>
  new Promise((resolve, reject) => {
    const app = spawn(cmd, args, { stdio: "inherit" });
    app.on("close", (code) => {
      if (code !== 0) {
        err = new Error(`Invalid status code: ${code}`);
        err.code = code;
        return reject(err);
      }
      return resolve(code);
    });
    app.on("error", reject);
  });

const commitFile = async () => {
  await exec("git", [
    "config",
    "--global",
    "user.email",
    "readme-bot@example.com",
  ]);
  await exec("git", ["config", "--global", "user.name", "readme-bot"]);
  await exec("git", ["add", "README.md"]);
  await exec("git", [
    "commit",
    "-m",
    ":zap: update readme with the recent activity",
  ]);
  await exec("git", ["push"]);
};

const fetchArticles = async () => {
  const articles = await fetch(FEED_URL);
  const articlesText = await articles.text();

  return parser.toJson(articlesText);
};

async function main() {
  const posts = await fetchArticles();
  console.log(posts);
  const readme = `
# ${TITLE}

${DESCRIPTION}

## ${TITLE_MOST_RECENT_POSTS}

posts here 5

`;

  fs.writeFileSync("./README.md", readme);

  commitFile();
}

try {
  main();
} catch (error) {
  console.error(errors);
}
