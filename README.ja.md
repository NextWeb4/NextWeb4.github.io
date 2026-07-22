<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-0969da?style=flat-square" alt="English"></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-c8102e?style=flat-square" alt="简体中文"></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-8250df?style=flat-square" alt="日本語"></a>
</p>

<div align="center">

# NextWeb4 Public Website Runtime

**[nextweb4.github.io](https://nextweb4.github.io/) で配信する、生成済みのブラウザー専用公開サイトです。**

[![公開サイト](https://img.shields.io/badge/%E5%85%AC%E9%96%8B-nextweb4.github.io-0969da?style=flat-square&logo=githubpages&logoColor=white)](https://nextweb4.github.io/)
[![最終コミット](https://img.shields.io/github/last-commit/NextWeb4/NextWeb4.github.io?style=flat-square&logo=github&label=%E6%9C%80%E7%B5%82%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)](https://github.com/NextWeb4/NextWeb4.github.io/commits/main)
[![リポジトリサイズ](https://img.shields.io/github/repo-size/NextWeb4/NextWeb4.github.io?style=flat-square&logo=github&label=%E3%82%B5%E3%82%A4%E3%82%BA)](https://github.com/NextWeb4/NextWeb4.github.io)
![生成ランタイム](https://img.shields.io/badge/%E7%A8%AE%E5%88%A5-%E7%94%9F%E6%88%90%E3%83%A9%E3%83%B3%E3%82%BF%E3%82%A4%E3%83%A0-0969da?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-%E9%9D%99%E7%9A%84-E34F26?style=flat-square&logo=html5&logoColor=white)

<img src="images/hero-campus.jpg" alt="公開ホームページで使用するキャンパス写真" width="900">

</div>

## 目的

このリポジトリは、NextWeb4 個人サイトの公開ランタイム成果物です。ブラウザーへ配信する HTML、CSS、JavaScript、画像、管理対象の公開コンテンツ、この成果物を理解するための文書だけを含みます。

非公開の `NextWeb4/website-source` がエディター、バックエンド、テスト、デプロイワークフロー、執筆履歴を管理します。このリポジトリを開発用ソースや資格情報の保存場所として扱わないでください。

## 閲覧機能

- ライト・ダークテーマと中国語・英語のインターフェース切替。
- 各言語 100 件の日付付き思考アーカイブ。Moments 31 件、iCloud Notes 69 件。
- 操作中、文書が非表示、またはパネルの表示領域が 4 分の 1 未満のときに停止する可視性対応ローテーション。前後移動、読書進捗、出典、読了時間、キーボード操作、ネイティブ全文ダイアログも利用できます。
- GitHub の公開プロジェクト情報を補足し、API が利用できない場合は取得日付きで並べ替え可能な 4 リポジトリのスナップショットを使用します。「最新の配信」はメタデータ更新ではなくコード push 時刻で並べます。
- レスポンシブな編集的レイアウト、均等なプロジェクトカード、折り返し可能な根拠リンク、リポジトリ所有のヒーロー写真、ページをブロックしない壁紙拡張。
- コピーや開発者ツールを妨げる処理は表示上の抑止にすぎず、配信されるコードとコンテンツは確認可能です。

## 公開成果物の一覧

デプロイワークフローは非公開ソースの許可リストから生成し、公開ツリーを置き換えます。ランタイムには次のパスがあります。

| パス | 役割 |
| --- | --- |
| `.nojekyll` | GitHub Pages の Jekyll 処理を無効にするマーカー |
| `index.html` | ホームページ構造、フォールバック文、プロジェクト一覧、思考 UI |
| `404.html` | 公開エラーページ |
| `content/site-content.json` | 検証済み二言語コンテンツの上書きとモジュール表示 |
| `css/site.css` | テーマ、レスポンシブレイアウト、文字、操作状態 |
| `js/site.js` | コンテンツ上書き、テーマ、プロジェクト、アーカイブ、ダイアログ、安全な文字表示 |
| `images/favicon.png` | サイトアイコン |
| `images/hero-campus.jpg` | ホームページのヒーロー写真 |
| `README.md`、`README.zh-CN.md`、`README.ja.md` | 英語、簡体字中国語、日本語のランタイムガイド |
| `AGENTS.md` | 生成ランタイムをレビューする規則 |

`admin/`、`backend/`、`tests/`、`.github/`、`scripts/`、非公開履歴、バックアップなどのソース専用パスは意図的に含めません。

## コンテンツとフォールバック

ページは完全な組み込みコンテンツを先に表示し、同一オリジンの `content/site-content.json` を重ねる場合があります。JSON が欠落、無効、遅延、取得不能でも組み込みページは利用できます。管理対象アーカイブは各言語で、日付付き Moments 31 件と日付付き iCloud Notes 69 件、出典・日付の順序を厳密に揃えます。

公開 JavaScript は管理テキストを信頼できない入力として扱い、日付、出典、タイトル、本文を安全に代入します。ランタイムでは iCloud の保存ラベルをタイトルとして表示せず、ブラウザー翻訳サービスも呼び出しません。

## ネットワークとプライバシー

- 公開プロジェクト一覧は GitHub の公開リポジトリデータを要求する場合がありますが、組み込みデータがフォールバックになります。
- 任意の壁紙処理は `bing.biturl.top` にメタデータを要求し、検証済み HTTPS `bing.com` 画像ホストだけを受け入れ、時間制限と単色フォールバックを使います。
- 言語、テーマ、壁紙キャッシュはブラウザー状態に保存し、管理トークンや GitHub 資格情報をこのリポジトリに置きません。
- GitHub が README を表示するとき、バッジ画像のため `img.shields.io` へ要求します。
- このリポジトリは公開用です。HTML、JavaScript、JSON、画像、README はすべて閲覧可能なものとして扱います。

## ローカルプレビュー

ランタイムにはパッケージマネージャー、バックエンド、ビルドコマンド、テストスイート、lint、format コマンドはありません。相対 `fetch()` を正しく確認するには、コミット済み成果物のルートで次を実行します。

```bash
python -m http.server 8000 --bind 127.0.0.1
```

`http://127.0.0.1:8000/` を開きます。執筆とデプロイのテストは非公開 `NextWeb4/website-source` で行います。

## デプロイモデル

変更は `NextWeb4/website-source` で行います。コミット固定の GitHub Actions が許可リスト成果物を作成し、リポジトリ専用デプロイキーでこの公開リポジトリへ同期します。次回の成功したデプロイで上書きされるため、ここを直接編集しても永続的な変更にはなりません。

公開リポジトリへ非公開ソース、バックエンド、管理画面、テスト、資格情報、デプロイキー、非公開 Git 履歴を入れてはいけません。

## 検証チェックリスト

- 成果物が許可されたランタイムと文書パスだけを含むことを確認する。
- HTTP 経由で `/`、`/404.html`、2 つの公開言語状態、代表的なアーカイブ項目を開く。
- キーボード操作、フォーカス、モーション低減、モバイルのはみ出し、一時停止、ダイアログの閉じる操作、フォールバックを確認する。
- プロジェクトリンク、画像パス、JSON 読み込み、正規サイト URL を確認する。
- デプロイを受け入れる前に、公開ツリーと非公開ビルド成果物を比較する。

## 連絡先

- [Rays688888@Gmail.com](mailto:Rays688888@Gmail.com)

## 状況、貢献、ライセンス

2026-07-22 の監査時点で、このリポジトリは公開、アクティブ、未アーカイブで、Pages が有効でした。貢献は `NextWeb4/website-source` で行い、公開リポジトリで Issue が有効な場合は再現手順のあるランタイム問題を報告してください。ライセンスファイルは見つからず、公開されているだけではコード、文章、JSON、画像の再利用権は付与されません。
