const fs = require("fs");
const path = require("path");

function summarizeBody(body, maxLength) {
  return (body || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter(line => line.trim().length > 0)
    .join(" ")
    .slice(0, maxLength);
}

function normalizePrState(state) {
  if (!state) return "open";
  return String(state).toLowerCase();
}

async function fetchLinkedPrsByGraphql(repo, token, issueNumber) {
  const [owner, name] = repo.split("/");
  if (!owner || !name) return [];

  const query = `
    query($owner: String!, $name: String!, $issueNumber: Int!) {
      repository(owner: $owner, name: $name) {
        issue(number: $issueNumber) {
          timelineItems(
            first: 100
            itemTypes: [CROSS_REFERENCED_EVENT, CONNECTED_EVENT]
          ) {
            nodes {
              __typename
              ... on CrossReferencedEvent {
                source {
                  __typename
                  ... on PullRequest {
                    number
                    title
                    url
                    state
                    mergedAt
                    body
                  }
                }
              }
              ... on ConnectedEvent {
                subject {
                  __typename
                  ... on PullRequest {
                    number
                    title
                    url
                    state
                    mergedAt
                    body
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "komei-supporters-policy-forum-fetch-issues"
    },
    body: JSON.stringify({
      query,
      variables: { owner, name, issueNumber }
    })
  });

  if (!res.ok) {
    const text = await res.text();
    console.warn(`GraphQL failed for issue #${issueNumber}`, res.status, text);
    return [];
  }

  const payload = await res.json();
  if (payload.errors && payload.errors.length > 0) {
    console.warn(`GraphQL errors for issue #${issueNumber}`, JSON.stringify(payload.errors));
    return [];
  }

  const nodes = payload?.data?.repository?.issue?.timelineItems?.nodes || [];
  const results = [];
  for (const node of nodes) {
    let pr = null;
    if (node?.__typename === "CrossReferencedEvent" && node?.source?.__typename === "PullRequest") {
      pr = node.source;
    } else if (node?.__typename === "ConnectedEvent" && node?.subject?.__typename === "PullRequest") {
      pr = node.subject;
    }
    if (!pr) continue;

    results.push({
      number: pr.number,
      title: pr.title,
      html_url: pr.url,
      state: normalizePrState(pr.state),
      merged_at: pr.mergedAt || null,
      body_summary: summarizeBody(pr.body, 400)
    });
  }
  return results;
}

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

  const apiUrl = `https://api.github.com/repos/${repo}/issues?state=open&per_page=100`;

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
    pulls = rawPulls.map(pr => ({
        number: pr.number,
        title: pr.title,
        html_url: pr.html_url,
        state: pr.state,
        merged_at: pr.merged_at || null,
        body_summary: summarizeBody(pr.body, 400)
      }));
  } else {
    console.warn("Failed to fetch pull requests", prsRes.status, await prsRes.text());
  }

  const simplified = await Promise.all(
    data
      .filter(item => !item.pull_request) // PRは除外
      .map(async issue => {
      const summary = summarizeBody(issue.body, 280);

      const markerRelatedPrs = pulls
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

      const linkedPrs = await fetchLinkedPrsByGraphql(repo, token, issue.number);
      const relatedPrMap = new Map();
      for (const pr of [...markerRelatedPrs, ...linkedPrs]) {
        relatedPrMap.set(pr.number, pr);
      }
      const related_prs = Array.from(relatedPrMap.values()).sort((a, b) => b.number - a.number);

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
    })
  );

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

