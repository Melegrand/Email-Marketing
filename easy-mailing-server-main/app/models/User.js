import bcrypt from 'bcrypt';
import client from '../database.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';
class User {
  #email;
  #password;
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
  }

  get email() {
    return this.#email
  }

  get password() {
    return this.#password
  }

  set email(email) {
    if (!validator.isEmail(email) || validator.isEmpty(email)) {
      throw new Error('erreur email');
    } else {
      this.#email = email;
    }
  }

  set password(password) {
    if(validator.isEmpty(password)) {
      throw new Error('Mot de passe vide');
    } else {
      this.#password = password;
    }
  }
  async login() {
    try {
      const request = 'SELECT * FROM "user" WHERE "email" = $1';
      const email = [this.email];
      const userRequest = await client.query(request, email);
      if (userRequest.rowCount > 0) {
        const user = userRequest.rows[0];
        const result = await bcrypt.compare(this.password, user.password);
        console.log(result)
        if (result) {
          const token = jwt.sign(
            { 
              userId: user.id 
            }, 
            process.env.SECRET_TOKEN, 
            {
              algorithm: 'HS256', 
              expiresIn: '24h'
            }
          );
          return {'token': token, 'userId': user.id}
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
export default User;