"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectLineNumbers = exports.getConfiguration = exports.getExtensionName = exports.addWarningMessage = exports.addInformationMessage = exports.addErrorMessage = exports.addInternalErrorMessage = exports.LogLevel = exports.setChannel = exports.addError = exports.addInternalError = exports.setupMsgCh = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const resourceManager_1 = require("../resources/resourceManager");
let channelName;
let channel;
let extName;
//#region メッセージ
function setupMsgCh(context) {
    let gotExtName = getExtensionName(context);
    if (gotExtName === null) {
        addInternalError("拡張機能名が読み込めない");
        return false;
    }
    extName = gotExtName;
    setChannel(extName);
    return true;
}
exports.setupMsgCh = setupMsgCh;
/**
 * 内部エラーを通知します。
 */
function addInternalError(message) {
    vscode.window.showErrorMessage((0, resourceManager_1.getString)("message.internal.loading"));
    addInternalErrorMessage(message);
}
exports.addInternalError = addInternalError;
/**
 * エラーを通知します。
 */
function addError(message) {
    vscode.window.showErrorMessage(message);
    addErrorMessage(message);
}
exports.addError = addError;
/**
 * メッセージを出力するチャネルを設定します。
 *
 * @param {string} name - 新しいチャネル名です。
 */
function setChannel(name) {
    channelName = name;
}
exports.setChannel = setChannel;
/**
 * 指定された名前で新しい出力チャネルを作成します。
 *
 * @return {vscode.OutputChannel} 新しく作成された出力チャネルです。
 */
function getOutputChanel() {
    return vscode.window.createOutputChannel(channelName);
}
/**
 * ログレベル。
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["info"] = "INFO";
    LogLevel["warn"] = "WARN";
    LogLevel["error"] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * ログレベルとメッセージを指定してメッセージを出力します。
 *
 * @param {LogLevel} level - メッセージのログレベルです。
 * @param {string} message - 出力するメッセージです。
 */
function outputMessage(level, message) {
    if (!channel) {
        channel = getOutputChanel();
        if (!channel) {
            vscode.window.showErrorMessage("Failed to get output channel.");
            return;
        }
    }
    channel.appendLine(`[${level}] ${message}`);
}
function addInternalErrorMessage(message) {
    outputMessage(LogLevel.error, ' 内部エラー：' + message);
}
exports.addInternalErrorMessage = addInternalErrorMessage;
function addErrorMessage(message) {
    outputMessage(LogLevel.error, message);
}
exports.addErrorMessage = addErrorMessage;
function addInformationMessage(message) {
    outputMessage(LogLevel.info, message);
}
exports.addInformationMessage = addInformationMessage;
function addWarningMessage(message) {
    outputMessage(LogLevel.warn, message);
}
exports.addWarningMessage = addWarningMessage;
//#endregion
/**
 * 拡張機能の名前を取得します。
 *
 * @param {vscode.ExtensionContext} ctx - 拡張機能のコンテキスト
 * @return {string | null} 拡張機能の表示名、または取得できない場合はnull
 */
function getExtensionName(ctx) {
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
exports.getExtensionName = getExtensionName;
function getConfiguration() { return vscode.workspace.getConfiguration(extName); }
exports.getConfiguration = getConfiguration;
//#region エディタ情報
/**
 * エディタ内の選択された行の行番号の配列を返します。
 *
 * @param {vscode.TextEditor} editor - 選択範囲を含むテキストエディタ。
 * @return {number[]} 行番号の配列。
 */
function getSelectLineNumbers(editor) {
    let selectionLines = [];
    for (let selection of editor.selections) {
        if (selection === undefined)
            continue;
        selectionLines = selectionLines.concat(getSelectionLineNumbers(selection));
    }
    return selectionLines;
    /**
     * 指定された選択範囲から行番号の配列を取得します。
     *
     * @param {vscode.Selection} selection - 行の範囲を表す選択オブジェクト
     * @return {number[]} 選択範囲内の行番号の配列
     */
    function getSelectionLineNumbers(selection) {
        let selectionLines = [];
        let start = selection.start.line;
        let end = selection.end.line;
        for (let index = 1; index < end - start; index++)
            selectionLines.push(start + index);
        selectionLines.push(start);
        return selectionLines;
    }
}
exports.getSelectLineNumbers = getSelectLineNumbers;
//# sourceMappingURL=extensionUtil.js.map