const ast = require("./ast");
const l = require("./lexer");

console.log(ast);

const { Lexer, Token } = l;

function Parser() {
  let l = Lexer;

  let curToken = Token;
  let peekToken = Token;

  function New() {
    const p = "";
  }

  function nextTOken() {
    curToken = peekToken;
    peekToken = Lexer("let a = 6")();
  }
}

function ParserProgram() {
  switch (curToken.type) {
    case "LET":
      return parseLetStatement();
    default:
      return null;
  }
}

function parseLetStatement() {
  ast.Identifier(curToken, curToken.literal);
}
