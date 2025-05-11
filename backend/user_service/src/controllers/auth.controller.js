import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tokenService } from "../helpers/createToken.js";
import { sendResetPassEmail, sendVerificationEmail } from "../services/mailer.js";
import { hashPass } from "../helpers/hashpassword.js";
import verifyGoogleToken from "../services/Oauth.js";
import pool from "../services/db.js";

const JWT_SECRET = process.env.SECRET_KEY || "osdjfksdhfishd";

export class AuthController {

  async registerGuest(req, res) {
    const { email, password, username, avatar } = req.body;
    let connection;
    
    try {
      connection = await pool.getConnection();
      
      // Cek email sudah ada
      const [existingUsers] = await connection.query(
        "SELECT * FROM users WHERE email = ?", 
        [email]
      );
  
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await hashPass(password);
  
      // Insert user baru
      const [insertResult] = await connection.query(
        "INSERT INTO users (email, password, username, avatar, role) VALUES (?, ?, ?, ?, ?)",
        [email, hashedPassword, username, avatar ?? 'https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg', "guest"]
      );
  
      // Insert koin default
      await connection.query(
        "INSERT INTO koin (user_id, amount) VALUES (?, ?)", 
        [insertResult.insertId, 0]
      );
  
      return res.status(201).json({ message: "Register success, please login" });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      if (connection) connection.release();
    }
  }
  async loginAny(req, res) {
    const { email, password } = req.body;
    let connection;
    
    try {
      connection = await pool.getConnection();
      
      const [results] = await connection.query(
        "SELECT * FROM users WHERE email = ?", 
        [email]
      );
  
      if (results.length < 1) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const match = await bcrypt.compare(password, results[0].password);
      if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = tokenService.createLoginToken({
        id: results[0].user_id,
        role: results[0].role,
      });
      
      res.status(200).json({ 
        message: 'success login', 
        token, 
        results 
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      if (connection) connection.release();
    }
  }
  
  async loginAdmin(req, res) {
    const { email, password } = req.body;
    let connection;
    
    try {
      connection = await pool.getConnection();
      
      const [results] = await connection.query(
        "SELECT * FROM users WHERE email = ? AND role = ?", 
        [email, 'admin']
      );

      if (results.length < 1) {
        return res.status(400).json({ message: "Your account is not admin" });
      }
      
      const match = await bcrypt.compare(password, results[0].password);
      if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      const token = tokenService.createLoginToken({
        id: results[0].user_id,
        role: results[0].role,
      });
      
      res.status(200).json({ 
        message: 'success login', 
        token, 
        results 
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      if (connection) connection.release();
    }
  }
  
  async resetPassword(req, res) {
    const { email } = req.body;
    let connection;
    
    try {
      connection = await pool.getConnection();
      
      const [results] = await connection.query(
        "SELECT * FROM users WHERE email = ?", 
        [email]
      );

      if (results.length < 1) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      const token = tokenService.createResetToken({
        id: results[0].user_id,
        role: results[0].role,
        resetPassword: results[0].password,
      });
      
      await connection.query(
        "UPDATE users SET password_reset_token = ? WHERE user_id = ?",
        [token, results[0].user_id]
      );
      
      await sendResetPassEmail(email, token);
      
      return res.status(201).json({
        status: "success",
        token: token,
        message: "Reset Password Link sent successfully. Please check your email for verification.",
        user: results[0],
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      if (connection) connection.release();
    }
  }

  async cekResetToken(req, res) {
    const { token } = req.body;
    let connection;
    
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      connection = await pool.getConnection();
      
      const [results] = await connection.query(
        "SELECT * FROM users WHERE user_id = ?", 
        [decodedToken.id]
      );

      if (results.length < 1) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      if (results[0].password_reset_token == null) {
        return res.status(250).json({ message: "token tidak tersedia" });
      }
      
      if (results[0].password_reset_token === token) {
        return res.status(200).json({ message: "token tersedia" });
      }
      
      return res.status(200).json({ message: "token tersedia" });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      if (connection) connection.release();
    }
  }

  async verifyResetPassword(req, res) {
    const { password, confirmPassword } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");
    let connection;
    
    try {
      if (!token) {
        return res.status(401).json({ message: "Unauthorized, where your reset token?" });
      }

      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      
      // Validasi kesesuaian password baru
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      connection = await pool.getConnection();
      
      const [results] = await connection.query(
        "SELECT * FROM users WHERE user_id = ? AND password_reset_token = ?", 
        [decodedToken.id, token]
      );

      if (results.length < 1) {
        return res.status(400).json({ 
          message: "Invalid credentials or Reset token is empty on db", 
          data: results 
        });
      }

      // Hash dan simpan password baru
      const hashedPassword = await hashPass(password);
      
      await connection.query(
        "UPDATE users SET password = ?, password_reset_token = NULL WHERE user_id = ?",
        [hashedPassword, results[0].user_id]
      );
      
      return res.status(201).json({
        status: "success",
        message: "Reset Password successfully. Please login.",
        user: results[0],
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      if (connection) connection.release();
    }
  }

  async googleRegister(req, res) {
    const { idToken } = req.body;
    let connection;
    
    try {
      const { email, name, picture, email_verified } = await verifyGoogleToken(idToken);
  
      if (!email_verified) {
        return res.status(400).json({ message: "Email not verified by Google" });
      }

      connection = await pool.getConnection();
      
      const [existingUsers] = await connection.query(
        "SELECT * FROM users WHERE email = ?", 
        [email]
      );

      if (existingUsers.length === 0) {
        // User belum ada, insert
        const [resultCreate] = await connection.query(
          "INSERT INTO users (email, role, username, avatar) VALUES (?, ?, ?, ?)",
          [email, "guest", name, picture]
        );
        
        const [newUser] = await connection.query(
          "SELECT * FROM users WHERE user_id = ?", 
          [resultCreate.insertId]
        );
        
        const token = tokenService.createLoginToken({
          id: newUser[0].user_id,
          role: newUser[0].role,
        });
        
        res.status(200).json({ 
          message: "Success login", 
          token, 
          user: newUser[0] 
        });
      } else {
        // User sudah ada
        const user = existingUsers[0];
        const token = tokenService.createLoginToken({
          id: user.user_id,
          role: user.role,
        });
        
        res.status(200).json({ 
          message: "Success login", 
          token, 
          user 
        });
      }
    } catch (err) {
      console.error("Error verifying Google token:", err);
      res.status(401).json({ message: "Invalid Google token" });
    } finally {
      if (connection) connection.release();
    }
  }
  
  async me(req, res) {
    let connection;
    
    try {
      if (!req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      connection = await pool.getConnection();
      
      const query = `
        SELECT 
          u.*, 
          k.*
        FROM 
          users u
        LEFT JOIN 
          koin k ON u.user_id = k.user_id
        WHERE 
          u.user_id = ?
      `;
      
      const [results] = await connection.query(query, [req.user.id]);
      
      res.status(200).json({ results });
      
    } catch (err) {
      console.error("DB Error:", err);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      if (connection) connection.release();
    }
  }
}
