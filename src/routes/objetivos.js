const express = require('express');
const router = express.Router()
const pool = require('../database')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn,(req, res) => {
    res.render('../views/objetivos/add');
})
router.post('/add', async(req, res) => {
    const {objetivo,asociado,umbral,base,periodo_base,fuente,formula,frecuencia,responsable,estrategia} = req.body;
    const newObjetivo = {
        objetivo,
        asociado,
        umbral,
        base,
        periodo_base,
        fuente,
        formula,
        frecuencia,
        responsable,
        estrategia,
        id_proceso: req.user.idproceso
    };
    await pool.query('INSERT INTO objetivos set ?', [newObjetivo]);
    req.flash('success','El objetivo fue agregado exitosamente');
    res.redirect('/objetivos');
});

router.get('/', isLoggedIn,async(req, res) => {
    const objetivos = await pool.query('SELECT * FROM objetivos WHERE id_proceso = ?', [req.user.idproceso]);
        res.render('objetivos/list', ({objetivos}));    
});

router.get('/delete/:id', isLoggedIn,async(req, res) => {
    const {id} = req.params
    const objetivos = await pool.query('DELETE FROM objetivos WHERE idobjetivos = ?', [id]);
    req.flash('success','El objetivo fue eliminado exitosamente');
    res.redirect('/objetivos');
})

router.get('/edit/:id', isLoggedIn,async(req, res) => {
    const {id} = req.params
    const objetivos = await pool.query('SELECT * FROM objetivos where idobjetivos = ?', [id]);
    res.render('objetivos/edit', {objetivo: objetivos[0]});
})

router.post('/edit/:id', async(req, res) => {
    const {id} = req.params;
    const {objetivo,asociado,umbral,base,periodo_base,fuente,formula,frecuencia,responsable,estrategia} = req.body;
    const newObjetivo = {
        objetivo,
        asociado,
        umbral,
        base,
        periodo_base,
        fuente,
        formula,
        frecuencia,
        responsable,
        estrategia,
        id_proceso: req.user.idproceso
    };
    await pool.query('UPDATE objetivos set ? where idobjetivos = ?', [newObjetivo, id]);
    req.flash('success','El objetivo fue actualizado exitosamente');
    res.redirect('/objetivos');
});

router.get('/gestion/:id', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const objetivos = await pool.query('SELECT * FROM objetivos WHERE idobjetivos = ?',[id]);
    const resultados = await pool.query('SELECT * FROM gestionobj WHERE id_objetivo = ?',[id]);
    const lastElement = resultados.length - 1;
    let fecha_medicion = null;
    if(resultados[lastElement]?.medicion_fecha != undefined){
        fecha_medicion = resultados[lastElement].medicion_fecha;
        const fechaOpt = { year: 'numeric', month: 'long' };
        fecha_medicion = fecha_medicion.toLocaleDateString('ES-ar', fechaOpt);
    };
    res.render('objetivos/gestion',{objetivo: objetivos[0], resultado: resultados[lastElement], fecha_medicion})
});

router.post('/gestion/:id', async(req,res) => {
    const {id} = req.params;
    const {resultado, cumplimiento, observaciones} = req.body;
    const newResultado = {
        resultado,
        cumplimiento,
        observaciones,
        id_objetivo: id,
    }
    pool.query('INSERT INTO gestionobj SET ?',[newResultado]);
    res.redirect('/objetivos/gestion/'+id);
});

router.get('/datosObjetivos/:id', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    console.log(id)
    const objetivos = await pool.query('SELECT * FROM objetivos INNER JOIN gestionobj WHERE idobjetivos = id_objetivo AND id_proceso = ?',[id])
    const array = Array.from(objetivos);
    array.forEach(objetivo =>{
        objetivo.medicion_fecha = objetivo.medicion_fecha.toLocaleDateString();
    });
    console.log(array)
    res.json(array)
});

module.exports = router;