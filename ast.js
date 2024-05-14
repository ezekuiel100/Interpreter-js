function createProgram(statements) {
  return { type: "Program", statements };
}

function createLetStatement(identifier, value) {
  return { type: "LetStatement", identifier, value };
}

function createLiteral(token) {
  return { type: "Literal", value: token.literal };
}

function createIdentifier(token) {
  return { type: "identifier", value: token.literal };
}

module.exports = {
  createProgram,
  createIdentifier,
  createLiteral,
  createLetStatement,
};
