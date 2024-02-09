import jwt from 'jsonwebtoken';
    

const account = {
    saveToken: (token) => {
        localStorage.setItem('token', token);
    },
    saveId: (id) => {
        localStorage.setItem('id', id);
    },
    saveEmail: (email) => {
        localStorage.setItem('email', email);
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
    },

    // Renvoie un bouleen pour savoir si l'utilisateur est connecté
    isLogged: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Renvoie le token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Renvoie les options pour le fetch avec la methode "post" et l'autorisation
    fetchOptionsPost: (data) => {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${account.getToken()}`
            },
            body: JSON.stringify(data)
        }
    },
    fetchOptionsGet: () => {
        return {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${account.getToken()}`
            }
        }
    }
}

export default account;