const ast = require("./ast");
const l = require("./lexer");

const { Lexer, TokenType } = l;

function Parser() {
  const lexer = Lexer(input);

  let curToken = lexer.nextToken();
  let peekToken = lexer.nextToken();

  const errors = [];

  function nextToken() {
    curToken = peekToken;
    peekToken = lexer.nextToken();
  }

  function parseProgram() {
    const statements = [];

    while (curToken.type !== TokenType.EOF) {
      const stmt = parseStatement();

      if (stmt) {
        statements.push(stmt);
      }

      nextToken();
    }

    return ast.createProgram(statements);
  }

  function parseStatement() {
    switch (TokenType.LET) {
      case "LET":
        return parseLetStatement();
      default:
        return null;
    }
  }

  function parseLetStatement() {
    if (!expectPeek(TokenType.IDENT)) {
      return null;
    }

    const Identifier = ast.createIdentifier(curToken);

    if (!expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    while (!currentTokenIs(TokenType.SEMICOLON)) {
      nextToken();
    }

    const literal = ast.createLiteral({ literal: "dummy" });

    return ast.createLetStatement(Identifier, literal);
  }

  function currentTokenIs(type) {
    return curToken.type === type;
  }

  function peekTokenIs(type) {
    return peekToken.type === type;
  }

  function expectPeek(type) {
    if (peekTokenIs(type)) {
      nextToken();
      return true;
    } else {
      peekError(type);
      return false;
    }
  }

  function peekError(type) {
    const msg = `expected next token to be ${type}, got ${peekToken.type} instead`;
    errors.push(msg);
  }

  return { parseProgram, errors };
}

const input = `let x = ;`;

const parser = Parser(input);
const program = parser.parseProgram();

if (parser.errors.length > 0) {
  console.log("Parser errors:");
  console.log(parser.errors);
} else {
  console.log(JSON.stringify(program, null, 2));
}
