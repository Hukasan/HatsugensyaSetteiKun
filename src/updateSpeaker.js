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
exports.updateSpeaker = void 0;
const vscode = __importStar(require("vscode"));
const extensionUtil_1 = require("./extensionUtil");
const getParticipants_1 = require("./getParticipants");
/**
 * 発言者を更新します。
 * @param context コンテキスト。
 * @param speakerIndex 発言者を設定する行のインデックス。
 */
function updateSpeaker(speakerIndex) {
    const participants = (0, getParticipants_1.getParticipants)();
    if (participants.length === 0) {
        return;
    }
    let participantsString = "";
    participants.forEach(p => participantsString = participantsString + " " + p);
    (0, extensionUtil_1.addInformationMessage)("会議出席者：" + participantsString);
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        (0, extensionUtil_1.addInternalError)("エディターの読み込み失敗");
        return [];
    }
    setSpeaker(editor, participants[speakerIndex - 1]);
    /**
    * エディタの選択行に発言者を設定する。
    *
    * @param {vscode.TextEditor} editor - エディタ。
    * @param {string} speaker - 設定する発言者の名前。
    */
    function setSpeaker(editor, speaker) {
        editor.edit(editBuilder => {
            let lineNumbers = (0, extensionUtil_1.getSelectLineNumbers)(editor);
            const document = editor.document;
            for (let lineNumber of lineNumbers) {
                const index = getStartIndex(document.lineAt(lineNumber).text);
                setSpeakerToLine(document, editBuilder, lineNumber, index, speaker);
            }
        });
        /**
         * 指定された行の開始インデックスを返す。
         *
         * @param {string} line - チェックする行。
         * @returns {number} 開始インデックス。
         */
        function getStartIndex(line) {
            let parts = line.split("-");
            if ((parts.length > 1) && isOnlySpace(parts[0]))
                return line.indexOf("-") + 2;
            else
                return 0;
            /**
            * 文字列が空白文字のみで構成されているかをチェックします。
            *
            * @param {string} str - チェックする文字列。
            * @returns {boolean} 文字列が空白文字のみの場合は true、そうでなければ false。
            */
            function isOnlySpace(str) {
                return str.split('').every(char => char === ' ');
            }
        }
        /**
         * 特定の行に発言者を設定します。
         *
         * @param {vscode.TextDocument} document - 行が含まれるドキュメント。
         * @param {vscode.TextEditorEdit} edit - ドキュメントの変更に使用するエディタ。
         * @param {number} lineIndex - 発言者を設定する行のインデックス。
         * @param {number} startIndex - 行内の発言者の開始インデックス。
         * @param {string} speaker - 設定する新しい発言者。
         */
        function setSpeakerToLine(document, edit, lineIndex, startIndex, speaker) {
            // 発言者を示す正規表現パターン
            const speakerRegex = /\(([^)]+)\):\s/;
            // 更新する発言者の文字列
            const newSpeaker = `(${speaker}): `;
            // 現在の行のテキストを取得
            let line = document.lineAt(lineIndex).text;
            // 行テキストに既存の発言者情報があるか検索
            const match = line.match(speakerRegex);
            if (match && match[0] === newSpeaker) {
                return; // 置き換えをスキップ
            }
            // 既存の発言者情報があり、その位置が予期される位置であれば置換する
            if (match && match.index !== undefined && match.index === startIndex) {
                const start = new vscode.Position(lineIndex, match.index);
                const end = new vscode.Position(lineIndex, match.index + match[0].length);
                edit.replace(new vscode.Range(start, end), newSpeaker);
            }
            else {
                // 既存の発言者情報がなければ新しく挿入する
                const head = line.charAt(startIndex - 1);
                let insertSegment = newSpeaker;
                if (head === "-" || head === "*") {
                    // リスト形式であれば、発言者名の前にスペースを追加して整形
                    insertSegment = " " + insertSegment;
                    startIndex -= 2;
                }
                edit.insert(new vscode.Position(lineIndex, startIndex), insertSegment);
            }
        }
    }
}
exports.updateSpeaker = updateSpeaker;
//# sourceMappingURL=updateSpeaker.js.map