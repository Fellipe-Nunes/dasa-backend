const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')

    if(!token){
        return res.status(401).json({ msg: 'O token não é válido, acesso não permitido'})
    }

    try {
        jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: 'O token não é válido'})
            }
            req.user = decoded.user
            if (req.baseUrl == '/profile' && decoded.user.is_admin == false){
                return res.status(403).json({ msg: 'O usuário não é admin'})
            }
            next()
        })
        
    } catch (err) {
        console.error('Problema no middleware')
        res.status(500).json({ msg: 'Server error'})
        
    }
}