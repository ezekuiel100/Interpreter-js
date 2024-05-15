const ast = require("./ast");
const l = require("./lexer");

const { Lexer, TokenType } = l;

function Parser(input) {
  const lexer = Lexer(input);

  let currentToken = lexer.nextToken();
  let peekToken = lexer.nextToken();

  function nextToken() {
    currentToken = peekToken;
    peekToken = lexer.nextToken();
  }

  function parseProgram() {
    let statement = [];

    while (currentToken.type != TokenType.EOF) {
      const stm = parseStatement();

      if (stm) {
        statement.push(stm);
        nextToken();
      }
    }

    return ast.createProgram(statement);
  }

  function parseStatement() {
    switch (currentToken.type) {
      case "LET":
        return parseLetStatement();
      default:
        return null;
    }
  }

  function parseLetStatement() {
    nextToken();

    if (peekToken.type != TokenType.ASSIGN) {
      console.log("Erro");
    }

    const identifier = ast.createIdentifier(currentToken);

    while (peekToken.type != ";") {
      nextToken();
    }

    const literal = ast.createLiteral(currentToken);

    nextToken();

    return ast.createLetStatement(identifier, literal);
  }

  return { parseProgram };
}

const input = `let x =  6;`;
let program = Parser(input).parseProgram();

console.log(JSON.stringify(program, null, 2));
