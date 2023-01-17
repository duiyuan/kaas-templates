type Message = any;

type VSCode = {
  postMessage<T extends Message = Message>(message: T): void;
  getState(): any;
  setState(state: any): void;
  [prop: string]: any;
};

declare const vscode: VSCode;

declare const PREDA_VIZ_LOG: any;

declare const BuildContext: {
  args: string;
  contract: string;
};
