const { autenticaUsuarioDB } = require('../usecases/segurancaUseCases');
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const login = async (request, response) => {
    await autenticaUsuarioDB(request.body)
          .then(usuario => {
            const token = jwt.sign({usuario},process.env.SECRET,{
                expiresIn : 300 // expira em 5 minutos                
            });
            return response.json({ auth : true, token : token});
          })
          .catch(err => response.status(401).json({auth : false, message : err}));
}

function verificaJWT(request, response, next){
    const token = request.headers['authorization'];
    if (!token) return response.status(401).json({auth : false, 
    message : "Nenhum token recebido"});
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if (err) return response.status(401).json({auth : false, 
        message : "Erro ao decodificar o token"});
        // exibindo no console o usuario extraido do token
        console.log("TOken decodificado: " + JSON.stringify(decoded.usuario));
        // inserindo o usuário no request para o proximo metodo a ser chamado poder usar
        request.usuario = decoded.usuario;
        next();
    })    
}

module.exports = { login, verificaJWT };
