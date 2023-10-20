const PORT = process.env.PORT || 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

// get all todos
app.get("/todos/:userEmail", async (req, res, next) => {
  const { userEmail } = req.params;
  try {
    const todos = await db.query("SELECT * FROM todos WHERE user_email = $1", [
      userEmail,
    ]);
    console.log(todos);
    res.json(todos.rows);
  } catch (e) {
    console.error(e);
  }
});

// create a todo
app.post("/todos", async (req, res, next) => {
  try {
    const { user_email, title, progress, date } = req.body;
    console.log(user_email, title, progress, date);
    const id = uuidv4();

    const newTodo = await db.query(
      "INSERT INTO todos (id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)",
      [id, user_email, title, progress, date]
    );
    res.json(newTodo);
  } catch (e) {
    console.error(e);
  }
});

// edit a new todo

app.put("/todos/:id", async (req, res, next) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;

  try {
    const editTodo = await db.query(
      "UPDATE todos SET user_email = $1, title =$2, progress = $3, date=$4 WHERE id = $5;",
      [user_email, title, progress, date, id]
    );
    res.json(editTodo);
  } catch (e) {
    console.error(e);
  }
});

// delete a todo

app.delete("/todos/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteTodo = await db.query("DELETE FROM todos WHERE id=$1", [id]);
    res.json(deleteTodo);
  } catch (e) {
    console.error(e);
  }
});

// signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const signUp = await db.query(
      "INSERT INTO users (email, hashed_password) VALUES($1, $2)",
      [email, hashedPassword]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ email, token });
  } catch (e) {
    console.error(e);
    if (e) {
      res.json({ detail: e.detail });
    }
  }
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if(!users.rows.length) {
      return res.json({detail: 'user does not exist'})
    } else {

      const success = await bcrypt.compare(password, users.rows[0].hashed_password);
      const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

      if(success) {
        res.json({'email' : users.rows[0].email, token})
      } else {
        res.json({detail : 'Login failed'})
      }
    }
  } catch (e) {
    console.error(e);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
