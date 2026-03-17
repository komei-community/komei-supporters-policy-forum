---
layout: default
title: Issue一覧（議題・ディスカッション）
---

<h1>Issue一覧（議題・ディスカッション）</h1>

<p>
このページでは、GitHub リポジトリ上の Issue（議題）を一覧表示しています。各Issueのタイトルをクリックすると、GitHub 上で詳細な議論と履歴を確認できます。
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
      </li>
    {% endfor %}
  </ul>
{% else %}
  <p>まだIssueが登録されていないか、データ取得前です。</p>
{% endif %}

