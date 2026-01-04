import os
from flask import Flask, render_template, request, redirect, url_for, session, g
from functools import wraps
import pymysql
from werkzeug.security import check_password_hash


# ======================================================
# CONFIG
# ======================================================
class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or os.urandom(24)
    MYSQL_HOST = "projeto"
    MYSQL_USER = "root"
    MYSQL_PASSWORD = "Sedu@1234"
    MYSQL_DB = "escola"
    MYSQL_PORT = 3306


# ======================================================
# APP
# ======================================================
app = Flask(__name__)
app.config.from_object(Config)

# Flag para modo teste (sem banco de dados)
TEST_MODE = False
DB_CONNECTION_ERROR = None


# ======================================================
# DATABASE CONNECTION
# ======================================================
def get_db():
    global TEST_MODE, DB_CONNECTION_ERROR
    
    if "db" not in g:
        try:
            g.db = pymysql.connect(
                host=Config.MYSQL_HOST,
                user=Config.MYSQL_USER,
                password=Config.MYSQL_PASSWORD,
                database=Config.MYSQL_DB,
                port=Config.MYSQL_PORT,
                charset="utf8mb4",
                cursorclass=pymysql.cursors.DictCursor
            )
            TEST_MODE = False
        except Exception as e:
            DB_CONNECTION_ERROR = str(e)
            TEST_MODE = True
            print(f"⚠️  Modo TESTE ativado: Banco de dados indisponível")
            print(f"   Erro: {e}")
            g.db = None
    
    return g.db


@app.teardown_appcontext
def close_db(error):
    db = g.pop("db", None)
    if db:
        db.close()


# ======================================================
# MOCK DATA FOR TEST MODE
# ======================================================
MOCK_USERS = {
    "ana.aluno": {"senha": "123", "tipo": "aluno", "id": 1, "ref_id": 1},
    "carlos.prof": {"senha": "123", "tipo": "professor", "id": 2, "ref_id": 1},
    "gestor1": {"senha": "123", "tipo": "gestor", "id": 3, "ref_id": None},
    "responsavel1": {"senha": "123", "tipo": "responsavel", "id": 4, "ref_id": None},
}


# ======================================================
# LOGIN
# ======================================================
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        login_value = request.form.get("usuario")
        senha = request.form.get("senha")

        # ===== MODO TESTE =====
        if TEST_MODE:
            user = MOCK_USERS.get(login_value)
            if not user:
                return render_template("login.html", erro="Usuário não encontrado")
            if user["senha"] != senha:
                return render_template("login.html", erro="Senha incorreta")
            
            session["user_id"] = user["id"]
            session["tipo"] = user["tipo"]
            session["ref_id"] = user["ref_id"]
            return redirect(url_for("redirect_portal"))
        
        # ===== MODO PRODUÇÃO =====
        db = get_db()
        if db is None:
            return render_template("login.html", erro="Erro ao conectar ao banco de dados")
        
        cursor = db.cursor()
        cursor.execute("""
            SELECT * FROM usuarios
            WHERE email = %s OR usuario = %s
        """, (login_value, login_value))
        user = cursor.fetchone()
        cursor.close()

        if not user:
            return render_template("login.html", erro="Usuário não encontrado")

        if not check_password_hash(user["senha"], senha):
            return render_template("login.html", erro="Senha incorreta")

        session["user_id"] = user["id"]
        session["tipo"] = user["tipo"]
        session["ref_id"] = user["ref_id"]

        return redirect(url_for("redirect_portal"))

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# ======================================================
# PORTAL REDIRECT
# ======================================================
@app.route("/redirect_portal")
def redirect_portal():
    tipo = session.get("tipo")

    if tipo == "aluno":
        return redirect(url_for("portal_aluno"))
    if tipo == "professor":
        return redirect(url_for("portal_professor"))
    if tipo == "gestor":
        return redirect(url_for("portal_gestor"))
    if tipo == "responsavel":
        return redirect(url_for("portal_responsavel"))

    return redirect(url_for("login"))


# ======================================================
# LOGIN REQUIRED DECORATOR
# ======================================================
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        test_user = request.args.get("test_user")
        if test_user and TEST_MODE:
            session["user_id"] = 999
            session["tipo"] = test_user
            session["ref_id"] = 1
            return f(*args, **kwargs)
        
        if "user_id" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


# ======================================================
# PORTAIS
# ======================================================
@app.route("/portal/aluno")
@login_required
def portal_aluno():
    if session.get("tipo") != "aluno":
        return "Acesso negado", 403
    return render_template("alunos.html")


@app.route("/portal/professor")
@login_required
def portal_professor():
    if session.get("tipo") != "professor":
        return "Acesso negado", 403
    return render_template("professor.html")


@app.route("/portal/gestor")
@login_required
def portal_gestor():
    if session.get("tipo") != "gestor":
        return "Acesso negado", 403
    return render_template("gestor.html")


@app.route("/portal/responsavel")
@login_required
def portal_responsavel():
    if session.get("tipo") != "responsavel":
        return "Acesso negado", 403
    return render_template("responsavel.html")


@app.route('/chat')
@login_required
def chat_page():
    return render_template('chat.html')


# ======================================================
# PUBLIC PAGES (ATUALIZADAS)
# ======================================================
@app.route("/")
def landing():
    return render_template("landing.html")


@app.route("/index", endpoint="index_page")
def index_page():
    role = session.get("tipo")

    mapping = {
        "aluno": "portal_aluno",
        "professor": "portal_professor",
        "gestor": "portal_gestor",
        "responsavel": "portal_responsavel"
    }

    endpoint = mapping.get(role)
    
    portal_url = url_for(endpoint) if endpoint in app.view_functions else url_for("index_page")

    return render_template("index.html", portal_url=portal_url)


# ======================================================
# TESTE - PÁGINA PÚBLICA (sem login)
# ======================================================
@app.route("/teste-index")
def teste_index():
    return render_template("index.html", portal_url=url_for("landing"))

@app.route("/teste-hamburger")
def teste_hamburger():
    return render_template("test_hamburger.html")

@app.route("/teste-gestor")
def teste_gestor():
    return render_template("gestor.html")

@app.route("/diario-final")
@login_required
def diario_final():
    return render_template("diario-final.html")


@app.route("/cadastro", methods=["GET", "POST"])
def cadastro():
    if request.method == "POST":
        pass
    return render_template("cadastro.html")


@app.route('/alunos', endpoint='alunos_page')
def alunos_page():
    return render_template('alunos.html')


# ======================================================
# RUN
# ======================================================
if __name__ == "__main__":
    app.run(debug=True)
