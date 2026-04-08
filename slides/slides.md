---
# try `npm run dev` to view the slides
theme: default
background: https://cover.sli.dev
title: 公明サポーターズ政策協議 - Slidev
info: |
  公明サポーターズ政策協議リポジトリ向け Slidev 初期セットアップ
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

<style>
:root {
  --kp-accent: #2f5f73;
  --kp-secondary: #e6a72f;
  --kp-bg: #ffffff;
  --kp-text: #24313a;
}

.slidev-page {
  background: var(--kp-bg);
  color: var(--kp-text);
}

.slidev-page h1,
.slidev-page h2,
.slidev-page h3 {
  letter-spacing: 0.02em;
}

.slidev-page h1 {
  border-left: 10px solid var(--kp-accent);
  padding-left: 14px;
  color: #1f4554;
}

.content-slide ul li::marker,
.content-slide ol li::marker {
  color: var(--kp-accent);
}

.content-slide {
  position: relative;
}

.content-slide::after {
  content: "";
  position: absolute;
  right: 28px;
  bottom: 20px;
  width: 90px;
  height: 6px;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--kp-accent), var(--kp-secondary));
  opacity: 0.95;
}

.card {
  margin-top: 14px;
  border: 1px solid #d6e1e6;
  border-left: 8px solid var(--kp-accent);
  border-radius: 14px;
  padding: 16px 18px;
  background: #f9fcfd;
  box-shadow: 0 10px 26px rgba(47, 95, 115, 0.08);
}

.chip {
  display: inline-block;
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 9999px;
  background: #fff6df;
  color: #7f5b1a;
  border: 1px solid #f0cf89;
  margin-bottom: 8px;
}
</style>

# 公明サポーターズ政策協議

GitHubを活用した公明党宛政策提言ツール

---
class: content-slide
---

# なんでGitHub?/GitHubってなに?

<div class="chip">WHY GITHUB</div>
<div class="card">

- GitHubとは
  - GitHubはプログラマーたちが様々なコード差分を凝集させるためのサイトです
  - 差分管理に特化しており、変更を入れるためのやり取り(ディスカッション)をするのに使いやすい
- なんでGitHubがいいの?
  - 会話履歴が全部残るのでどのように政策が育ち、採用されていったかの透明性が高い
  - 生成AIを使って「なやみごと」を「政策提言」に変換できる
  - 市民と立法者(政治家)の連携が身に見える形で残るようになる
- チームみらいが取り入れていて一躍有名になった(このとき、生成AIは使われていない)
  - チームみらいは衆院選後GitHubを閉鎖(個々のものをどうするかは明言無し)
  - 公明党は政策実現力が高く、提案→実現のサイクルが回れば世間の評価が上がるはず

</div>

---
class: content-slide
---

# できること

<div class="chip">WHAT YOU CAN DO</div>
<div class="card">

1. 悩み事を「Issue」として登録すると生成AIで政策提言として「PullRequest」を作れる
2. GitHubアカウントさえあれば誰でも提言に意見が出せる
3. 提案中のもの・採択されて法案調整に入っているもの・実現されたものが簡単に一覧で見れる

</div>

---
class: content-slide
---

# デメリット(対策済み)

<div class="chip">CHALLENGES & SOLUTIONS</div>
<div class="card">

- GitHubアカウントがないと参画できない=プログラマーじゃないと知らない人が多い
- GoogleフォームでIssueを投稿可能に
- アカウントが無くても閲覧できるサイトを作成済み

</div>

---
class: content-slide
---

# ゴール
<div class="chip">GOAL</div>
<div class="card">

- 一人一人が政治を監視し、自らが政治の主役であることを自覚できる社会になる
- その最適なパートナーが公明党であることをアピールできる

</div>

# おまけのいいところ
<div class="chip">EXTRA</div>
<div class="card">

- 運営メンバーがDiscordだけで通知を受け取って対処できる
- ユーザーも運営メンバーも無料でいい
- セキュリティはGitHub, Googleが頑張ってくれる(システムとしてユーザー情報を一切持たない)
- ユーザーBANや提案却下が楽

</div>
