import { PrismaClient } from "@prisma/client";
import { tokenService } from "../helpers/createToken.js";
import { sendResetPassEmail, sendVerificationEmail } from "../services/mailer.js";
import { hashPass } from "../helpers/hashpassword.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.SECRET_KEY || "osdjfksdhfishd"; 

const prisma = new PrismaClient();

export class AuthController {
  async googleRegister(req, res) {
    try {
      const { email, name, picture } = req.body;

      if (!email) return res.status(400).json({ error: "Email tidak ditemukan" });

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Buat user baru jika belum ada
        user = await prisma.user.create({
          data: { email, role: "customer", username: name, avatar: picture, verified: true },
        });
      }

      const token = tokenService.createLoginToken({
        id: user.user_id,
        role: user.role
      });

      // await sendVerificationEmail(email, token);

      return res.status(201).json({
        status: "success",
        token: token,
        message:
          "Login google successfully.",
        user: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Could Reach The Server Database" });
    }
  }

  async registerGuest(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body
      if (!username && !email && !password) {
        return res.status(400).json({
          message: "A unique identifier (username, email, password) is required."
        });  
      }
 
      const existingUser = await prisma.user.findUnique({
        where: { 
          username: username || undefined, // Ensure `username` is not undefined
         },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Confirm Password does not match." });
      }

      // const token = tokenService.createEmailToken({ id: 0, role: "customer", email });

      const hashedPassword = await hashPass(password);
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: "guest",
        },
      });

      const token = tokenService.createEmailRegisterToken({
        id: newUser.user_id,
        role: newUser.role,
        email,
      });

      await prisma.user.update({
        where: { user_id: newUser.user_id },
        data: { verify_email_token: token }
      })

      await sendVerificationEmail(email, token);

      return res.status(201).json({
        status: "success",
        token: token,
        message:
          "Registration successful. Please check your email for verification.",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async registerAdmin(req, res) {
    try {
      const { email, username, password, confirmPassword } = req.body;

      if (!username && !email && !password) {
        return res.status(400).json({
          message: "A unique identifier (username, email, password) is required."
        });  
      }      

      const existingUser = await prisma.user.findUnique({
        where: { 
          username: username || undefined, // Ensure `username` is not undefined
         },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Confirm Password does not match." });
      }

      // const token = tokenService.createEmailToken({ id: 0, role: "customer", email });

      const hashedPassword = await hashPass(password);
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: "admin",
        },
      });

      const token = tokenService.createEmailRegisterToken({
        id: newUser.user_id,
        role: newUser.role,
        email,
      });

      await prisma.user.update({
        where: { user_id: newUser.user_id },
        data: { verify_email_token: token }
      })

      await sendVerificationEmail(email, token);

      return res.status(201).json({
        status: "success",
        token: token,
        message:
          "Registration successful. Please activate this account from administrator.",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async verifyAccount(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        user_id,
      } = req.body;

      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { user_id: userId || user_id },
      });

      if (!user || user.verified) {
        return res.status(400).json({ message: "Invalid verification request" });
      }

      await prisma.user.update({
        where: { user_id: userId || user_id },
        data: {
          status: true,
          verify_email_token: null
        },
      });

      await prisma.koin.create({
        data: {
          amount: 0,
          user_id: user.user_id,
        }
      })

      return res.status(200).json({
        status: "success",
        message: "Email verified successfully",
        role: user.role
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could Reach The Server Database" });
    }
  }

  async verifyAdmin(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        user_id,
      } = req.body;

      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { user_id: userId || user_id },
      });

      if (!user || user.verified) {
        return res.status(400).json({ message: "Invalid verification request" });
      }

      await prisma.user.update({
        where: { user_id: userId || user_id },
        data: {
          status: true,
        },
      });

      await prisma.koin.create({
        data: {
          amount: 0,
          user_id: user.user_id,
        }
      })

      return res.status(200).json({
        status: "success",
        message: "Account admin actived",
        role: user.role
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could Reach The Server Database" });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email } = req.body;

      const findUser = await prisma.user.findFirst({
        where: { email, role: "guest" },
        select: {
          user_id: true,
          email: true,
          avatar: true,
          username: true,
          first_name: true,
          last_name: true,
          phone: true,
          role: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!findUser) {
        return res.status(403).json({
          status: "error",
          token: "",
          message:
          "User not found.",
        });
      }

      const token = tokenService.createResetToken({
        id: findUser.user_id,
        role: findUser.role,
        resetPassword: findUser.role,
      });
      
      await prisma.user.update({
        where: { user_id: findUser?.user_id },
        data: { password_reset_token: token }
      })
      
      await sendResetPassEmail(email, token);
      
      return res.status(201).json({
        status: "success",
        token: token,
        message:
        "Reset Password Link send successfully. Please check your email for verification.",
        user: findUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could Reach The Server Database" });
    }
  }

  async verifyResetPassword(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { oldPassword, newPassword, confirmNewPassword } = req.body;
      // Validasi kesesuaian password baru
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required" });
      }
      
      const userId = req.user.id || req.body.user_id;
      
      // Cari pengguna berdasarkan ID
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid Reset password request" });
      }

      // Bandingkan password yang belum di-hash dengan password yang sudah di-hash
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      console.log(user)

      // Hash dan simpan password baru
      const hashedPassword = await hashPass(newPassword);

      await prisma.user.update({
        where: { user_id: userId },
        data: {
          password: hashedPassword,
          verify_email_token: null,
          password_reset_token: null
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Password Reset successfully",
        role: user.role
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Could Reach The Server Database" });
    }
  }

  async loginAny(req, res) {
    try {
      const { username, password } = req.body;
      console.log('req : ',req.body)
      //  validation
      if (!username && !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await prisma.user.findUnique({
        where: { username: req.body.username },  
      });
      
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      
      const validPass = await bcrypt.compare(req.body.password, user.password);
      console.log(user)
      if (!validPass) {
        return res.status(400).json({ message: "Password incorrect!" });
      }
      const token = tokenService.createLoginToken({
        id: user.user_id,
        role: user.role,
      });

      return res
        .status(201)
        .send({ status: "ok", msg: "Login Success", token, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }    
  }

  async loginAdmin(req, res) {
    try {
      const { username, password } = req.body;
      console.log('req : ',req.body)
      //  validation
      if (!username && !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await prisma.user.findUnique({
        where: { username: req.body.username },  
      });
      
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (user.status == false && user.role !== 'admin') {
        return res.status(400).json({ message: "Akun admin belum aktif dan akun ini bukan admin." });
      }
      
      const validPass = await bcrypt.compare(req.body.password, user.password);
      console.log(user)
      if (!validPass) {
        return res.status(400).json({ message: "Password incorrect!" });
      }
      const token = tokenService.createLoginToken({
        id: user.user_id,
        role: user.role,
      });

      return res
        .status(201)
        .send({ status: "ok", msg: "Login Success Go to dashboard", isAdmin: true, token, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }    
  }
  
  async checkExpTokenEmailVerif(req, res) {
    const { token } = req.params;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Verifikasi token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Cek apakah token sudah lebih dari 1 jam sejak dibuat
      const tokenAge = Math.floor(Date.now() / 1000) - decoded.iat; // Selisih waktu dalam detik
      if (tokenAge > 3600) { // 1 jam = 3600 detik
        return res.status(409).json({ status: "no", message: "Token Expired" });
      }

      return res.status(200).json({ status: "ok", message: "Token Active" });

    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Invalid or expired token" });
    }
  };
}
