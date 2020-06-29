const express = require('express');
const Usuarios = require('../models/usuario');
const { verificarToken, verificarAdmin_role } = require('../middleware/autenticacion');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', verificarToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);

    Usuarios.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Usuarios.countDocuments({ estado: true }, (err, count) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: count
                });


            });

        });


});


app.post('/usuario', [verificarToken, verificarAdmin_role], function(req, res) {

    let body = req.body;

    let usuario = new Usuarios({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuarioDB
        });

        // let nombre = body.nombre
        // let edad = body.edad
        // let email = body.email
        // let role = body.role

        // res.json({
        //     nombre,
        //     edad,
        //     email,
        //     role
        // })

    });


});

app.put('/usuario/:id', [verificarToken, verificarAdmin_role], function(req, res) {


    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', ]);

    Usuarios.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };


        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.delete('/usuario/:id', [verificarToken, verificarAdmin_role], function(req, res) {

    let id = req.params.id

    let body = { estado: false };

    Usuarios.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };


        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


    // Usuarios.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     7

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'usuario no existe'
    //             }
    //         });
    //     };


    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });


    // });



});

module.exports = app;