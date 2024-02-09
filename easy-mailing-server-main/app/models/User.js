import bcrypt from 'bcrypt';
import client from '../database.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';
class User {
  #email;
  #password;
  #lastname;
  #firstname;

  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.lastname = data.lastname;
    this.firstname = data.firstname;
  }

  get email() {
    return this.#email
  }

  get password() {
    return this.#password
  }

  get lastname() {
    return this.#lastname
  }

  get firstname() {
    return this.#firstname
  }

  set lastname(lastname) {
    if (!validator.isLength(lastname, { min: 2, max: 80 }) || validator.isEmpty(lastname) || !typeof(lastname) === 'string') {
      throw new Error('erreur lastname');
    } else {
      this.#lastname = lastname;
    }
  }

  set firstname(firstname) {
    if (!validator.isLength(firstname, { min: 2, max: 80 }) || validator.isEmpty(firstname) || !typeof(firstname) === 'string') {
      throw new Error('erreur firstname');
    } else {
      this.#firstname = firstname;
    }
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
  
  async create() {
    const request = 'SELECT * FROM "user" WHERE "email" = $1';
    const email = await client.query(request, [this.email]);

    if (email.rowCount > 0) {
      return 'exist';
    } else {
      const saltRounds = 10;
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.hash = hash;
      const text = `
        INSERT INTO "user" ("email", "password", "firstname", "lastname")
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `; 
      const values = [this.email, this.password, this.firstname, this.lastname];
      const result = await client.query(text, values);
      return result.rowCount > 0 ? 'success': 'error';
    }
  }

  async update() {
    const text = `
      UPDATE "user" 
      SET 
        "email" = $1,
        "hash" = $2
        "pseudo" = $3
      WHERE id = $4;
    `;
    const values = [this.email, this.hash, this.pseudo, this.id];
    client.query(text, values);
  }
}
export default User;