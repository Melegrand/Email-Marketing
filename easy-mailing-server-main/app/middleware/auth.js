import jwt from 'jsonwebtoken';

const  authToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Accès non autorisé.' });
        }
        jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Accès non autorisé.' });
            }
            next();
        });
    } catch (error) {
        
    }
}
export default authToken;