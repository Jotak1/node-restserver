const { response, request } = require('express');
const bcryptjs = require("bcryptjs");

const Usuario = require('../models/usuario');



const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, correo, google, ...resto } =  req.body;

    if ( password ) {
        // encriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPost = async (req, res = response) => {

    

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol});
    
    
    // encriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // guardar en bd
    await usuario.save();
    
    res.json({
        usuario
    })
}
const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    })
}
const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
}




module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    usuariosPost
}