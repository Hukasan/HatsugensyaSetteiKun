import * as vscode from "vscode";
import { addInternalError, getConfiguration } from "./extensionUtil";

/**
 * 会議出席者を取得します。
 * @returns 会議出席者リスト。
 */

export function getParticipants(): string[] {

    const configuration = getConfiguration();
    const participantsPrefix = configuration.get<string>("participantsPrefix");
    const participants = configuration.get<string[]>("participants");
    const enableGetParticipantsFromDoc = configuration.get<boolean>("getParticipantsFromDoc");
    const participantsSeparator = configuration.get<string>("participantsSeparator");
    if (enableGetParticipantsFromDoc === true) {
        if (participantsPrefix === undefined || participants === undefined || participantsSeparator === undefined) {
            addInternalError("設定が読み込めない");
            return [];
        }

        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            addInternalError("エディターが読み込めない");
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
/**
 * 会議の出席者リストを取得します。
 * @param {vscode.TextDocument} document - 出席者リストを取得するドキュメント
 * @param {string} participantsPrefix - 出席者リストのプレフィックス
 * @param {string} participantsSeparator - 出席者リストの区切り文字
 * @return {string[]} 出席者リスト
 */

export function getParticipantsFromDoc(document: vscode.TextDocument, participantsPrefix: string, participantsSeparator: string): string[] {
    let participantsLine = getParticipantsLine(document, participantsPrefix);
    if (participantsLine === null) return [];

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
    function getParticipantsLine(document: vscode.TextDocument, participantsPrefix: string): string | null {
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            if (line.text.startsWith(participantsPrefix)) return line.text;
        }
        return null;
    }
}
