# 議事録の発言者設定君

議事録作成の補助ツールです。選択行に発言者名を挿入できます。

## 概要

VSCode上で選択している行に発言者名を挿入します。
Markdownとプレーンテキストで動作します。

### 操作

2通りの操作で挿入できます。

**操作① ショートカットキー**
 `Ctrl+Alt+1`~`Ctrl+Alt+5`の押下で、1番目~5番目までの会議出席者を挿入できます。  

**操作② サジェスト**
 `Ctrl+Space`押下時の選択肢から挿入できます。

## セットアップ

利用前に、会議出席者の一覧を設定する必要があります。

### 会議出席者の設定

固定で設定しておくか、動的に取得させることができます。

**出席者を固定で設定する場合**

以下のVSCodeの設定を実施します。

- `hatsugensyasetteikun.getParticipantsFromDoc`のチェックを外します。
- `hatsugensyasetteikun.participants`に出席者を設定します。

**出席者を動的に認識させる場合**

議事録に記載の出席者一覧から取得させます。
以下のVSCodeの設定を実施します。

- `hatsugensyasetteikun.getParticipantsFromDoc`にチェックを入れます。
- `hatsugensyasetteikun.participantsPrefix`に出席者の一覧が記載されている行の先頭文字列を設定します。
- `hatsugensyasetteikun.participantsSeparator`に出席者名の区切り文字を設定します。

**Enjoy!**
