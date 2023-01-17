import * as vscode from "vscode";
import { existsSync } from "fs-extra";

const isWin = process.platform === "win32";

export const getCurrentActiveFileAndFolder = (uri: vscode.Uri) => {
  // uri会给出命令执行时选择的路径
  // 如果右键点击文件夹，这里就是文件夹的路径
  let currentFilePath = uri?.fsPath;
  // 命令行获取当前tab路径
  if (!currentFilePath) {
    currentFilePath =
      vscode.window?.activeTextEditor?.document.uri.fsPath || "";
  }
  const lastStr = currentFilePath.lastIndexOf(isWin ? "\\" : "/") + 1;
  const currentFileName = currentFilePath.substring(lastStr);
  const currentFolder = currentFilePath.substring(0, lastStr);
  return {
    currentFileName,
    currentFolder,
    currentFilePath,
  };
};

export const getPathFloderAndName = (path: string) => {
  const lastStr = path.lastIndexOf(isWin ? "\\" : "/") + 1;
  const fileName = path.substring(lastStr);
  const fileFloder = path.substring(0, lastStr);
  return {
    fileName,
    fileFloder,
  };
};
