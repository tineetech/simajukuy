import connection from "../services/db.js";

export class KoinController {
  async getTrxKoin(req, res) {
    try {
      // 2. Query dengan JOIN yang lebih eksplisit
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
      
      connection.query(sqlDataGet, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error", details: err });
        }
          
        if (result && result.length > 0) {
          return res.status(200).json({ 
            status: 200, 
            message: 'Success get data', 
            data: result 
          });
        } else {
          // 3. Berikan informasi lebih detail saat data kosong
          return res.status(404).json({ 
            message: 'No transaction data found',
            suggestion: 'Check if transaction_koin table has records'
          });
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        details: error.message 
      });
    }
  }

}
