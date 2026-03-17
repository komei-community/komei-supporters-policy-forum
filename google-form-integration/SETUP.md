# Google フォーム → GitHub Issue 自動登録 セットアップガイド

Google フォームから本リポジトリに Issue を自動登録するための手順です。

## 前提条件

- Google アカウント
- GitHub アカウント（リポジトリへの Issue 作成権限あり）

## 手順

### 1. GitHub Personal Access Token の発行

1. GitHub にログインし、[Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta) を開く
2. 「Generate new token」をクリック
3. 以下を設定:
   - **Token name**: `google-form-issue-creator`（任意）
   - **Expiration**: 必要な期間を選択
   - **Repository access**: 「Only select repositories」→ `komei-supporters-policy-forum` を選択
   - **Permissions**: Repository permissions > **Issues** → `Read and write`
4. 「Generate token」をクリックし、表示されたトークンをコピー（この画面を閉じると再表示できません）

### 2. Google フォームの作成（自動）

`create-form.js` を使ってフォームを自動作成できます。

1. [Google Apps Script](https://script.google.com/) で新規プロジェクトを作成
2. `create-form.js` の内容を貼り付ける
3. `createIssueForm` を選択して ▶️（実行）をクリック
4. Google アカウントの認証を求められたら許可する
5. 実行ログにフォームの**編集URL**と**回答URL**が表示される

作成されるフォームの構成:
- タイトル（短文・必須）
- 概要（長文・必須）
- 背景・動機（長文・任意）
- 実例・社会統計（長文・任意）
- 要望の方針（長文・任意）
- その他・補足（長文・任意）

### 3. Google Apps Script の設定（Issue 自動登録）

1. 手順2で作成されたフォームの編集URLを開く
2. 右上の **︙（メニュー）> スクリプトエディタ** を開く
3. エディタに `gas-code.js` の内容をすべて貼り付ける
3. **スクリプトプロパティの設定**:
   - 左メニューの ⚙️（プロジェクトの設定）を開く
   - 「スクリプト プロパティ」セクションで以下を追加:

   | プロパティ名 | 値 |
   |------------|---|
   | `GITHUB_TOKEN` | 手順1で発行したトークン |
   | `REPO_OWNER` | `kkhassou`（リポジトリオーナー名） |
   | `REPO_NAME` | `komei-supporters-policy-forum` |

### 4. トリガーの設定

1. Apps Script エディタの左メニューから **⏰（トリガー）** を開く
2. 「トリガーを追加」をクリック
3. 以下を設定:
   - **実行する関数**: `onFormSubmit`
   - **イベントのソース**: フォームから
   - **イベントの種類**: フォーム送信時
4. 「保存」をクリック
5. Google アカウントの認証を求められたら許可する

### 5. 動作テスト

1. Apps Script エディタで `testCreateRequestIssue` を選択し、▶️（実行）をクリック
2. GitHub リポジトリの Issues タブにテスト Issue が作成されることを確認
3. テスト Issue を確認後、閉じるか削除する
4. 実際にフォームからテスト回答を送信し、Issue が作成されることを確認

## トラブルシューティング

### Issue が作成されない場合

1. **Apps Script のログを確認**: 実行ログ（表示 > ログ）でエラーメッセージを確認
2. **トークンの権限を確認**: Fine-grained token の場合、Issues の Read and write 権限があるか確認
3. **トリガーが設定されているか確認**: トリガー一覧に `onFormSubmit` があるか確認
4. **フォームの質問タイトルが一致しているか確認**: GAS コード内の `answers["質問タイトル"]` とフォームの質問タイトルが完全一致している必要があります

### トークンの有効期限が切れた場合

1. GitHub で新しいトークンを発行
2. スクリプトプロパティの `GITHUB_TOKEN` を新しいトークンに更新

## セキュリティに関する注意

- **GitHub Token はスクリプトプロパティに保存**してください。コード内にハードコーディングしないでください
- トークンには **必要最小限の権限**（Issues の Read and write のみ）を付与してください
- 定期的にトークンの有効期限を確認し、必要に応じてローテーションしてください
- フォームの公開範囲を適切に設定し、スパム投稿を防止してください
