const express = require("express");
const expsHandle = require("express-handlebars");
const bodyParser = require("body-parser");
const agendamento = require("./agendamentos");

const app = express();
app.engine('hbs', expsHandle.engine({ extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("cadastrar")
});

app.post("/cadastrar", (req, res) => {
    agendamento.create({
        nome: req.body.nome,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado:req.body.estado
    }).then(() => {
        res.redirect("/consultar");
    }).catch((erro) => {
        res.send("Falha ao cadastrar: " + erro);
    });
});

app.get("/consultar", (req, res) => {
    agendamento.findAll()
        .then((agendamentos) => {
            res.render("consultar",
                {
                    agendamentos
                }
            );
        })
        .catch((error) => {
            res.render("Ocorreu um erro " + error);
        })
});

app.get("/editar/:id", (req, res) => {
    agendamento.findAll({ where: { 'id': req.params.id } }).then((result) => {
        res.render("editar", { agendamento: result })
    }).catch((error) => {
        console.log(error);
    })
})
app.post("/editar", (req, res) => {
    agendamento.update({
        nome: req.body.nome,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado:req.body.estado
    }, {
        where:
            { 'id': req.body.id }
    }).then((result) => {
        res.redirect("/consultar");
    }).catch((error) => {
        console.log(error);
    })
})

app.get("/excluir/:id", (req, res) => {
    agendamento.destroy({ where: { 'id': req.params.id } }).then(() => {
        res.redirect("/consultar");
    }).catch((error) => {
        console.log(error);
    })
})


app.listen(8081, () => {
    console.log("Server running at port 8081");
})