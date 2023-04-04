const express = require('express');
const router = express.Router()
const pool = require('../database')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const matrizRiesgo = require('../lib/matriz_riesgo');

router.get('/add', isLoggedIn,(req, res) => {
    res.render('no_conforme/add');
})
router.post('/add', async(req, res) => {
    const {hallazgo, causa, fuente, riesgo_asociado, correccion, accion_correctiva, fecha_ap_planeada, fecha_ver_planeada, fecha_ap_real, fecha_ver_real,evaluacion,resultado,observaciones} = req.body;
    const newHallazgo = {
        hallazgo,
        causa,
        fuente,
        riesgo_asociado,
        correccion,
        accion_correctiva,
        fecha_ap_planeada,
        id_proceso: req.user.idproceso,
        fecha_ver_planeada,
        fecha_ap_real,
        fecha_ver_real,
        evaluacion,
        resultado,
        observaciones,
    };
    if(fecha_ap_real === ""){console.log("se cumple ");newHallazgo.fecha_ap_real = null};
    if(fecha_ver_real === ""){console.log("también se cumple");newHallazgo.fecha_ver_real = null}
    await pool.query('INSERT INTO no_conforme set ?', [newHallazgo]);
    req.flash('success','El riesgo fue agregado exitosamente');
    res.redirect('/no_conforme');
});

router.get('/', isLoggedIn,async(req, res) => {
    const hallazgos = await pool.query('SELECT * FROM no_conforme WHERE id_proceso = ?', [req.user.idproceso]);
    res.render('no_conforme/list', ({hallazgos}));    
});

router.get('/delete/:id', isLoggedIn,async(req, res) => {
    const {id} = req.params
    const hallazgo = await pool.query('DELETE FROM riesgos WHERE idhallazgo = ?', [id]);
    req.flash('success','El registro del riesgo fue eliminado exitosamente');
    res.redirect('/no_conforme');
})

router.get('/edit/:id', isLoggedIn,async(req, res) => {
    const {id} = req.params
    const hallazgo = await pool.query('select * from no_conforme where idhallazgo = ?',[id]);
    hallazgo[0].fecha_deteccion = hallazgo[0].fecha_deteccion.toLocaleDateString("fr-CA");
    hallazgo[0].fecha_ap_planeada = hallazgo[0].fecha_ap_planeada.toLocaleDateString("fr-CA");
    //hallazgo[0].fecha_ap_real = hallazgo[0].fecha_ap_real.toLocaleDateString("fr-CA");
    hallazgo[0].fecha_ver_planeada = hallazgo[0].fecha_ver_planeada.toLocaleDateString("fr-CA");
    //hallazgo[0].fecha_ver_real = hallazgo[0].fecha_ver_real.toLocaleDateString("fr-CA");
     if(hallazgo[0].fecha_ap_real != null){
         hallazgo[0].fecha_ap_real = hallazgo[0].fecha_ap_real.toLocaleDateString("fr-CA");
     }
     if(hallazgo[0].fecha_ver_real != null){
         hallazgo[0].fecha_ver_real = hallazgo[0].fecha_ver_real.toLocaleDateString("fr-CA");
     }
    res.render('no_conforme/edit', {hallazgo: hallazgo[0]});
})

router.post('/edit/:id', async(req, res) => {
    const {id} = req.params;
    const {hallazgo, causa, fuente, fecha_deteccion, riesgo_asociado, correccion, accion_correctiva, fecha_ap_planeada, fecha_ver_planeada, fecha_ap_real, fecha_ver_real,evaluacion,resultado,observaciones} = req.body;
    const newHallazgo = {
        hallazgo,
        causa,
        fuente,
        fecha_deteccion,
        riesgo_asociado: riesgo_asociado || "No hay riesgo asociado",
        correccion,
        accion_correctiva,
        fecha_ap_planeada,
        id_proceso: req.user.idproceso,
        fecha_ver_planeada,
        fecha_ap_real,
        fecha_ver_real,
        evaluacion,
        resultado,
        observaciones,
    };
    if(fecha_ap_real === ""){newHallazgo.fecha_ap_real = null};
    if(fecha_ver_real === ""){newHallazgo.fecha_ver_real = null}
    await pool.query('UPDATE no_conforme SET ? WHERE idhallazgo = ?', [newHallazgo,id]);
    req.flash('success','El riesgo fue actualizado exitosamente');
    res.redirect('/no_conforme');
});

router.get('/gestion/:id', isLoggedIn,async(req, res) => {
    const {id} = req.params
    const hallazgo = await pool.query('SELECT * FROM no_conforme where idhallazgo = ?', [id]);
    
    res.render('no_conforme/gestion', {hallazgo: hallazgo[0]});
})

module.exports = router;