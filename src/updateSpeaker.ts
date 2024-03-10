import * as vscode from "vscode";
import { addInformationMessage, addInternalError, getSelectLineNumbers } from "./extensionUtil";
import { getParticipants } from "./getParticipants";

/**
 * 発言者を更新します。
 * @param context コンテキスト。
 * @param speakerIndex 発言者を設定する行のインデックス。
 */
export function updateSpeaker(speakerIndex: number) {
    const participants = getParticipants();
    if (participants.length === 0) {
        addInformationMessage("出席者が設定されていません。");
        return;
    }
    let participantsString = "";
    participants.forEach(p => participantsString = participantsString + " " + p);
    addInformationMessage("会議出席者：" + participantsString);

    if (participants.length < speakerIndex) {
        addInformationMessage(speakerIndex.toString() + "番目の出席者はいません。出席者は" + participants.length.toString() + "人です。");
        return;
    }

    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        addInternalError("エディターの読み込み失敗");
        return [];
    }
    setSpeaker(editor, participants[speakerIndex - 1]);

    /**
    * エディタの選択行に発言者を設定する。
    *
    * @param {vscode.TextEditor} editor - エディタ。
    * @param {string} speaker - 設定する発言者の名前。
    */
    function setSpeaker(editor: vscode.TextEditor, speaker: string) {
        editor.edit(editBuilder => {
            let lineNumbers = getSelectLineNumbers(editor);
            const document = editor.document;
            var language = editor.document.languageId;
            if (language === "markdown") {
                for (let lineNumber of lineNumbers) {
                    const index = getStartIndexOfMarkdown(document.lineAt(lineNumber).text);
                    setSpeakerToLine(document, editBuilder, lineNumber, index, speaker);
                }
            }
            else {
                for (let lineNumber of lineNumbers) {
                    const index = getStartIndexOfPlainText(document.lineAt(lineNumber).text);
                    setSpeakerToLine(document, editBuilder, lineNumber, index, speaker);
                }
            }

        });

        /**
         * 行の開始インデックスを返す。(PlainText)
         *
         * @param {string} line - チェックする行。
         * @returns {number} 開始インデックス。
         */
        function getStartIndexOfPlainText(line: string): number {
            // 文字列の長さをチェックし、各文字を順番に調べる
            for (let i = 1; i < line.length; i++) {
                if (line[i] !== ' ' && line[i] !== '\t' && line[i] !== '\n') {
                    // 空白、タブ、改行以外の文字が見つかった場合、そのインデックスを返す
                    return i;
                }
            }
            return line.length;
        }

        /**
         * 行の開始インデックスを返す。(Markdown)
         *
         * @param {string} line - チェックする行。
         * @returns {number} 開始インデックス。
         */
        function getStartIndexOfMarkdown(line: string): number {
            let parts = line.split(new RegExp('\\*|-'));
            if ((parts.length > 1) && isOnlySpace(parts[0])) {
                let indexDash = line.indexOf('-');
                let indexAsterisk = line.indexOf('*');
                if (indexDash !== -1 && indexAsterisk !== -1) {
                    return Math.min(indexDash, indexAsterisk) + 2;
                } else if (indexDash !== -1) {
                    return indexDash + 2;
                } else {
                    return indexAsterisk + 2;
                }
            }
            else return 0;

            /**
            * 文字列が空白文字のみで構成されているかをチェックします。
            *
            * @param {string} str - チェックする文字列。
            * @returns {boolean} 文字列が空白文字のみの場合は true、そうでなければ false。
            */
            function isOnlySpace(str: string): boolean {
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
        function setSpeakerToLine(document: vscode.TextDocument, edit: vscode.TextEditorEdit, lineIndex: number, startIndex: number, speaker: string) {
            // 発言者を示す正規表現パターン
            const speakerRegex = /\(([^)]+)\)：/;
            // 更新する発言者の文字列
            const newSpeaker = `(${speaker})：`;

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
