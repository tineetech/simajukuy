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
  
    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await hashPass(password);
  
      connection.query(
        "INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, username, "guest"],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert Error:", insertErr);
            return res.status(500).json({ message: "Failed to register user" });
          }
  
          return res.status(201).json({ message: "Register success, please login" });
        }
      );
    });
  }
  
  async registerAdmin(req, res) {
    const { email, password, username } = req.body;
  
    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await hashPass(password);
  
      connection.query(
        "INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, username, "admin"],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert Error:", insertErr);
            return res.status(500).json({ message: "Failed to register user" });
          }
  
          return res.status(201).json({ message: "Register success, please login" });
        }
      );
    });
  }

  async loginAny(req, res) {
    const { email, password } = req.body;
    try {
      connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
    
        if (results.length < 1) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log(results)
        const match = bcrypt.compare(password, password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });
        const token = tokenService.createLoginToken({
          id: results.user_id,
          role: results.role,
        });
        res.status(200).json({ message: 'success login', token, results });
      })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async loginAdmin(req, res) {
    const { email, password } = req.body;
    try {
      connection.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, 'admin'], (err, results) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
    
        if (results.length < 1) {
          return res.status(400).json({ message: "Youre account is not admin" });
        }
        
        console.log(results)
        const match = bcrypt.compare(password, password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });
        const token = tokenService.createLoginToken({
          id: results.user_id,
          role: results.role,
        });
        res.status(200).json({ message: 'success login', token, results });
      })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
  // async resetPassword(req, res) {
  //   const { email } = req.body;
  //   try {
  //     const [users] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
  //     const user = users[0];
  //     if (!user) return res.status(400).json({ message: "Invalid credentials" });

  //     const token = tokenService.createResetToken({
  //       id: user.user_id,
  //       role: user.role,
  //       resetPassword: user.password,
  //     });

  //     const sqlUpdate = "UPDATE users SET password_reset_token = ? WHERE user_id = ?"
  //     connection.query(sqlUpdate, [user.user_id], (err, result) => {
  //       if (err) res.status(300).json({err})
  //     })
    
  //     await sendResetPassEmail(email, token);
      
  //     return res.status(201).json({
  //       status: "success",
  //       token: token,
  //       message:
  //       "Reset Password Link send successfully. Please check your email for verification.",
  //       user: findUser,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // async verifyResetPassword(req, res) {
  //   const { oldPassword, password, confirmPassword } = req.body;
  //   try {
  //     if (!req.user) {
  //       return res.status(401).json({ message: "Unauthorized" });
  //     }

  //     // Validasi kesesuaian password baru
  //     if (password !== confirmPassword) {
  //       return res.status(400).json({ message: "Passwords do not match" });
  //     }
      
  //     if (!oldPassword || !password) {
  //       return res.status(400).json({ message: "Both old and new passwords are required" });
  //     }

  //     const userId = req.user.id;

  //     const [users] = await connection.query("SELECT * FROM users WHERE user_id = ?", [userId]);
  //     const user = users[0];
  //     if (!user) return res.status(400).json({ message: "Invalid credentials" });

  //     // Bandingkan password yang belum di-hash dengan password yang sudah di-hash
  //     const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

  //     if (!isPasswordMatch) {
  //       return res.status(400).json({ message: "Old password is incorrect" });
  //     }

  //     // Hash dan simpan password baru
  //     const hashedPassword = await hashPass(password);
      
  //     const token = tokenService.createResetToken({
  //       id: user.user_id,
  //       role: user.role,
  //       resetPassword: user.password,
  //     });

  //     const sqlUpdate = "UPDATE users SET password_reset_token = ? WHERE user_id = ?"
  //     connection.query(sqlUpdate, [user.user_id], (err, result) => {
  //       if (err) res.status(300).json({err})
  //     })
    
  //     await sendResetPassEmail(email, token);

  //     return res.status(201).json({
  //       status: "success",
  //       token: token,
  //       message:
  //       "Reset Password Link send successfully. Please check your email for verification.",
  //       user: findUser,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // async googleRegister(req, res) {
  //   const { email, name, picture } = req.body;
  //   try {
  //     const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
  //     let user = rows[0];

  //     if (!user) {
  //       const [result] = await connection.query(
  //         "INSERT INTO users (email, role, username, avatar, verified) VALUES (?, ?, ?, ?, ?)",
  //         [email, "customer", name, picture, true]
  //       );

  //       const [newUserRows] = await connection.query("SELECT * FROM users WHERE user_id = ?", [result.insertId]);
  //       user = newUserRows[0];
  //     }

  //     const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  //     res.status(200).json({ token, user });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  async me(req, res) {
    try {
      connection.query("SELECT * FROM users WHERE user_id = ?", [req.user.userId], (err, results) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({ results });

      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
