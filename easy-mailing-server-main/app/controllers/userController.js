import client from '../database.js';
import User from '../models/User.js';

const userController = {
  login: async function(req, res) {
    try {
      const user = new User(req.body);
      const tokenRequest = await user.login();
      if (tokenRequest === null) {
        res.status(401).json();
      } else {
        const token = tokenRequest.token
        res.json(
          {
            userId: tokenRequest.userId,
            email: user.email,
            token
          }
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500)
    }
  },
  listUser: async function(_, res) {
    try {
      const equest = 'SELECT * FROM "user"';
      const usersList = await client.query(equest);
      const list = usersList.rows;
      res.send(list);
    } catch (error) {
      console.error(error)
      res.status(500)
    }
  },
//   user: async function(req, res) {
//     try {
//         const userRequest = await client.query('SELECT * FROM "user" WHERE id = $1', [req.params.id]);
//         const user = userRequest.rows[0];
//         res.send(user);
//     } catch (error) {
//         console.error(error)
//         res.status(500)
//     }
//   }
};
export default userController;