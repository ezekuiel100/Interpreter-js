const ast = require("./ast");
const l = require("./lexer");

const { Lexer, TokenType } = l;

const Precedences = {
  LOWEST: 1,
  EQUALS: 2, // ==
  LESSGREATER: 3, // > or <
  SUM: 4, // +
  PRODUCT: 5, // *
  PREFIX: 6, // -X or !X
  CALL: 7, // myFunction(X)
};

const precedences = {
  [TokenType.EQ]: Precedences.EQUALS,
  [TokenType.NOT_EQ]: Precedences.EQUALS,
  [TokenType.LT]: Precedences.LESSGREATER,
  [TokenType.GT]: Precedences.LESSGREATER,
  [TokenType.PLUS]: Precedences.SUM,
  [TokenType.MINUS]: Precedences.SUM,
  [TokenType.SLASH]: Precedences.PRODUCT,
  [TokenType.ASTERISK]: Precedences.PRODUCT,
};

function Parser() {
  const lexer = Lexer(input);

  let curToken = lexer.nextToken();
  let peekToken = lexer.nextToken();

  const errors = [];

  const prefixParseFns = {};
  const infixParseFns = {};

  function nextToken() {
    curToken = peekToken;
    peekToken = lexer.nextToken();
  }

  function registerPrefix(tokenType, fn) {
    prefixParseFns[tokenType] = fn;
  }

  function registerInfix(tokenType, fn) {
    infixParseFns[tokenType] = fn;
  }

  registerPrefix(TokenType.IDENT, parseIdentifier);
  registerPrefix(TokenType.INT, parseIntegerLiteral);
  registerPrefix(TokenType.BANG, parsePrefixExpression);
  registerPrefix(TokenType.MINUS, parsePrefixExpression);

  registerInfix(TokenType.PLUS, parseInfixExpression);
  registerInfix(TokenType.MINUS, parseInfixExpression);
  registerInfix(TokenType.SLASH, parseInfixExpression);
  registerInfix(TokenType.ASTERISK, parseInfixExpression);
  registerInfix(TokenType.EQ, parseInfixExpression);
  registerInfix(TokenType.NOT_EQ, parseInfixExpression);
  registerInfix(TokenType.LT, parseInfixExpression);
  registerInfix(TokenType.GT, parseInfixExpression);

  function parsePrefixExpression() {
    const token = curToken;
    const operator = curToken.literal;

    nextToken();

    const right = parseExpression(Precedences.PREFIX);

    return ast.PrefixExpression(token, operator, right);
  }

  function parseInfixExpression(left) {
    const token = curToken;
    const operator = curToken.literal;
    const precedence = curPrecedence();

    nextToken();

    const right = parseExpression(precedence);

    return ast.InfixExpression(token, left, operator, right);
  }

  function curPrecedence() {
    if (curToken.type in precedences) {
      return precedences[curToken.type];
    }
    return Precedences.LOWEST;
  }

  function peekPrecedence() {
    if (precedences[peekToken.type]) {
      return precedences[peekToken.type];
    }

    return Precedences.LOWEST;
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
    switch (curToken.type) {
      case "LET":
        return parseLetStatement();
      case "RETURN":
        return parseReturnStatement();
      default:
        return parseExpressionStatement();
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

  function parseReturnStatement() {
    const token = curToken;
    nextToken();

    // skipping expressions parsing for now
    while (!currentTokenIs(TokenType.SEMICOLON)) {
      nextToken();
    }

    const returnValue = ast.createLiteral({ literal: "dummy" });

    return ast.createReturnStatement(token, returnValue);
  }

  function parseExpressionStatement() {
    const token = curToken;
    const expression = parseExpression(Precedences.LOWEST);

    if (peekToken.type === TokenType.SEMICOLON) {
      nextToken();
    }

    return ast.createExpressionStatement(token, expression);
  }

  function parseExpression(precedence) {
    const prefix = prefixParseFns[curToken.type];

    if (!prefix) return null;

    let leftExp = prefix();

    console.log(curPrecedence(), precedence);

    while (!peekTokenIs(TokenType.SEMICOLON) && precedence < peekPrecedence()) {
      const infix = infixParseFns[peekToken.type];
      if (!infix) {
        return leftExp;
      }
      nextToken();
      leftExp = infix(leftExp);
    }

    return leftExp;
  }

  function parseIdentifier() {
    return { type: "Identifier", value: curToken.literal };
  }

  function parseIntegerLiteral() {
    const value = parseInt(curToken.literal, 10);
    if (isNaN(value)) {
      errors.push(`could not parse ${curToken.literal} as integer`);
      return null;
    }
    return { type: "IntegerLiteral", value: value };
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

const input = `3-5; `;

const parser = Parser(input);
const program = parser.parseProgram();

if (parser.errors.length > 0) {
  console.log("Parser errors:");
  console.log(parser.errors);
} else {
  console.log(JSON.stringify(program, null, 2));
}
