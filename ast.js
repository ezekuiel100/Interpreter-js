const Statements = [];
const token = {};

function TokenLiteral() {
  if (Statements.length > 0) {
    return Statements[0].TokenLiteral();
  }

  return "";
}

function tokenLiteral() {
  return token.literal;
}

function statementNode() {}

function expressionNode() {}

function Identifier(token, value) {}

module.exports = { Identifier };
