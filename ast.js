function createProgram(statements) {
  return { type: "Program", statements };
}

function createLetStatement(identifier, value) {
  return { type: "LetStatement", identifier, value };
}

function createReturnStatement(token, value) {
  return { type: "ReturnStatement", token, value };
}

function createExpressionStatement(token, expression) {
  return { type: "ExpressionStatement", token, expression };
}

function createLiteral(token) {
  return { type: "Literal", value: token.literal };
}

function createIdentifier(value) {
  return { type: "identifier", value };
}

function PrefixExpression(token, operator, right) {
  return { token, operator, right };
}

function InfixExpression(token, left, operator, right) {
  return { token, left, operator, right };
}

module.exports = {
  createProgram,
  createIdentifier,
  createLiteral,
  createLetStatement,
  createReturnStatement,
  createExpressionStatement,
  PrefixExpression,
  InfixExpression,
};
