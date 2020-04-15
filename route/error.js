var express = require('express');
var router = express.Router();

//error handler
router.use(function(error, req, res, next) {
    res.status(401);
  res.render('401', {title:'No Access', error: error});
  });

module.exports = router;