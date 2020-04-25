var express = require('express');
var router = express.Router();
var Kehadiran= require('../models/kehadiran');
var mid  = require('../middleware/requiresLogin.js');

router.get("/user/:id", async (req, res) => {
    try {
      const user = await Kehadiran.findById(req.params.id);
      let hours = 0;
      if(user.kehadiran.length > 0 )
      {
        user.kehadiran.reverse();
        user.kehadiran.map(a =>{
          if(a.entry && a.exit.time){
            hours = hours + calculateHours(a.entry.getTime(),a.exit.time.getTime());
          }
         
        })
        hours = parseFloat(hours /(3600*1000)).toFixed(4); 
      }
      
      res.render("user", { user,hours});
    } catch (error) {
      console.log(error);
      req.flash('error','Cannot find user');
      res.redirect('back')
    }
  });