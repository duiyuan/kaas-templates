// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import runKAASPROJECTNAME from "./Commands/run";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // run
  const runChsimuCommand = vscode.commands.registerCommand(
    "KAASPROJECTNAME.run",
    (uri: vscode.Uri) => runKAASPROJECTNAME(uri, context)
  );

  // 注册到监听队列中
  context.subscriptions.push(runChsimuCommand);

  let pattern: any;
  let styleForRegExp: any;

  const keywordsPattern = "\\[HIGHLIGHT\\].*";

  init();

  function init() {
    const style = {
      color: "#000",
      backgroundColor: "#ffff00",
    };
    styleForRegExp = Object.assign({}, style, {
      overviewRulerLane: vscode.OverviewRulerLane.Right,
    });
    pattern = new RegExp(keywordsPattern, "gi");
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
