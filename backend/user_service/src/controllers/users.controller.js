import pool from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export class UsersController {
  async getUsers(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query('SELECT * FROM users');
      
      const sanitizedData = result.map(({ password, ...user }) => user);
      res.json({ status: 200, message: 'success get data', data: sanitizedData });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async getUserById(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        'SELECT * FROM users WHERE user_id = ?', 
        [req.params.id ?? 1]
      );

      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const sanitizedData = result.map(({ password, ...user }) => user);
      res.json({ status: 200, message: 'success get data', data: sanitizedData });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async createUsers(req, res) {
    let connection;
    try {
      const { 
        username,
        first_name,
        last_name,
        email,
        phone,
        password,
        role
      } = req.body;

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Insert user
      const hashedPass = await hashPass(password);
      const [userResult] = await connection.query(
        'INSERT INTO users (username, first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, first_name, last_name, email, phone, hashedPass, role]
      );

      // Insert koin
      await connection.query(
        'INSERT INTO koin (user_id, amount) VALUES (?, ?)',
        [userResult.insertId, 0]
      );

      await connection.commit();

      res.json({
        status: 200,
        message: 'Berhasil membuat user dan koin!',
        data: {
          user_id: userResult.insertId,
          username,
          email,
          role,
          koin: 0
        }
      });
      
    } catch (error) {
      if (connection) await connection.rollback();
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async updateUsersPublic(req, res) {
    let connection;
    try {
      const { username, firstName, lastName, avatar, phone } = req.body;
      connection = await pool.getConnection();

      const [result] = await connection.query(
        'UPDATE users SET username = ?, first_name = ?, last_name = ?, avatar = ?, phone = ? WHERE user_id = ?',
        [username, firstName, lastName, avatar, phone, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ status: 200, message: 'success update data', data: result });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async deleteUsers(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        'DELETE FROM users WHERE user_id = ?',
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ status: 200, message: 'success remove user', data: result });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async getKoins(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query('SELECT * FROM koin');
      
      res.json({ status: 200, message: 'success get data', data: result });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async getKoinById(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        'SELECT * FROM koin WHERE id = ?',
        [req.params.id ?? 1]
      );

      if (result.length === 0) {
        return res.status(404).json({ message: 'Koin not found' });
      }

      res.json({ status: 200, message: 'success get data', data: result });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async createKoin(req, res) {
    let connection;
    try {
      const { user_id, amount } = req.body;
      connection = await pool.getConnection();

      const [result] = await connection.query(
        'INSERT INTO koin (user_id, amount) VALUES (?, ?)',
        [user_id, amount]
      );

      res.json({
        status: 200,
        message: 'Berhasil membuat koin!',
        data: {
          user_id,
          amount,
        }
      });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }
  
  async getTrxKoin(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(`
        SELECT 
          tk.id as transaction_id,
          tk.user_id,
          tk.amount,
          tk.number_target,
          tk.method_target,
          tk.created_at,
          tk.updated_at,
          tk.status,
          u.username,
          u.email
        FROM 
          transaction_koin tk
        LEFT JOIN 
          users u ON tk.user_id = u.user_id
        ORDER BY tk.created_at DESC
      `);

      if (result.length === 0) {
        return res.status(404).json({ 
          message: 'No transaction data found',
          suggestion: 'Check if transaction_koin table has records'
        });
      }

      res.status(200).json({ 
        status: 200, 
        message: 'Success get data', 
        data: result 
      });
      
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        error: "Internal server error",
        details: error.message 
      });
    } finally {
      if (connection) connection.release();
    }
  }

  async createTrxKoin(req, res) {
    let connection;
    try {
      const { user_id, coin, number_target, method_target, amount } = req.body;
      
      if (amount % 1000 !== 0) {
        return res.status(400).json({ message: "Nilai jumlah penukaran harus berupa kelipatan ribuan (1000)" });
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Create transaction
      const [trxResult] = await connection.query(
        'INSERT INTO transaction_koin (user_id, number_target, method_target, amount) VALUES (?, ?, ?, ?)',
        [user_id, number_target, method_target, amount]
      );

      // Update koin
      const downCoin = coin - amount;
      await connection.query(
        'UPDATE koin SET amount = ? WHERE user_id = ?',
        [downCoin, user_id]
      );

      await connection.commit();

      res.json({
        status: 200,
        message: 'Berhasil membuat penukaran!',
        data: {
          user_id,
          number_target,
          method_target,
          amount,
        }
      });
      
    } catch (error) {
      if (connection) await connection.rollback();
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async bayarPenukaranKoin(req, res) {
    try {
      const { idOrder, productId, productName, price, userId, userName, email, nomor_tujuan } = req.body;
  
      // Hitung total harga item
      const parsedPrice = parseInt(price);
      const parsedQty = 1;
      const itemTotal = parsedPrice * 1;
  
      // Hitung pajak dan biaya layanan
      const taxAmount = itemTotal * (10 / 100); // 10% pajak
      const serviceCharge = itemTotal * (2 / 100); // 2% biaya layanan
      
      // Hitung gross amount
      var grossAmount = itemTotal + taxAmount + serviceCharge;
  
      const parameter = {
        transaction_details: {
          order_id: idOrder,
          gross_amount: grossAmount,
        },
        item_details: [
          {
            id: productId,
            price: parsedPrice,
            quantity: parsedQty,
            name: productName,
          },
          {
            id: 'tax',
            price: Math.round(taxAmount),
            quantity: 1,
            name: 'Tax (10%)',
          },
          {
            id: 'service_charge',
            price: Math.round(serviceCharge),
            quantity: 1,
            name: 'Service Charge (2%)',
          },
        ],
        customer_details: {
          first_name: userName,
          nomor_tujuan,
          email: `${email}`,
        },
      };
  
      const transaction = await snap.createTransaction(parameter);
      res.status(200).json({ token: transaction.token, redirect_url: transaction.redirect_url });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create transaction', details: error.message });
    }
  }

  async updateKoin(req, res) {
    let connection;
    try {
      const { amount } = req.body;
      connection = await pool.getConnection();

      // Get current amount
      const [current] = await connection.query(
        'SELECT * FROM koin WHERE user_id = ?',
        [req.params.id]
      );

      if (current.length === 0) {
        return res.status(404).json({ message: "Koin not found" });
      }

      const newAmount = current[0].amount + amount;
      
      // Update koin
      const [result] = await connection.query(
        'UPDATE koin SET amount = ? WHERE user_id = ?',
        [newAmount, req.params.id]
      );

      res.status(200).json({ message: 'success update data', data: result });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async deleteKoin(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        'DELETE FROM koin WHERE user_id = ?',
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Koin not found" });
      }

      res.status(200).json({ message: 'success remove koin', data: result });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }
}