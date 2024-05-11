// Definindo os tipos de tokens
const TokenType = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",
  // Tokens de identificadores e literais
  IDENT: "IDENT",
  INT: "INT",
  // Operadores
  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",
  // Delimitadores
  COMMA: ",",
  SEMICOLON: ";",
  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",
  // Palavras-chave
  FUNCTION: "FUNCTION",
  LET: "LET",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN",
};

// Estrutura de dados para representar um token
function Token(type, literal) {
  return { type, literal };
}

function lexer(input) {
  let position = 0;
  let readPosition = 0;
  let char = "";

  function readChar() {
    if (readPosition >= input.length) {
      char = "";
    } else {
      char = input.charAt(readPosition);
    }

    position = readPosition;
    readPosition++;
  }

  function nextToken() {
    let token;
    skipWhiteSpace();

    switch (char) {
      case "=":
        token = Token(TokenType.ASSIGN, char);
        break;
      case "+":
        token = Token(TokenType.PLUS, char);
        break;
      case "-":
        token = Token(TokenType.MINUS, char);
        break;

      default:
        if (isLetter(char)) {
          let identifier = readIdentifier();
          token = Token(lookupIdentifier(identifier), identifier);
        } else if (isDigit(char)) {
          token = Token(TokenType.INT, readNumber());
        } else if (char === "") {
          token = Token(TokenType.EOF, char);
        }
    }

    readChar();
    return token;
  }

  function skipWhiteSpace() {
    while (char === " " || char === "\t" || char === "\n" || char === "\r") {
      readChar();
    }
  }

  // Lê um identificador
  function readIdentifier() {
    const startPos = position;
    while (isLetter(char)) {
      readChar();
    }
    return input.slice(startPos, position);
  }

  function readNumber() {
    const startPos = position;
    while (isDigit(char)) {
      readChar();
    }
    return input.slice(startPos, position);
  }

  function isLetter(char) {
    return /^[a-zA-Z_]/.test(char);
  }

  function isDigit(char) {
    return /^\d/.test(char);
  }

  function lookupIdentifier(identifier) {
    switch (identifier) {
      case "fn":
        return TokenType.FUNCTION;
      case "let":
        return TokenType.LET;
      case "true":
        return TokenType.TRUE;
      case "false":
        return TokenType.FALSE;
      case "if":
        return TokenType.IF;
      case "else":
        return TokenType.ELSE;
      case "return":
        return TokenType.RETURN;

      default:
        return TokenType.IDENT;
    }
  }

  readChar();
  return nextToken;
}

const getNextToken = lexer("let x = 5 + 10;");
let token = getNextToken();

while (token.type != TokenType.EOF) {
  console.log(token);
  token = getNextToken();
}
