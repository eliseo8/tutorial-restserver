//===========================
// Verificar tokens
//===========================

const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        };

        req.usuario = decoded.usuario;
        next();
    });

};


let verificarAdmin_role = (req, res, next) => {

    let role = req.usuario.role

    if (role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    };

};

module.exports = {
    verificarToken,
    verificarAdmin_role
}