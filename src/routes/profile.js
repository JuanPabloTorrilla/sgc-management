const express = require('express');
const router = express.Router()
const pool = require('../database')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn,async(req, res) => {
    // RESUMEN RIESGOS
    const id_proceso = req.user.idproceso;
    const cantidad_r = await pool.query('select count(*) as cantidad from riesgos where id_proceso = ?', [id_proceso]);
    const controlados_r = await pool.query('select count(*) as resultado from riesgos where id_proceso = ? and resultado = "Riesgo controlado"', [id_proceso]);
    const noControlados_r = await pool.query('select count(*) as resultado from riesgos where id_proceso = ? and resultado = "Riesgo no controlado"', [id_proceso]);
    const pendientes_r = await pool.query('select count(*) as resultado from riesgos where id_proceso = ? and resultado = "Pendiente"', [id_proceso]);
    const enProceso_r = await pool.query('select count(*) as resultado from riesgos where id_proceso = ? and resultado = "En proceso"', [id_proceso]);
    const eliminados_r = await pool.query('select count(*) as resultado from riesgos where id_proceso = ? and resultado = "Riesgo eliminado"', [id_proceso]);
    const riesgos = {
        cantidad: cantidad_r[0].cantidad,
        controlados: controlados_r[0].resultado,
        noControlados: noControlados_r[0].resultado,
        pendientes: pendientes_r[0].resultado,
        enProceso: enProceso_r[0].resultado,
        eliminados: eliminados_r[0].resultado
    }

    //RESUMEN OBJETIVOS
    const objetivos = await pool.query('SELECT * FROM objetivos WHERE id_proceso = ?', [id_proceso]);
    

    //RESUMEN NO CONFORMIDADES
    const cantidad_nc = await pool.query('select count(*) as cantidad from no_conforme where id_proceso = ?', [id_proceso]);
    const eficaz_nc = await pool.query('select count(*) as resultado from no_conforme where id_proceso = ? and resultado = "Eficaz"', [id_proceso]);
    const pEficaz_nc = await pool.query('select count(*) as resultado from no_conforme where id_proceso = ? and resultado = "Parcialmente Eficaz"', [id_proceso]);
    const noEficaz_nc = await pool.query('select count(*) as resultado from no_conforme where id_proceso = ? and resultado = "No Eficaz"', [id_proceso]);
    const enProceso_nc = await pool.query('select count(*) as resultado from no_conforme where id_proceso = ? and resultado = "En proceso"', [id_proceso]);
    const noConforme = {
        cantidad: cantidad_nc[0].cantidad,
        eficaz: eficaz_nc[0].resultado,
        pEficaz: pEficaz_nc[0].resultado,
        noEficaz: noEficaz_nc[0].resultado,
        enProceso: enProceso_nc[0].resultado,
    }
    res.render('profile',{objetivos, riesgos, noConforme});
});

module.exports = router;