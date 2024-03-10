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
exports.deactivate = exports.activate = exports.MyCompletionItemProvider = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const extensionUtil_1 = require("./commands/extensionUtil");
const getParticipants_1 = require("./commands/getParticipants");
const updateSpeaker_1 = require("./commands/updateSpeaker");
class MyCompletionItemProvider {
    provideCompletionItems(document, position, token, context) {
        const participants = (0, getParticipants_1.getParticipants)();
        // ここに候補項目を生成するコードを記述
        const items = [];
        for (let index = 0; index < participants.length; index++) {
            const element = participants[index];
            const completionItem = new vscode.CompletionItem("発言者を更新：" + element);
            completionItem.command = {
                command: 'hatsugensyasetteikun.updateSpeakerX',
                title: '選択行の発言者を更新',
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
exports.MyCompletionItemProvider = MyCompletionItemProvider;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    (0, extensionUtil_1.setupMsgCh)(context);
    context.subscriptions.push(vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker1", () => {
        (0, updateSpeaker_1.updateSpeaker)(1);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker2", () => {
        (0, updateSpeaker_1.updateSpeaker)(2);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker3", () => {
        (0, updateSpeaker_1.updateSpeaker)(3);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker4", () => {
        (0, updateSpeaker_1.updateSpeaker)(4);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeaker5", () => {
        (0, updateSpeaker_1.updateSpeaker)(5);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("hatsugensyasetteikun.updateSpeakerX", (index) => {
        (0, updateSpeaker_1.updateSpeaker)(index + 1);
    }));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('markdown', new MyCompletionItemProvider()));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map