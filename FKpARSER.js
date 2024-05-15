function Parser() {
  const lexer = lexer(inpit);

  let currentToken = lexer.token();
  let peekToken = lexer.token();

  function nextToken() {
    currentToken = peekToken;
    peekToken = lexer.nextToken();
  }

  function parseProgram() {
    while (currentToken.type != "EOF") {
      let stm = parseStatement();
      return null;
    }
  }

  function parseStatement() {
    switch (currentToken.type) {
      case "LET":
        return parseLetStatement();
      default:
        return null;
    }
  }
}

function parseLetStatement() {
  if (peekToken.type == "=") {
    nextToken();
  }

  const identifier = ast.createIdentifier(currentToken);

  while (currentToken.type != ";") {
    nextToken();
  }

  return ast.createLetStatement(identifier, currentToken.value);
}
