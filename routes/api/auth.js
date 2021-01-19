const express = require('express')
const router = express.Router()
const Employee = require('../../models/employee')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')



// @route    POST /auth
// @desc     Authenticate user & get token
// @access   Public

router.post('/', [
    check('email', 'Por favor, insira um e-mail válido').isEmail(),
    check('password', 'Por favor, insira a senha').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
        let funcionario = await Employee.findOne({ email }).select('id password email is_active is_admin nome')
        if (!funcionario) {
            return res.status(404).json({ errors: [{ msg: 'O funcionário não existe' }] })
        } else {
            const isMatch = await bcrypt.compare(password, funcionario.password)
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Senha incorreta' }] })
            } else {
                if (funcionario.is_active == false) {
                    return res.status(403).json({ errors: [{ msg: 'Funcionário inativo' }] })
                }
                const payload = {
                    user: {
                        id: funcionario.id,
                        is_active: funcionario.is_active,
                        is_admin: funcionario.is_admin,
                        nome: funcionario.nome
                        
                    }
                }

                jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '5 days' },
                    (err, token) => {
                        if (err) throw err;
                        res.json({ token })
                    }
                )

            }
        }

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')

    }
})

module.exports = router