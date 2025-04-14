import connection from "../services/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tokenService } from "../helpers/createToken.js";
import { sendResetPassEmail, sendVerificationEmail } from "../services/mailer.js";
import { hashPass } from "../helpers/hashpassword.js";

const JWT_SECRET = process.env.SECRET_KEY || "osdjfksdhfishd";

export class AuthController {
  async registerGuest(req, res) {
    const { email, password, username } = req.body;
    try {
      const [users] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
      if (users.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.query(
        "INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, username, "guest"]
      );

      res.status(201).json({ message: "Register success" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const [users] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
      const user = users[0];
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.status(200).json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async googleRegister(req, res) {
    const { email, name, picture } = req.body;
    try {
      const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
      let user = rows[0];

      if (!user) {
        const [result] = await connection.query(
          "INSERT INTO users (email, role, username, avatar, verified) VALUES (?, ?, ?, ?, ?)",
          [email, "customer", name, picture, true]
        );

        const [newUserRows] = await connection.query("SELECT * FROM users WHERE user_id = ?", [result.insertId]);
        user = newUserRows[0];
      }

      const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.status(200).json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async me(req, res) {
    try {
      const [rows] = await connection.query("SELECT * FROM users WHERE user_id = ?", [req.user.userId]);
      const user = rows[0];
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
