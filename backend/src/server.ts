import express, {Request, Response} from 'express'
import { Sequelize } from 'sequelize'

const Produto = require('../models').Produto

const sequelize = new Sequelize('postgres://postgres:abcd1234@localhost:5432/mydb')

sequelize.authenticate().then(() => {
    console.log('Db connection OK!')
}).catch(e => {
    console.log('Db connection Error: ', e)
})

const app = express()
app.use(express.json())

app.get('/produtos', async (req: Request, res: Response) => {
    console.log('GET')
    const produtos = await Produto.findAll({
        order: [['nome', 'ASC']]
    })
    res.json({produtos})
})

app.post('/produtos', async (req: Request, res: Response) => {
    console.log('POST')
    const produto = req.body
    console.log(produto)
    if (produto && produto.nome) {
        console.log('CREATE')
        const p = await Produto.create({nome: produto.nome, quantidade: produto.quantidade ?? 0})
        res.json({id: p.id})
    } else {
        console.log('CREATE ERROR')
        res.status(400).json({mensagem: 'Produto inválido'})
    }
})

app.put('/produtos', async (req: Request, res: Response) => {
    console.log('PUT')
    const produto = req.body
    try {
        await Produto.update({quantidade: produto.quantidade}, {
            where: {
                id: produto.id
            }
        })
        res.json({produto})
    } catch (e) {
        res.status(500).json({mensagem: 'Erro atualizando produto.'})
    }
})

app.delete('/produtos', async (req: Request, res: Response) => {
    const produto = req.body
    await Produto.destroy({
        where: {
            id: produto.id
        }
    })
})

app.listen(3333, () => {
    console.log('Server running')
})