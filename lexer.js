// Definindo os tipos de tokens
const TokenType = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF", //end of file
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
  EQ: "==",
  NOT_EQ: "!=",
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

  LT: "<",
  GT: ">",
};

// Estrutura de dados para representar um token
function Token(type, literal) {
  return { type, literal };
}

function Lexer(input) {
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
        if (peekChar() === char) {
          char += char;
          token = Token(TokenType.EQ, char);
          readChar();
        } else {
          token = Token(TokenType.ASSIGN, char);
        }
        break;
      case "+":
        token = Token(TokenType.PLUS, char);
        break;
      case "-":
        token = Token(TokenType.MINUS, char);
        break;
      case "*":
        token = Token(TokenType.ASTERISK, char);
        break;
      case ";":
        token = Token(TokenType.SEMICOLON, char);
        break;
      case "!":
        if (peekChar() === "=") {
          char += "=";
          token = Token(TokenType.NOT_EQ, char);
          readChar();
        } else {
          token = Token(TokenType.BANG, char);
        }
        break;
      case "/":
        token = Token(TokenType.SLASH, char);
        break;
      case "<":
        token = Token(TokenType.LT, char);
        break;
      case ">":
        token = Token(TokenType.GT, char);
        break;
      case "(":
        token = Token(TokenType.LPAREN, char);
        break;
      case ")":
        token = Token(TokenType.RPAREN, char);
        break;
      case "{":
        token = Token(TokenType.LBRACE, char);
        break;
      case "}":
        token = Token(TokenType.RBRACE, char);
        break;
      case ",":
        token = Token(TokenType.COMMA, char);
        break;
      case "":
        token = Token(TokenType.EOF, char);
        break;

      default:
        if (isLetter(char)) {
          let identifier = readIdentifier();
          return (token = Token(lookupIdentifier(identifier), identifier));
        } else if (isDigit(char)) {
          return (token = Token(TokenType.INT, readNumber()));
        } else {
          token = Token(TokenType.ILLEGAL, char);
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

  function peekChar() {
    if (readPosition >= input.length) {
      return 0;
    } else {
      return input.charAt(readPosition);
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

    if (!isDigit(char)) {
      Token(TokenType.ILLEGAL, char);
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
  return { nextToken };
}

module.exports = { Lexer, Token, TokenType };
