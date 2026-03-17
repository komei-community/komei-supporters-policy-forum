/**
 * Google フォーム → GitHub Issue 自動登録スクリプト（政策要望用）
 *
 * このスクリプトは Google フォームの送信をトリガーに、
 * GitHub リポジトリに政策要望の Issue を自動作成します。
 */

// ====================
// 設定（スクリプトプロパティから取得）
// ====================
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    GITHUB_TOKEN: props.getProperty("GITHUB_TOKEN"),
    REPO_OWNER: props.getProperty("REPO_OWNER"),   // 例: "kkhassou"
    REPO_NAME: props.getProperty("REPO_NAME"),      // 例: "komei-supporters-policy-forum"
  };
}

// ====================
// フォーム送信時のトリガー関数
// ====================
function onFormSubmit(e) {
  const responses = e.response.getItemResponses();
  const answers = {};

  responses.forEach(function (itemResponse) {
    answers[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  });

  createRequestIssue(answers);
}

// ====================
// 政策要望 Issue 作成
// ====================
function createRequestIssue(answers) {
  const title = truncate(answers["タイトル"] || "世の中の○○を変えてほしい", 200);

  const body = [
    "## 概要",
    answers["概要"] || "（未記入）",
    "",
    "## 背景・動機",
    answers["背景・動機"] || "（未記入）",
    "",
    "## 実例・社会統計",
    answers["実例・社会統計"] || "（未記入）",
    "",
    "## 要望の方針",
    answers["要望の方針"] || "（未記入）",
    "",
    "## その他・補足",
    answers["その他・補足"] || "（未記入）",
    "",
    "---",
    "_この Issue は Google フォームから自動投稿されました。_",
  ].join("\n");

  createGitHubIssue(title, body, ["Request"]);
}

// ====================
// ユーティリティ
// ====================
function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "…";
}

// ====================
// GitHub Issue 作成
// ====================
function createGitHubIssue(title, body, labels) {
  const config = getConfig();

  if (!config.GITHUB_TOKEN) {
    Logger.log("エラー: GITHUB_TOKEN が設定されていません。");
    return;
  }

  var url =
    "https://api.github.com/repos/" +
    config.REPO_OWNER +
    "/" +
    config.REPO_NAME +
    "/issues";

  var payload = {
    title: title,
    body: body,
    labels: labels,
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + config.GITHUB_TOKEN,
      Accept: "application/vnd.github.v3+json",
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseCode = response.getResponseCode();

  if (responseCode === 201) {
    var issueData = JSON.parse(response.getContentText());
    Logger.log("Issue 作成成功: " + issueData.html_url);
  } else {
    Logger.log(
      "Issue 作成失敗 (HTTP " + responseCode + "): " + response.getContentText()
    );
  }
}

// ====================
// テスト用関数
// ====================
function testCreateRequestIssue() {
  var testAnswers = {
    タイトル: "[テスト] Google フォーム連携テスト（要望）",
    概要: "これはテスト投稿です。",
    "背景・動機": "フォーム連携の動作確認のため。",
    "実例・社会統計": "なし",
    "要望の方針": "テストのため方針なし",
    "その他・補足": "テスト完了後に削除してください。",
  };
  createRequestIssue(testAnswers);
}
