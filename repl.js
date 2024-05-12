const readline = require("readline");
const { lexer, TokenType } = require("./lexer"); // Importar a função lexer e o TokenType

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">> ",
});

rl.prompt();

rl.on("line", (line) => {
  const getNextToken = lexer(line); // Criar o lexer com a linha de entrada
  let token = getNextToken(); // Obter o primeiro token

  while (token.type !== TokenType.EOF) {
    console.log(token);
    token = getNextToken(); // Obter o próximo token
  }

  rl.prompt();
}).on("close", () => {
  console.log("Exiting REPL");
  process.exit(0);
});
