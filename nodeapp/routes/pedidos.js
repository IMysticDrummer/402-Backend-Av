var express = require('express');
var router = express.Router();

router.get('/lista', (req, res,next)=> {
  res.send('lista de pedidos');
})
router.get('/crea', ()=> {})
router.get('/elimina', ()=> {})
router.get('/envia', ()=> {})
router.get('/sa', ()=> {})

module.exports = router;