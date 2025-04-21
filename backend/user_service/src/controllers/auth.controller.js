import connection from "../services/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tokenService } from "../helpers/createToken.js";
import { sendResetPassEmail, sendVerificationEmail } from "../services/mailer.js";
import { hashPass } from "../helpers/hashpassword.js";
import verifyGoogleToken from "../services/Oauth.js";

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
  
  // async registerAdmin(req, res) {
  //   const { email, password, username } = req.body;
  
  //   connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
  //     if (err) {
  //       console.error("DB Error:", err);
  //       return res.status(500).json({ message: "Internal server error" });
  //     }
  
  //     if (results.length > 0) {
  //       return res.status(400).json({ message: "Email already exists" });
  //     }
  
  //     const hashedPassword = await hashPass(password);
  
  //     connection.query(
  //       "INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)",
  //       [email, hashedPassword, username, "admin"],
  //       (insertErr, insertResult) => {
  //         if (insertErr) {
  //           console.error("Insert Error:", insertErr);
  //           return res.status(500).json({ message: "Failed to register user" });
  //         }
  
  //         return res.status(201).json({ message: "Register success, please login" });
  //       }
  //     );
  //   });
  // }

  async loginAny(req, res) {
    const { email, password } = req.body;
    try {
      connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
    
        if (results.length < 1) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, results[0].password);
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
      connection.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, 'admin'], async (err, results) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
    
        if (results.length < 1) {
          return res.status(400).json({ message: "Youre account is not admin" });
        }
        
        const match = await bcrypt.compare(password, results[0].password);
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
  
  async resetPassword(req, res) {
    const { email } = req.body;
    try {
      connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (results.length < 1) return res.status(400).json({ message: "Invalid credentials" });
        
        const token = tokenService.createResetToken({
          id: results[0].user_id,
          role: results[0].role,
          resetPassword: results[0].password,
        });
        
        const sqlUpdate = "UPDATE users SET password_reset_token = ? WHERE user_id = ?"
        connection.query(sqlUpdate, [token, results[0].user_id], (err, resultSetToken) => {
          if (err) res.status(300).json({err})
          // console.log(resultSetToken)
          sendResetPassEmail(email, token);
          return res.status(201).json({
            status: "success",
            token: token,
            message:
            "Reset Password Link send successfully. Please check your email for verification.",
            user: results,
          });
        })
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyResetPassword(req, res) {
    const { oldPassword, password, confirmPassword } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "")
    try {
      if (!token) {
        return res.status(401).json({ message: "Unauthorized, where youre reset token ?" });
      }

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validasi kesesuaian password baru
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      
      if (!oldPassword || !password) {
        return res.status(400).json({ message: "Both old and new passwords are required" });
      }

      const userId = req.user.id;

      connection.query("SELECT * FROM users WHERE user_id = ? AND password_reset_token = ?", [userId, token], async (err, results) => {
        if (results.length < 1) return res.status(400).json({ message: "Invalid credentials", data: results });

        // Bandingkan password yang belum di-hash dengan password yang sudah di-hash
        const isPasswordMatch = await bcrypt.compare(oldPassword, results[0].password);
        console.log('is pass: ', isPasswordMatch)
        if (!isPasswordMatch) {
          return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Hash dan simpan password baru
        const hashedPassword =  await hashPass(password);
        
        // const token = tokenService.createResetToken({
        //   id: results.user_id,
        //   role: results.role,
        //   resetPassword: results.password,
        // });

        // console.log(hashedPassword)
        const sqlUpdate = "UPDATE users SET password = ?, password_reset_token = NULL WHERE user_id = ?"
        connection.query(sqlUpdate, [hashedPassword, results[0].user_id], (err, resultReset) => {
          if (err) res.status(300).json({err})
          return res.status(201).json({
            status: "success",
          // token: token,
          message:
          "Reset Password successfully. Please login.",
          user: results,
        });
        })
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async googleRegister(req, res) {
    const { idToken } = req.body;
  
    try {
      const { email, name, picture, email_verified } = await verifyGoogleToken(idToken);
  
      if (!email_verified) {
        return res.status(400).json({ message: "Email not verified by Google" });
      }
  
      connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
  
        if (results.length === 0) {
          // User belum ada, insert
          connection.query(
            "INSERT INTO users (email, role, username, avatar) VALUES (?, ?, ?, ?)",
            [email, "guest", name, picture],
            (err, resultCreate) => {
              if (err) return res.status(500).json({ message: "Insert error" });
  
              connection.query("SELECT * FROM users WHERE user_id = ?", [resultCreate.insertId], (err, resultSelect) => {
                if (err) return res.status(500).json({ message: "Select error" });
  
                const token = tokenService.createLoginToken({
                  id: resultSelect[0].user_id,
                  role: resultSelect[0].role,
                });
  
                res.status(200).json({ message: "Success login", token, user: resultSelect[0] });
              });
            }
          );
        } else {
          // User sudah ada
          const user = results[0];
          const token = tokenService.createLoginToken({
            id: user.user_id,
            role: user.role,
          });
  
          res.status(200).json({ message: "Success login", token, user });
        }
      });
    } catch (err) {
      console.error("Error verifying Google token:", err);
      res.status(401).json({ message: "Invalid Google token" });
    }
  }
  
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
