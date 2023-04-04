const express = require('express');
const router = express.Router()
const pool = require('../database')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const matrizRiesgo = require('../lib/matriz_riesgo');

router.get('/add', isLoggedIn,(req, res) => {
    res.render('riesgos/add');
})
router.post('/add', async(req, res) => {
    const {riesgo, causa, fecha_deteccion, parte_afectada, probabilidad_ini, impacto_ini, frecuencia,ultimo_control,proximo_control,probabilidad_final,impacto_final,resultado,observaciones} = req.body;
    const newRiesgo = {
        riesgo,
        causa,
        fecha_deteccion,
        parte_afectada,
        probabilidad_ini,
        impacto_ini,
        valor_riesgo: matrizRiesgo(probabilidad_ini, impacto_ini),
        id_proceso: req.user.idproceso,
        frecuencia,
        ultimo_control,
        proximo_control,
        probabilidad_final,
        impacto_final,
        valor_riesgo_final: matrizRiesgo(probabilidad_final, impacto_final),
        resultado,
        observaciones,
    };
    await pool.query('INSERT INTO riesgos set ?', [newRiesgo]);
        const addedRiesgo = await pool.query('SELECT idriesgos FROM riesgos WHERE riesgo = ? AND causa = ? AND id_proceso = ?',[newRiesgo.riesgo, newRiesgo.causa, newRiesgo.id_proceso]);
        const { idriesgos } = addedRiesgo[0];
    const {accion} = req.body;
    if(Array.isArray(accion)){   
        accion.forEach(async accion => {
            const newAccion = {
                accion,
                id_proceso: req.user.idproceso,
                id_riesgo: idriesgos
                }
            await pool.query('INSERT INTO preventivas set ?', [newAccion]);
        });
    }else{
        const newAccion = {
            accion,
            id_proceso: req.user.idproceso,
            id_riesgo: idriesgos
            }
        await pool.query('INSERT INTO preventivas set ?', [newAccion]);
    }
    req.flash('success','El riesgo fue agregado exitosamente');
    res.redirect('/riesgos');
});

router.get('/', isLoggedIn,async(req, res) => {
    const riesgos = await pool.query('SELECT * FROM riesgos WHERE riesgos.id_proceso = ?', [req.user.idproceso]);
    riesgos.forEach(async riesgo => {
        const acciones = await pool.query('SELECT accion FROM preventivas WHERE id_riesgo = ?', [riesgo.idriesgos]);
        riesgo.acciones = acciones;
    })
    res.render('riesgos/list', ({riesgos}));    
});

router.get('/delete/:id', isLoggedIn,async(req, res) => {
    const {id} = req.params
    const riesgos = await pool.query('DELETE FROM riesgos WHERE idriesgos = ?', [id]);
    req.flash('success','El registro del riesgo fue eliminado exitosamente');
    res.redirect('/riesgos');
})

router.get('/edit/:id', isLoggedIn,async(req, res) => {
    const {id} = req.params
    const riesgos = await pool.query('select * from riesgos inner join preventivas on riesgos.idriesgos = preventivas.id_riesgo where riesgos.idriesgos = ?',[id])
    riesgos[0].accion = await pool.query('select accion, idpreventivas from riesgos inner join preventivas on riesgos.idriesgos = preventivas.id_riesgo where riesgos.idriesgos = ?',[id])
    riesgos[0].fecha_deteccion= riesgos[0].fecha_deteccion.toLocaleDateString('fr-CA');
    riesgos[0].ultimo_control= riesgos[0].ultimo_control.toLocaleDateString('fr-CA');
    riesgos[0].proximo_control= riesgos[0].proximo_control.toLocaleDateString('fr-CA');
    res.render('riesgos/edit', {riesgo: riesgos[0]});
})

router.post('/edit/:id', async(req, res) => {
    const {id} = req.params;
    const {riesgo, causa, fecha_deteccion, parte_afectada, probabilidad_ini, impacto_ini, accion, frecuencia, ultimo_control, proximo_control, probabilidad_final, impacto_final, resultado, observaciones} = req.body;
    const oldAcciones = await pool.query('SELECT * FROM preventivas WHERE id_riesgo = ?',[id]);
    const newRiesgo = {
        riesgo,
        causa,
        fecha_deteccion,
        parte_afectada,
        probabilidad_ini,
        impacto_ini,
        valor_riesgo: matrizRiesgo(probabilidad_ini, impacto_ini),
        frecuencia,
        ultimo_control,
        proximo_control,
        probabilidad_final,
        impacto_final,
        valor_riesgo_final: matrizRiesgo(probabilidad_final, impacto_final),
        resultado,
        observaciones,
    };
    await pool.query('UPDATE riesgos SET ? WHERE id_proceso = ?', [newRiesgo,req.user.idproceso]);
    console.log(accion)
    if(!Array.isArray(accion)){
        console.log('if')
         const newAccion = {
             accion,
             id_proceso: req.user.idproceso,
             id_riesgo: id,
             }
        if(accion != ''){
         await pool.query('UPDATE preventivas SET ? WHERE idpreventivas = ?', [newAccion, oldAcciones[0].idpreventivas]);
        if(oldAcciones.length > accion.length)
         for(i=1; i< oldAcciones.length; i++){
            await pool.query('DELETE from preventivas WHERE idpreventivas = ?',[oldAcciones[i].idpreventivas])
            console.log(oldAcciones[i].idpreventivas)
         };
        }
    }else{
        if(oldAcciones.length>=accion.length){
        for(i=0; i< accion.length; i++){
            if(accion[i] != ''){
                console.log('else for 1')
                const newAccion = {
                    accion: accion[i],
                    id_proceso: req.user.idproceso,
                    id_riesgo: id,
                    }
                console.log(newAccion)
                await pool.query('UPDATE preventivas set ? WHERE idpreventivas = ?',[newAccion,oldAcciones[i].idpreventivas])
            }
        }
        for(i=accion.length; i< oldAcciones.length; i++){
            await pool.query('DELETE from preventivas WHERE idpreventivas = ?',[oldAcciones[i].idpreventivas])
            console.log(oldAcciones[i].idpreventivas)}
         };
        if(accion.length>oldAcciones.length){
            for(i= oldAcciones.length; i< accion.length; i++){
                if(accion[i] != ''){
                    console.log('else for 2')
                    console.log(accion[i])
                    const newAccion = {
                        accion: accion[i],
                        id_proceso: req.user.idproceso,
                        id_riesgo: id,
                    }
                    console.log(newAccion)
                    await pool.query('INSERT INTO preventivas SET ?',[newAccion])
                }
            }
        }
    }
        req.flash('success','El riesgo fue actualizado exitosamente');
        res.redirect('/riesgos');
});

router.get('/gestion/:id', isLoggedIn,async(req, res) => {
    const {id} = req.params
    const riesgos = await pool.query('SELECT * FROM riesgos where idriesgos = ?', [id]);
    riesgos[0].fecha_deteccion = riesgos[0].fecha_deteccion.toLocaleDateString('es-AR');
    riesgos[0].ultimo_control = riesgos[0].ultimo_control.toLocaleDateString('es-AR');
    riesgos[0].proximo_control = riesgos[0].proximo_control.toLocaleDateString('es-AR');
    const qacciones = await pool.query('SELECT * FROM preventivas where id_riesgo = ?', [id]);
    
    res.render('riesgos/gestion', {riesgo: riesgos[0], acciones: qacciones, gestion: qacciones[0]});
})

module.exports = router;