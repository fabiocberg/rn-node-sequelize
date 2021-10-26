import express, {Request, Response} from 'express'
import { Sequelize } from 'sequelize'

const Produto = require('../models').Produto
const Loja = require('../models').Loja

const sequelize = new Sequelize('postgres://postgres:abcd1234@localhost:5432/mydb')

sequelize.authenticate().then(() => {
    console.log('Db connection OK!')
}).catch(e => {
    console.log('Db connection Error: ', e)
})

const app = express()
app.use(express.json())

app.get('/lojas', async (req: Request, res: Response) => {
    const lojas = await Loja.findAll({
        order: [['nome', 'ASC']]
    })
    res.json({lojas})
})

app.get('/produtos', async (req: Request, res: Response) => {
    const produtos = await Produto.findAll({
        order: [['nome', 'ASC']],
        include: [{
            model: Loja,
            attributes: ['nome']
        }]
    })
    res.json({produtos})
})

app.post('/produtos', async (req: Request, res: Response) => {
    const produto = req.body
    if (produto && produto.nome) {
        console.log('CREATE')
        const p = await Produto.create({nome: produto.nome, quantidade: produto.quantidade ?? 0, lojaId: produto.lojaId})
        res.json({id: p.id})
    } else {
        res.status(400).json({mensagem: 'Produto inválido'})
    }
})

app.put('/produtos', async (req: Request, res: Response) => {
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

app.delete('/produtos/:id', async (req: Request, res: Response) => {
    const produtoId = req.params.id
    await Produto.destroy({
        where: {
            id: produtoId
        }
    })
    res.json({mensagem: 'Produto removido com sucesso.', id: produtoId})
})

app.listen(3333, () => {
    console.log('Server running')
})