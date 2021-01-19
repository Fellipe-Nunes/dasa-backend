const express = require('express')
const Employee = require('../../models/employee')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const { request } = require('express')


// @route    POST /admin (funcionando)
// @desc     CREATE employee
// @access   Public

router.post('/',[
  check('nome', 'Por favor, insira o nome do funcionario.').not().isEmpty(),
  check('sobrenome', 'Por favor, insira o sobrenome do funcionario.').not().isEmpty(),
  check('email', 'O e-mail não é válido.').isEmail(),
  check('password', 'Por favor, insira uma senha de 6 ou mais caracteres.').isLength({ min: 6 })  

], async (req, res, next) => {
  try{
    let { nome, sobrenome, email, password, is_active, is_admin } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }else{
      let employee = new Employee({nome, sobrenome, email, password, is_active, is_admin})

      const salt = await bcrypt.genSalt(10)
      employee.password = await bcrypt.hash(password, salt)
      
      await employee.save()      
      if (employee.id){
        res.json(employee);
      }
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    GET /admin (funcionando)
// @desc     LIST employee
// @access   Private 

router.get('/', auth, async(req, res, next)=> {
  try{
    const employee = await Employee.find({})
    res.json(employee)
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    GET /admin/:email (funcionando)
// @desc     DETAIL employee
// @access   Public

router.get('/:email', auth, [], async(req, res, next)=> {
  try{
    let param_email = req.params["email"]
    const employee = await Employee.findOne({email : param_email})
    if(employee){
      res.json(employee)
    }else{
      res.status(404).send({"error" : "Funcionario não encontrado"})
    }
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    PATCH /admin/:email (funcionando)
// @desc     PARTIAL EDIT employee
// @access   Public

router.patch('/:email', [], async(req, res, next) => {
  try{
    const errors = validationResult(request)
    if (!errors.isEmpty()){
      res.status(400).send({ errors: errors.array() })
      return
    }
    let param_email = req.params["email"]
    const salt = await bcrypt.genSalt(10)

    let body_request = req.body

    if (body_request.password) {
      body_request.password = await bcrypt.hash(body_request.password, salt)
    }
    let update = {$set: body_request}    
    let employee = await Employee.findOneAndUpdate({email : param_email}, update, {new: true})
    if(employee){
      res.status(202).send({"success": "Funcionario editado com sucesso"})
    }else{
      res.status(404).send({"error" : "Funcionario não encontrado"})
    }
    
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})


// @route    DELETE /admin/:userId
// @desc     DELETE employee
// @access   Public

router.delete('/:email', async(req, res, next) => {
  try {
    let param_email = req.params["email"]
    const employee = await Employee.findOneAndDelete({email: param_email})
    if (employee) {
      res.status(202).send({"success": "Funcionario deletado com sucesso"})
    } else {
      res.status(404).send({"error": "Funcionario não encontrado"})
    }  
  } catch (err) {
    console.log(err.message)
    res.status(500).send({"error": "Server error"})
  }
})



module.exports = router;