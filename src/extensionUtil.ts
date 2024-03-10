import * as fs from 'fs';
import * as path from 'path';
import * as vscode from "vscode";

let channelName: string;
let channel: vscode.OutputChannel;
let extName: string;


//#region メッセージ

export function setupMsgCh(context: vscode.ExtensionContext): boolean {
  let gotExtName = getExtensionName(context);
  if (gotExtName === null) {
    addInternalError("拡張機能名が読み込めない");
    return false;
  }
  extName = gotExtName;
  setChannel(extName);
  return true;
}

/**
 * 内部エラーを通知します。
 */
export function addInternalError(message: string) {
  vscode.window.showErrorMessage("[議事録の発言者設定君]内部エラーが発生しました。ご迷惑をおかけして申し訳ありません。");
  addInternalErrorMessage(message);
}

/**
 * エラーを通知します。
 */
export function addError(message: string) {
  vscode.window.showErrorMessage(message);
  addErrorMessage(message);
}

/**
 * メッセージを出力するチャネルを設定します。
 *
 * @param {string} name - 新しいチャネル名です。
 */
export function setChannel(name: string) {
  channelName = name;
}

/**
 * 指定された名前で新しい出力チャネルを作成します。
 *
 * @return {vscode.OutputChannel} 新しく作成された出力チャネルです。
 */
function getOutputChanel(): vscode.OutputChannel {
  return vscode.window.createOutputChannel(channelName);
}

/**
 * ログレベル。
 */
export enum LogLevel {
  info = "INFO",
  warn = "WARN",
  error = "ERROR",
}

/**
 * ログレベルとメッセージを指定してメッセージを出力します。
 *
 * @param {LogLevel} level - メッセージのログレベルです。
 * @param {string} message - 出力するメッセージです。
 */
function outputMessage(level: LogLevel, message: string) {
  if (!channel) {
    channel = getOutputChanel();
    if (!channel) {
      vscode.window.showErrorMessage("Failed to get output channel.");
      return;
    }
  }
  channel.appendLine(`[${level}] ${message}`);
}

export function addInternalErrorMessage(message: string) {
  outputMessage(LogLevel.error, ' 内部エラー：' + message);
}

export function addErrorMessage(message: string) {
  outputMessage(LogLevel.error, message);
}

export function addInformationMessage(message: string) {
  outputMessage(LogLevel.info, message);
}

export function addWarningMessage(message: string) {
  outputMessage(LogLevel.warn, message);
}

//#endregion

/**
 * 拡張機能の名前を取得します。
 *
 * @param {vscode.ExtensionContext} ctx - 拡張機能のコンテキスト
 * @return {string | null} 拡張機能の表示名、または取得できない場合はnull
 */
export function getExtensionName(ctx: vscode.ExtensionContext): string | null {
  // 拡張機能のルートディレクトリを取得
  const extensionPath = vscode.extensions.getExtension(ctx.extension.id)?.extensionPath;

  if (extensionPath) {
    // package.jsonのパスを取得
    const packageJsonPath = path.join(extensionPath, 'package.json');

    // package.jsonを読み込む
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // 拡張機能の名前を取得
    const extensionName = packageJson.name;
    return extensionName;
  }
  return null;
}

export function getConfiguration() { return vscode.workspace.getConfiguration(extName); }


//#region エディタ情報

/**
 * エディタ内の選択された行の行番号の配列を返します。
 *
 * @param {vscode.TextEditor} editor - 選択範囲を含むテキストエディタ。
 * @return {number[]} 行番号の配列。
 */
export function getSelectLineNumbers(editor: vscode.TextEditor): number[] {
  let selectionLines: number[] = [];
  for (let selection of editor.selections) {
    if (selection === undefined) continue;
    selectionLines = selectionLines.concat(getSelectionLineNumbers(selection));
  }
  return selectionLines;

  /**
   * 指定された選択範囲から行番号の配列を取得します。
   *
   * @param {vscode.Selection} selection - 行の範囲を表す選択オブジェクト
   * @return {number[]} 選択範囲内の行番号の配列
   */
  function getSelectionLineNumbers(selection: vscode.Selection): number[] {
    let selectionLines: number[] = [];
    let start = selection.start.line;
    let end = selection.end.line;
    for (let index = 1; index < end - start; index++) selectionLines.push(start + index);
    selectionLines.push(start);
    return selectionLines;
  }
}
