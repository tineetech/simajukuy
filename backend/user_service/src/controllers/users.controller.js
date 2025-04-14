import connection from "../services/db.js";

export class UsersController {
  async getUsers (req, res) {
    try {
      const sqlDataGet = 'SELECT * FROM users';
      connection.query(sqlDataGet, (err, result) => {
        if (err) res.json({"error": err})
        if (result) {
          const sanitizedData = result.map(({ password, ...user }) => user);
    
          res.json({ status: 200, message: 'success get data', data: sanitizedData })
        }
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createUsers (req, res) {
    try {
      const { 
        username,
        first_name,
        last_name,
        email,
        phone,
        password,
        role
      } = req.body
      const sqlCreateData = 'INSET INTO users (username, first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
      connection.query(sqlCreateData, [username, first_name, last_name, email, phone, password, role], (err, result) => {
        if (err) res.json({"error": err})
        if (!result) {
          return res.status(400).json({ message: "User not found" });
        }
        res.json({ status: 200, message: 'success create data', data: userCreate })
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateUsersPublic (req, res) {
    try {
      const { username, firstName, lastName, avatar, phone } = req.body

      const sqlUpdateData = 'UPDATE users set username = ?, first_name = ?, last_name = ?, avatar = ?, phone = ? WHERE id = ?';
      connection.query(sqlUpdateData, [username, firstName, lastName, avatar, phone, req.params.id], (err, result) => {
        if (err) res.json({"error": err})
        if (!result) {
          return res.status(400).json({ message: "Cannot update users" });
        }
        res.json({ status: 200, message: 'success update data', data: result })
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteUsers (req, res) {
    try {
      const sqlDeleteData = 'DELETE FROM users WHERE id = ?';
      connection.query(sqlDeleteData, [req.params.id], (err, result) => {
        res.json({ status: 200, message: 'success remove user', data: user })
      })
      // const koin = await prisma.koin.delete({
      //   where: { user_id: parseInt(req.params.id) }
      // }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
