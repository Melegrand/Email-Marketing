import client from '../database.js';
import User from '../models/User.js';
import UserLogin from '../models/UserLogin.js';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userController = {
  login: async function(req, res) {
    try {
      const user = new UserLogin(req.body);
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
  signup: async function(req, res) {
      try {
        const options = { minLength: 14, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 };
        if (!validator.isStrongPassword(req.body.password, options)) {
          throw new Error('Le mot de passe doit comporter au moins 12 caractères et au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial');
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        const user = new User(req.body);
        const userCreated = await user.create();
        res.json({response : userCreated});
      } catch (error) {
        console.error(error);
      }
  }
};
export default userController;