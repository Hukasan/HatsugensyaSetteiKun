// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { setupMsgCh } from "./extensionUtil";
import { getParticipants } from "./getParticipants";
import { updateSpeaker } from "./updateSpeaker";

export class MyCompletionItemProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const participants = getParticipants();
    // ここに候補項目を生成するコードを記述
    const items: vscode.CompletionItem[] = [];
    for (let index = 0; index < participants.length; index++) {
      const element = participants[index];
      const completionItem = new vscode.CompletionItem("発言者を更新：" + element);
      completionItem.command = {
        command: 'hatsugensyasetteikun.updateSpeakerX', // ここにコマンドの識別子を指定
        title: '選択行の発言者を更新', // ユーザーに表示されるコマンド名
        arguments: [index]
      };
      completionItem.insertText = "";
      completionItem.sortText = index.toString();
      completionItem.kind = vscode.CompletionItemKind.Property;
      items.push(completionItem);
    }
    return items;
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  setupMsgCh(context);
  context.subscriptions.push(
    vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker1", () => {
      updateSpeaker(1);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker2", () => {
      updateSpeaker(2);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker3", () => {
      updateSpeaker(3);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker4", () => {
      updateSpeaker(4);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker5", () => {
      updateSpeaker(5);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeakerX", (index) => {
      updateSpeaker(index + 1);
    })
  );
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    'markdown', new MyCompletionItemProvider()));
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    'plaintext', new MyCompletionItemProvider()));
}

// This method is called when your extension is deactivated
export function deactivate() { }
