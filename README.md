## Usages

- src
- - Commands // 插件命令
- - extension.ts // 插件主文件
- web // 模版文件
- resource // 资源文件


## Dev

```
  yarn watch // compile ts to js
  vscode keyup F5 to dev this extension
```

## Publish

#### build in local 

```
  yarn compile or yarn vscode:prepublish
  vsce package
```

#### build with CI/CD
push pr to main while run the DI/CD
- change log generator
- vsce package and upload to release assest
- add tag and create release darft
