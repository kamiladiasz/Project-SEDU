// Verifica se usuário está logado
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
  alert("Você precisa fazer login!");
  window.location.href = "index.html";
} else {
  console.log("Usuário logado:", usuarioLogado.username, "| Tipo:", usuarioLogado.tipo);
}

// Dados de exemplo (pode substituir com banco real ou API)
const dadosTurmas = [
  { aluno: "João", turma: "Turma A", notas: { matematica: 8.5, portugues: 7.0 }, faltas: 2, professor: "professor1" },
  { aluno: "Maria", turma: "Turma A", notas: { matematica: 9.0, portugues: 8.5 }, faltas: 0, professor: "professor1" },
  { aluno: "Carlos", turma: "Turma B", notas: { matematica: 7.5, portugues: 8.0 }, faltas: 1, professor: "professor2" }
];

const atividades = [
  { aluno: "João", disciplina: "Matemática", entrega: "12/11/2025", status: "Entregue" },
  { aluno: "Maria", disciplina: "Português", entrega: "13/11/2025", status: "Pendente" },
  { aluno: "Carlos", disciplina: "Ciências", entrega: "14/11/2025", status: "Entregue" }
];

const chamadas = [
  { aluno: "João", presente: true },
  { aluno: "Maria", presente: false },
  { aluno: "Carlos", presente: true }
];
console.log("main.js carregado com sucesso");