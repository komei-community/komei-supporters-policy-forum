/**
 * Google フォーム自動作成スクリプト（政策要望用）
 *
 * このスクリプトを Google Apps Script で実行すると、
 * 政策要望を GitHub Issue として投稿するためのフォームが自動作成されます。
 *
 * 使い方:
 *   1. https://script.google.com/ で新規プロジェクトを作成
 *   2. このコードを貼り付けて createIssueForm() を実行
 *   3. ログに表示されるフォームURLを確認
 */

function createIssueForm() {
  var form = FormApp.create("公明サポーターズ 政策要望フォーム");
  form.setDescription(
    "公明サポーターズ政策協議リポジトリへの政策要望フォームです。\n" +
    "送信された内容は GitHub Issue として登録されます。"
  );
  form.setConfirmationMessage(
    "ご投稿ありがとうございます。GitHub Issue として登録されました。"
  );

  form.addTextItem()
    .setTitle("タイトル")
    .setHelpText("要望の内容を簡潔に表すタイトルを入力してください。")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("概要")
    .setHelpText("タイトルを補足する要望の概要を記載してください。")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("背景・動機")
    .setHelpText("要望に至った背景や動機を記載してください。")
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle("実例・社会統計")
    .setHelpText("背景にかかる別事例や社会統計の公式記録等があれば記載してください。")
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle("要望の方針")
    .setHelpText(
      "法律を作ってほしいのか、行政サービスの変更をしてほしいのか、" +
      "またはどのようにすれば分からないなど、議論の着地点の方向を記載してください。"
    )
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle("その他・補足")
    .setHelpText("その他の情報・検討事項があれば記載してください。")
    .setRequired(false);

  Logger.log("=== フォーム作成完了 ===");
  Logger.log("編集URL: " + form.getEditUrl());
  Logger.log("回答URL: " + form.getPublishedUrl());

  return form;
}
