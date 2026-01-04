/* ===============================
	CRIAR BANCO (com charset apropriado)
================================= */
DROP DATABASE IF EXISTS escola;
CREATE DATABASE escola
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
USE escola;

/* ===============================
	TABELA COORDENAÇÃO
================================= */
CREATE TABLE IF NOT EXISTS coordenacao (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 nome VARCHAR(100),
	 email VARCHAR(120),
	 telefone VARCHAR(20),
	 setor VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO coordenacao (nome, email, telefone, setor) VALUES
("Luciana Paiva", "luciana.paiva@escola.com", "(11) 91001-2233", "Pedagógico"),
("Roberto Lima", "roberto.lima@escola.com", "(11) 91002-2233", "Disciplina"),
("Marcela Tavares", "marcela.tavares@escola.com", "(11) 91003-2233", "Pedagógico"),
("Bruno Costa", "bruno.costa@escola.com", "(11) 91004-2233", "Administração"),
("Renata Melo", "renata.melo@escola.com", "(11) 91005-2233", "Pedagógico"),
("Daniel Rocha", "daniel.rocha@escola.com", "(11) 91006-2233", "Disciplina"),
("Fernanda Luz", "fernanda.luz@escola.com", "(11) 91007-2233", "Pedagógico"),
("Sérgio Ribas", "sergio.ribas@escola.com", "(11) 91008-2233", "Administração"),
("Juliana Moreira", "juliana.moreira@escola.com", "(11) 91009-2233", "Disciplina"),
("Anderson Prado", "anderson.prado@escola.com", "(11) 91010-2233", "Pedagógico"),
("Patrícia Nunes", "patricia.nunes@escola.com", "(11) 91011-2233", "Administração"),
("Márcio Vieira", "marcio.vieira@escola.com", "(11) 91012-2233", "Pedagógico"),
("Cláudia Ramos", "claudia.ramos@escola.com", "(11) 91013-2233", "Disciplina"),
("Rafael Cunha", "rafael.cunha@escola.com", "(11) 91014-2233", "Pedagógico"),
("Carla Souza", "carla.souza@escola.com", "(11) 91015-2233", "Administração"),
("Igor Martins", "igor.martins@escola.com", "(11) 91016-2233", "Disciplina"),
("Lívia Reis", "livia.reis@escola.com", "(11) 91017-2233", "Pedagógico"),
("Heitor Rocha", "heitor.rocha@escola.com", "(11) 91018-2233", "Administração"),
("Vanessa Campos", "vanessa.campos@escola.com", "(11) 91019-2233", "Disciplina"),
("Eduardo Teixeira", "eduardo.teixeira@escola.com", "(11) 91020-2233", "Pedagógico");

/* ===============================
	TABELA PROFESSORES
================================= */
CREATE TABLE IF NOT EXISTS professores (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 nome VARCHAR(100),
	 email VARCHAR(120),
	 disciplina VARCHAR(80),
	 telefone VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* Inserindo dados dos professores */
INSERT INTO professores (nome, email, disciplina, telefone) VALUES
("Carlos Eduardo Silva", "carlos.silva@escola.com", "Matemática", "(11) 97122-3344"),
("Mariana Souza", "mariana.souza@escola.com", "Português", "(11) 97133-4545"),
("João Batista", "joao.batista@escola.com", "História", "(11) 97144-6677"),
("Patrícia Gomes", "patricia.gomes@escola.com", "Geografia", "(11) 97155-1122"),
("Ricardo Mendes", "ricardo.mendes@escola.com", "Inglês", "(11) 97166-2211"),
("Fernanda Dias", "fernanda.dias@escola.com", "Artes", "(11) 97177-3344"),
("Daniel Moreira", "daniel.moreira@escola.com", "Ciências", "(11) 97188-4433"),
("Luciana Prado", "luciana.prado@escola.com", "Educação Física", "(11) 97199-5566"),
("Ana Carolina", "ana.carolina@escola.com", "Português", "(11) 97200-6677"),
("Gustavo Nobre", "gustavo.nobre@escola.com", "Matemática", "(11) 97211-7788"),
("Sabrina Lopes", "sabrina.lopes@escola.com", "História", "(11) 97222-8899"),
("Henrique Castro", "henrique.castro@escola.com", "Geografia", "(11) 97233-9900"),
("Mirela Teixeira", "mirela.teixeira@escola.com", "Ciências", "(11) 97244-1100"),
("Bruno Andrade", "bruno.andrade@escola.com", "Matemática", "(11) 97255-2200"),
("Isabela Fernandes", "isabela.fernandes@escola.com", "Inglês", "(11) 97266-3300"),
("Thiago Barros", "thiago.barros@escola.com", "Educação Física", "(11) 97277-4400"),
("Beatriz Campos", "beatriz.campos@escola.com", "Artes", "(11) 97288-5500"),
("Leandro Farias", "leandro.farias@escola.com", "História", "(11) 97299-6600"),
("Marta Ribeiro", "marta.ribeiro@escola.com", "Português", "(11) 97300-7700"),
("Samuel Rocha", "samuel.rocha@escola.com", "Ciências", "(11) 97311-8800");

/* ===============================
	TABELA TURMAS
	professor_id é NULLABLE para permitir ON DELETE SET NULL
================================= */
CREATE TABLE IF NOT EXISTS turmas (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 nome VARCHAR(50),
	 ano INT,
	 professor_id INT NULL,
	 INDEX (professor_id),
	 CONSTRAINT fk_turmas_professor FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* Inserção das turmas */
INSERT INTO turmas (nome, ano, professor_id) VALUES
("6º A", 2025, 1),
("6º B", 2025, 2),
("6º C", 2025, 3),
("7º A", 2025, 4),
("7º B", 2025, 5),
("7º C", 2025, 6),
("8º A", 2025, 7),
("8º B", 2025, 8),
("8º C", 2025, 9),
("9º A", 2025, 10),
("9º B", 2025, 11),
("9º C", 2025, 12),
("6º D", 2025, 13),
("7º D", 2025, 14),
("8º D", 2025, 15),
("9º D", 2025, 16),
("6º E", 2025, 17),
("7º E", 2025, 18),
("8º E", 2025, 19),
("9º E", 2025, 20);

/* ===============================
	TABELA ALUNOS
	turma_id é NULLABLE para permitir ON DELETE SET NULL
================================= */
CREATE TABLE IF NOT EXISTS alunos (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 nome VARCHAR(100),
	 data_nascimento DATE,
	 turma_id INT NULL,
	 responsavel VARCHAR(100),
	 telefone_responsavel VARCHAR(20),
	 INDEX (turma_id),
	 CONSTRAINT fk_alunos_turma FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* Inserção de alunos */
INSERT INTO alunos (nome, data_nascimento, turma_id, responsavel, telefone_responsavel) VALUES
("Ana Júlia Ferreira", "2011-04-12", 1, "Carlos Ferreira", "(11) 98801-1122"),
("Pedro Henrique Santos", "2010-09-22", 1, "Marta Santos", "(11) 97988-3322"),
("Luiza Rocha Gomes", "2012-01-05", 2, "Daniela Gomes", "(11) 98123-4466");

/* ===============================
	TABELA RECADOS
================================= */
CREATE TABLE IF NOT EXISTS recados (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 aluno_id INT NULL,
	 professor_id INT NULL,
	 data_recado DATE,
	 tipo VARCHAR(50),
	 mensagem TEXT,
	 INDEX (aluno_id),
	 INDEX (professor_id),
	 CONSTRAINT fk_recados_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE SET NULL ON UPDATE CASCADE,
	 CONSTRAINT fk_recados_professor FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* ===============================
	TABELA UNIFICADA DE USUÁRIOS PARA LOGIN
	Suporta login por email ou por nome de usuário. Senhas já armazenadas como hashes.
================================= */
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 usuario VARCHAR(80) UNIQUE NULL,
	 email VARCHAR(120) UNIQUE NULL,
	 senha VARCHAR(255) NOT NULL,
	 tipo ENUM('aluno','professor','gestor','responsavel') NOT NULL,
	 ref_id INT NULL,
	 criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* Inserções de usuários (senhas armazenadas como hash scrypt gerado por werkzeug.security.generate_password_hash) */
/* Hash para '12345' */
-- scrypt hash generated: scrypt:32768:8:1$A6ASJRjtctrfLjQ7$227f8aa50726c22cb2ca79653e014e04e1da2d19fc9d14d50b2006244067d37eeca9741ffcae056c473a99504d4e1e9b0405193da613827eb2d452b615cd9ecf
/* Hash para '123' */
-- scrypt hash generated: scrypt:32768:8:1$r0C5WsVM4VbnHAlY$d20e2967656cdbdfdb85e950abf26dc486a153b1d524b8787ff17c5c10a80abf10a4861e390eace80a790f022f50edf9d368cfb1146e8bf982a5f8a63f390335

/* Professores com login (usando email) */
INSERT INTO usuarios (email, senha, tipo, ref_id) VALUES
("carlos.silva@escola.com", 'scrypt:32768:8:1$A6ASJRjtctrfLjQ7$227f8aa50726c22cb2ca79653e014e04e1da2d19fc9d14d50b2006244067d37eeca9741ffcae056c473a99504d4e1e9b0405193da613827eb2d452b615cd9ecf', "professor", 1),
("mariana.souza@escola.com", 'scrypt:32768:8:1$A6ASJRjtctrfLjQ7$227f8aa50726c22cb2ca79653e014e04e1da2d19fc9d14d50b2006244067d37eeca9741ffcae056c473a99504d4e1e9b0405193da613827eb2d452b615cd9ecf', "professor", 2),
("joao.batista@escola.com", 'scrypt:32768:8:1$A6ASJRjtctrfLjQ7$227f8aa50726c22cb2ca79653e014e04e1da2d19fc9d14d50b2006244067d37eeca9741ffcae056c473a99504d4e1e9b0405193da613827eb2d452b615cd9ecf', "professor", 3);

/* Alunos com login (usando email) */
INSERT INTO usuarios (email, senha, tipo, ref_id) VALUES
("ana.julia@escola.com", 'scrypt:32768:8:1$A6ASJRjtctrfLjQ7$227f8aa50726c22cb2ca79653e014e04e1da2d19fc9d14d50b2006244067d37eeca9741ffcae056c473a99504d4e1e9b0405193da613827eb2d452b615cd9ecf', "aluno", 1),
("pedro.santos@escola.com", 'scrypt:32768:8:1$A6ASJRjtctrfLjQ7$227f8aa50726c22cb2ca79653e014e04e1da2d19fc9d14d50b2006244067d37eeca9741ffcae056c473a99504d4e1e9b0405193da613827eb2d452b615cd9ecf', "aluno", 2),
("luiza.rocha@escola.com", 'scrypt:32768:8:1$A6ASJRjtctrfLjQ7$227f8aa50726c22cb2ca79653e014e04e1da2d19fc9d14d50b2006244067d37eeca9741ffcae056c473a99504d4e1e9b0405193da613827eb2d452b615cd9ecf', "aluno", 3);

/* Inserções por nome de usuário (ex.: contas de teste/gestor/responsável) - usando hash para '123' */
INSERT INTO usuarios (usuario, senha, tipo, ref_id) VALUES
('ana.aluno', 'scrypt:32768:8:1$r0C5WsVM4VbnHAlY$d20e2967656cdbdfdb85e950abf26dc486a153b1d524b8787ff17c5c10a80abf10a4861e390eace80a790f022f50edf9d368cfb1146e8bf982a5f8a63f390335', 'aluno', 1),
('pedro.aluno', 'scrypt:32768:8:1$r0C5WsVM4VbnHAlY$d20e2967656cdbdfdb85e950abf26dc486a153b1d524b8787ff17c5c10a80abf10a4861e390eace80a790f022f50edf9d368cfb1146e8bf982a5f8a63f390335', 'aluno', 2),
('carlos.prof', 'scrypt:32768:8:1$r0C5WsVM4VbnHAlY$d20e2967656cdbdfdb85e950abf26dc486a153b1d524b8787ff17c5c10a80abf10a4861e390eace80a790f022f50edf9d368cfb1146e8bf982a5f8a63f390335', 'professor', 1),
('mariana.prof', 'scrypt:32768:8:1$r0C5WsVM4VbnHAlY$d20e2967656cdbdfdb85e950abf26dc486a153b1d524b8787ff17c5c10a80abf10a4861e390eace80a790f022f50edf9d368cfb1146e8bf982a5f8a63f390335', 'professor', 2),
('gestor1', 'scrypt:32768:8:1$r0C5WsVM4VbnHAlY$d20e2967656cdbdfdb85e950abf26dc486a153b1d524b8787ff17c5c10a80abf10a4861e390eace80a790f022f50edf9d368cfb1146e8bf982a5f8a63f390335', 'gestor', NULL),
('responsavel1', 'scrypt:32768:8:1$r0C5WsVM4VbnHAlY$d20e2967656cdbdfdb85e950abf26dc486a153b1d524b8787ff17c5c10a80abf10a4861e390eace80a790f022f50edf9d368cfb1146e8bf982a5f8a63f390335', 'responsavel', NULL);

/* Índices auxiliares (se necessário) */
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);

*** End Patch

