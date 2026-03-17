---
layout: default
title: Issue一覧（議題・ディスカッション）
---

<h1>Issue一覧（議題・ディスカッション）</h1>

<p>
このページでは、GitHub リポジトリ上の Issue（議題）を一覧表示しています。各Issueのタイトルをクリックすると、GitHub 上で詳細な議論と履歴を確認できます。関連する Pull Request があれば、「提案詳細」として一覧の下に表示されます。
</p>

<p>
  <a
    class="btn-primary"
    href="https://docs.google.com/forms/d/e/1FAIpQLScZBArAB1cg-QL9BKSFNDfdgHOctV9qMG-TIZRm8ekI2HgU0g/viewform"
    target="_blank"
    rel="noopener noreferrer"
  >
    新しい政策要望を投稿する（Googleフォームが開きます）
  </a>
</p>

{% assign issues = site.data.issues | sort: "number" | reverse %}

{% if issues and issues.size > 0 %}
  <ul>
    {% for issue in issues %}
      <li>
        <h2>
          <a href="{{ issue.html_url }}" target="_blank" rel="noopener noreferrer">
            #{{ issue.number }} {{ issue.title }}
          </a>
        </h2>
        <p>
          状態: {{ issue.state }} /
          作成日: {{ issue.created_at | date: "%Y-%m-%d" }} /
          最終更新: {{ issue.updated_at | date: "%Y-%m-%d" }}
        </p>
        {% if issue.summary %}
          <p>{{ issue.summary }}…</p>
        {% endif %}

        {% if issue.related_prs and issue.related_prs.size > 0 %}
          <details>
            <summary>提案詳細（関連Pull Request）</summary>
            <ul>
              {% for pr in issue.related_prs %}
                <li>
                  <p>
                    <strong>
                      PR #{{ pr.number }} {{ pr.title }}
                    </strong>
                    <span>
                      （状態: {{ pr.state }}{% if pr.merged_at %}, マージ日: {{ pr.merged_at | date: "%Y-%m-%d" }}{% endif %}）
                    </span>
                  </p>
                  {% if pr.body_summary %}
                    <p>{{ pr.body_summary }}{% if pr.body_summary.size == 400 %}…{% endif %}</p>
                  {% endif %}
                  <p>
                    <a href="{{ pr.html_url }}" target="_blank" rel="noopener noreferrer">
                      GitHub でこの提案の全文と差分を見る
                    </a>
                  </p>
                </li>
              {% endfor %}
            </ul>
          </details>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
{% else %}
  <p>まだIssueが登録されていないか、データ取得前です。</p>
{% endif %}

