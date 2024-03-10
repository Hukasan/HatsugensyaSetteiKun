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
exports.getParticipantsFromDoc = exports.getParticipants = void 0;
const vscode = __importStar(require("vscode"));
const extensionUtil_1 = require("./extensionUtil");
/**
 * 会議出席者を取得します。
 * @returns 会議出席者リスト。
 */
function getParticipants() {
    const configuration = (0, extensionUtil_1.getConfiguration)();
    const participantsPrefix = configuration.get("participantsPrefix");
    const participants = configuration.get("participants");
    const enableGetParticipantsFromDoc = configuration.get("getParticipantsFromDoc");
    const participantsSeparator = configuration.get("participantsSeparator");
    if (enableGetParticipantsFromDoc === true) {
        if (participantsPrefix === undefined || participants === undefined || participantsSeparator === undefined) {
            (0, extensionUtil_1.addInternalError)("設定が読み込めない");
            return [];
        }
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            (0, extensionUtil_1.addInternalError)("エディターが読み込めない");
            return [];
        }
        return getParticipantsFromDoc(editor.document, participantsPrefix, participantsSeparator);
    }
    else {
        if (participants === undefined) {
            return [];
        }
        return participants;
    }
}
exports.getParticipants = getParticipants;
/**
 * 会議の出席者リストを取得します。
 * @param {vscode.TextDocument} document - 出席者リストを取得するドキュメント
 * @param {string} participantsPrefix - 出席者リストのプレフィックス
 * @param {string} participantsSeparator - 出席者リストの区切り文字
 * @return {string[]} 出席者リスト
 */
function getParticipantsFromDoc(document, participantsPrefix, participantsSeparator) {
    let participantsLine = getParticipantsLine(document, participantsPrefix);
    if (participantsLine === null)
        return [];
    const regex = new RegExp(`${participantsPrefix}([^,]+(?:,[^,]+)*)`);
    const match = participantsLine.match(regex);
    if (match && match[1]) {
        const participants = match[1].split(participantsSeparator);
        return participants;
    }
    return [];
    /**
     * 指定したプレフィックスで始まる行を取得します。
     *
     * @param {vscode.TextDocument} document - 検索対象のドキュメントです。
     * @param {string} participantsPrefix - 出席者リストのプレフィックス。
     * @return {string | null} 取得した行、見つからなければnull。
     */
    function getParticipantsLine(document, participantsPrefix) {
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            if (line.text.startsWith(participantsPrefix))
                return line.text;
        }
        return null;
    }
}
exports.getParticipantsFromDoc = getParticipantsFromDoc;
//# sourceMappingURL=getParticipants.js.map