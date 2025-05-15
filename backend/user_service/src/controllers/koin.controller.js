import pool from "../services/db.js";
import midtransClient from "midtrans-client";


const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-GL4Bid_JKR0pNMYoojpcBUcL",
});

export class KoinController {
  async getTrxKoin(req, res) {
    let conn;
    try {
      conn = await pool.getConnection(); // Dapatkan koneksi dari pool

      // Query dengan JOIN yang lebih eksplisit
      const sqlDataGet = `
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
      `;
      
      // Eksekusi query dengan Promise
      const [result] = await conn.query(sqlDataGet);

      if (result.length > 0) {
        return res.status(200).json({ 
          status: 200, 
          message: 'Success get data', 
          data: result 
        });
      } else {
        return res.status(404).json({ 
          status: 404,
          message: 'No transaction data found',
          suggestion: 'Check if transaction_koin table has records'
        });
      }
    } catch (error) {
      console.error("Error in getTrxKoin:", error);
      return res.status(500).json({ 
        status: 500,
        error: "Internal server error",
        details: error.message 
      });
    } finally {
      if (conn) conn.release(); // Selalu release koneksi
    }
  }

  async bayarPenukaranKoin(req, res) {
    try {
      // Validasi input
      const { order_id, idTrx, productName, price, userName, email, nomor_tujuan } = req.body;
      
      if (!order_id || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Hitung amounts
      const parsedPrice = parseInt(price);
      const taxAmount = Math.round(parsedPrice * 0.10);
      const serviceCharge = Math.round(parsedPrice * 0.02);
      const grossAmount = parsedPrice + taxAmount + serviceCharge;

      // Pastikan minimal amount 10000 (kebijakan Midtrans)
      if (grossAmount < 10000) {
        return res.status(400).json({ error: 'Minimum transaction amount is 10000' });
      }

      const parameter = {
        transaction_details: {
          order_id: order_id,
          gross_amount: grossAmount,
        },
        item_details: [
          {
            id: idTrx,
            price: parsedPrice,
            quantity: 1,
            name: productName,
          },
          {
            id: 'tax',
            price: taxAmount,
            quantity: 1,
            name: 'Tax (10%)',
          },
          {
            id: 'service',
            price: serviceCharge,
            quantity: 1,
            name: 'Service Charge (2%)',
          }
        ],
        customer_details: {
          first_name: userName,
          phone: nomor_tujuan, // ubah dari nomor_tujuan ke phone
          email: email,
        },
        credit_card: {
          secure: true
        }
      };

      const transaction = await snap.createTransaction(parameter);
      
      return res.status(200).json({ 
        token: transaction.token, 
        redirect_url: transaction.redirect_url 
      });
      
    } catch (error) {
      console.error('Midtrans Error:', error);
      return res.status(500).json({ 
        error: 'Payment failed',
        details: error.message,
        midtrans_error: error.ApiResponse // tambahkan detail error dari Midtrans
      });
    }
  }
  
  async confirmPaymentPenukaranKoin(req, res) {
    let conn;
    try {
      conn = await pool.getConnection(); // tambahkan await di sini

      const sqlUpdateTrx = "UPDATE transaction_koin SET method_pay = ?, status = ? WHERE id = ?";
      const { order_id } = req.params;
      const { trxId } = req.body;

      if (!order_id) {
        return res.status(400).json({ error: 'Order ID is required' });
      }

      const transactionStatus = await snap.transaction.status(order_id);

      if (transactionStatus.transaction_status === "settlement") {
        const [result] = await conn.query(sqlUpdateTrx, [transactionStatus.payment_type, 'success', trxId]);

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "TRX not found" });
        }

        return res.status(200).json({
          order_id,
          status: transactionStatus.transaction_status,
          payment_type: transactionStatus.payment_type,
          gross_amount: transactionStatus.gross_amount,
          settlement_time: transactionStatus.settlement_time
        });
      }

      return res.status(200).json({
        order_id,
        status: transactionStatus.transaction_status,
        payment_type: transactionStatus.payment_type,
        gross_amount: transactionStatus.gross_amount,
        settlement_time: transactionStatus.settlement_time
      });

    } catch (error) {
      console.error('Midtrans Error:', error);
      return res.status(500).json({
        error: 'Failed to check payment status',
        order_id: req.params.order_id,
        details: error.message
      });
    } finally {
      if (conn) conn.release();
    }
  }

}
