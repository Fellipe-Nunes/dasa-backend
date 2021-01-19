const express = require('express');
const User = require('../../models/user');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const router = express.Router();


// @route    POST /user (funcionando)
// @desc     CREATE user
// @access   Public

router.post('/',[
  check('sexo', 'Por favor, selecione o sexo do paciente.').not().isEmpty(),
  check('nascimento', 'Por favor, insira a data de nascimento do paciente.').not().isEmpty(),
  check('nome', 'Por favor, insira o nome do paciente.').not().isEmpty(),
  check('sobrenome', 'Por favor, insira o sobrenome do paciente.').not().isEmpty(),
  check('rg', 'Por favor, insira o RG do paciente.').not().isEmpty(),
  check('email', 'O e-mail não é válido.').isEmail(),
  check('telefone', 'Por favor, insira o telefone do paciente.').not().isEmpty()   

], async (req, res, next) => {
  try{
    let { sexo, nascimento, nome, sobrenome, rg, email, telefone, is_active, is_admin } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }else{
      let paciente = new User({sexo, nascimento, nome, sobrenome, rg, email, telefone, is_active, is_admin})
      
      await paciente.save()
      const payload = {
        paciente: {
          id: paciente.id
        }
      };
      if (paciente.id){
        res.json(paciente);
      }
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    GET /user (funcionando)
// @desc     LIST user
// @access   Private

router.get('/', auth, async(req, res, next)=> {
  try{
    const paciente = await User.find({})
    res.json(paciente)
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

// @route    GET /user/:email (funcionando)
// @desc     DETAIL user
// @access   Private

router.get('/:email', auth, [], async(req, res, next)=> {
  try{
    let param_email = req.params["email"]
    const paciente = await User.findOne({email : param_email})
    if(paciente){
      res.json(paciente)
    }else{
      res.status(404).send({"error" : "Paciente não encontrado"})
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    PATCH /user/:email (funcionando)
// @desc     PARTIAL EDIT user
// @access   Public

router.patch('/:email', [], async(req, res, next) => {
  try{
    let param_email = req.params["email"]
    let body_request = req.body
    let update = {$set: body_request}
    
    let paciente = await User.findOneAndUpdate({email : param_email}, update, {new: true})
    if(paciente){
      res.status(202).send({"success": "Paciente editado com sucesso"})
    }else{
      res.status(404).send({"error" : "Paciente não encontrado"})
    }
    
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    DELETE /admin/:userId
// @desc     DELETE user
// @access   Public

router.delete('/:email', async(req, res, next) => {
  try {
    let param_email = req.params["email"]
    const paciente = await User.findOneAndDelete({email: param_email})
    if (paciente) {
      res.status(202).send({"success": "Paciente deletado com sucesso"})
    } else {
      res.status(404).send({"error": "Paciente não encontrado"})
    }  
  } catch (err) {
    console.log(err.message)
    res.status(500).send({"error": "Server error"})
  }
})

// @route PUT
// @desc Method Not Allowed
// @access Public

//router.put('/', (req, res) => res.status(405).send('Method Not Allowed'))

module.exports = router;