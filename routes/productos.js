const { Router } = require('express');
const { check } = require('express-validator');

const { 
    crearProducto,
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto,
    borrarProducto } = require('../controllers/productos');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');


const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');


const router = Router();


/**
 * {{url}}/api/productos
 */

//  Obtener todas las productos - publico
router.get('/', obtenerProductos);


// Obtener una Producto por id - publico
router.get('/:id',[
    check('id', 'No es un id de MongoDB valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto);

// Crear Producto - privado - cualquier persona con un token válido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
    ], crearProducto );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    // check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto );

// Borrar una Producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'No es un id de MongoDB valido').isMongoId(),    
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto );


module.exports = router;