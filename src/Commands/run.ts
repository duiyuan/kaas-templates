import * as vscode from "vscode";

export default async (uri: vscode.Uri, context: vscode.ExtensionContext) => {
  try {
    try {
      console.log('Commands run');
    } catch (ex: any) {
      vscode.window.showErrorMessage(ex.message);
    }
  } catch (e: any) {
    vscode.window.showErrorMessage(e.toString());
  }
};
