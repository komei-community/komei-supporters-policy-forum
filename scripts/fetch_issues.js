const fs = require("fs");
const path = require("path");

async function main() {
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (!repo) {
    console.error("GITHUB_REPOSITORY is not set");
    process.exit(1);
  }
  if (!token) {
    console.error("GITHUB_TOKEN is not set");
    process.exit(1);
  }

  const apiUrl = `https://api.github.com/repos/${repo}/issues?state=all&per_page=100`;

  const res = await fetch(apiUrl, {
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "komei-supporters-policy-forum-fetch-issues"
    }
  });

  if (!res.ok) {
    console.error("Failed to fetch issues", res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();

  const prsRes = await fetch(`https://api.github.com/repos/${repo}/pulls?state=all&per_page=100`, {
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "komei-supporters-policy-forum-fetch-issues"
    }
  });

  let pulls = [];
  if (prsRes.ok) {
    const rawPulls = await prsRes.json();
    // 本文を短く整形したサマリを付与
    pulls = rawPulls.map(pr => {
      const body = pr.body || "";
      const bodySummary = body
        .replace(/\r\n/g, "\n")
        .split("\n")
        .filter(line => line.trim().length > 0)
        .join(" ")
        .slice(0, 400);
      return {
        number: pr.number,
        title: pr.title,
        html_url: pr.html_url,
        state: pr.state,
        merged_at: pr.merged_at || null,
        body_summary: bodySummary
      };
    });
  } else {
    console.warn("Failed to fetch pull requests", prsRes.status, await prsRes.text());
  }

  const simplified = data
    .filter(item => !item.pull_request) // PRは除外
    .map(issue => {
      const body = issue.body || "";
      const summary = body
        .replace(/\r\n/g, "\n")
        .split("\n")
        .filter(line => line.trim().length > 0)
        .join(" ")
        .slice(0, 280);

      const related_prs = pulls
        .filter(pr => {
          // PR本文中に #<issue番号> が含まれているものを関連PRとみなす
          // body_summary は既に正規化済みだが、念のため title も含めて判定
          const marker = `#${issue.number}`;
          return (pr.body_summary && pr.body_summary.includes(marker)) || (pr.title && pr.title.includes(marker));
        })
        .map(pr => ({
          number: pr.number,
          title: pr.title,
          html_url: pr.html_url,
          state: pr.state,
          merged_at: pr.merged_at || null,
          body_summary: pr.body_summary
        }));

      return {
        number: issue.number,
        title: issue.title,
        html_url: issue.html_url,
        state: issue.state,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        summary,
        related_prs
      };
    });

  const outDir = path.join(__dirname, "..", "web", "_data");
  const outPath = path.join(outDir, "issues.json");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outPath, JSON.stringify(simplified, null, 2), "utf8");
  console.log(`Wrote ${simplified.length} issues to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

