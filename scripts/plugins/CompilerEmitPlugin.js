class CompilerEmitPlugin {
  static innerCompiler

  apply(compiler) {
    this.innerCompiler = compiler
  }
}

module.exports = CompilerEmitPlugin
