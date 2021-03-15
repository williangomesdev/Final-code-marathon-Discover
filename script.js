const Modal = {
    open() {
        //Abrir modal
        //Adicionar a class active ao modal
        document.querySelector('.modal-overlay')
            .classList.add('active')
    },
    close() {
        //fechar o Modal
        //remover a class active do Modal
        document.querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

//Armazenar alteraçoes da table na pagina do usuario
const Storage = {
    get() {
        //Transformae de volta string para array
        //JSON.parse
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        //enviar os arrays para o local Storage
        //precisa converter o array para string
        //JSON.stringfy
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}
//objeto transactions, pega as informações do HTML para o javascript
//array transactions        
const Transactions = {
    //atalho para transactions
    //Refatoração = após a programação estiver funcionanado fazemos melhorias para deixar mais claro, ou expandir o crescimento da sua programação
    all: Storage.get(),
    /*[{

                description: 'Luz',
                amount: -50000,
                date: '23/01/2021',
            },
            {

                description: 'Website',
                amount: 500000,
                date: '23/01/2021',
            },
            {

                description: 'Internet',
                amount: -20000,
                date: '23/01/2021',
            },
            {

                description: 'App',
                amount: 200000,
                date: '23/01/2021',
            }

        ],*/
    //Adicionar todas as transações futuras aqui
    //push = usada em arrays, vai adicionar algo de transaction e enviar par all:transaction
    add(transaction) {
        Transactions.all.push(transaction)

        //Fazer relitura da aplicação
        App.reload()
    },
    //Remover alterações do painel
    //splice = espelha o id(numero no array)

    remove(index) {
        Transactions.all.splice(index, 1)
        App.reload()
    },
    //Somar entradas
    incomes() {
        let income = 0;
        //pegar as transações

        //para cada transação
        Transactions.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                //somar a varivel e retornar a varivel
                //income = income + transaction.amount;
                income += transaction.amount;
            }
        })
        return income;
    },
    //Somar as saidas
    expensives() {

        let expensive = 0;
        //pegar as transações

        //para cada transação
        Transactions.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                //somar a varivel e retornar a varivel
                //income = income + transaction.amount;
                expensive += transaction.amount;
            }
        })
        return expensive;
    },
    total() {
        //entradas - saidas
        return Transactions.incomes() + Transactions.expensives();
    }
}

//Substituir os dados do HTML com os dados do javascript

const DOM = {
    //Buscar no HTML a classe .data-table/tbody
    transactionsContainer: document.querySelector('.data-table tbody'),
    //Adiciona dados pegos da transactions//
    //index = posição do arrya que esta guardado no objeto
    addTransaction(transaction, index) {
        //console.log(transaction)//Verificar no console que conseguimos estar aqui no codigo//
        //Criar elemento na DOM
        const tr = document.createElement('tr')
        //receber HTML, que está na função innerHTMLTransaction
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        //Adiciona na classe transactionsContainer o elemento driado na DOM

        //Usar o index para a remoção na tabela
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)

        //console.log(tr.innerHTML)
    },
    //modelo para pega as informações do HTML, para serem substituidas
    innerHTMLTransaction(transaction, index) {
        //Fazer a troca da classe expensive e amout de acordo com o Valor
        const CSSClass = transaction.amount > 0 ? "income" : "expensive"

        //Entregar a informação para a Utils
        const amount = Utils.formatCurrency(transaction.amount)


        const html = `
                                    <td class="description">${transaction.description}</td>
                                    <td class="${CSSClass}">${amount}</td>
                                    <td class="date">${transaction.date}</td>
                                    <td>
                                        <img onclick="Transactions.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
                                    </td>
                                   `
        return html //return serve para usarmos as propiedades da função em uma função de fora

    },

    //Atualizar os itens do Balance
    updateBalance() {
        //Pegar os elementos do HTML
        document.querySelector('#incomeDisplay')
            //Alterar valor do elemento, recebendo de Transactions
            .innerHTML = Utils.formatCurrency(Transactions.incomes())
        //Pegar os elementos do HTML
        document.querySelector('#expensiveDisplay')
            //Alterar valor do elemento, recebendo de Transactions
            .innerHTML = Utils.formatCurrency(Transactions.expensives())
        document.querySelector('#totalDisplay')
            //Alterar valor do elemento, recebendo de Transactions
            .innerHTML = Utils.formatCurrency(Transactions.total())

    },

    //Limpar as releituras repetidas do reload
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }

}

//pegar a informação do amount e converter para moeda
//Utils vai pegar algumas informações no HTML
const Utils = {
    //Funcionalidade formatAmount = formatar
    formatAmount(value) {
        //transformar em numero multiplicar por 100
        value = value * 100
        //arredonda o numero
        return Math.round(value)
    },

    //Formatar Data
    formatDate(date) {
        //converter data para modo BR
        //split = separar por o item dentro do parenteses
        const splitterDate = date.split("-")
        //retornar com a maneira que eu quero que a data seje escrita
        return `${splitterDate[2]}/${splitterDate[1]}/${splitterDate[0]}}`
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        //Variação de valor de numero para String
        //replace, mudar item
        //expressão regular
        // /0/g = troca todos os 0 por alguma coisa
        // \ = Escape
        // \D = Todos os itens que não são numeros
        value = String(value).replace(/\D/g, "")

        //Dividir o valor por 100 para eliminar 0 após virgula
        value = Number(value) / 100
        //Transformar numero em moeda  
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        // console.log(signal + value)
        //Mandar para fora o Valor
        return signal + value
    }

}
//DOM.addTransaction(transactions[0]) pega os dados do array transaction indice 0 

//Apos receber uma nova transação temos que refazer toda a releitura
// init = inicia a leitura
//reload = refaz a leitura
//Const App = Popular aplicação
const Form = {
    //pegar todos os campos no html para ser usado no validateFields
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //pegar somente os valores e guardar aqui
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }

    },
    //Verificar se todas as informações foram preeenchidas
    validateFields() {
        //tirar valores de getValues e colocar em uma variavel
        //const description = Form.getValues().description
        //const amount = Form.getValues().amount
        //const date = Form.getValues().date
        //Outra maneira de tirar esses valores(Desestruturar)
        const {
            description,
            amount,
            date
        } = Form.getValues()
        //Se algum dos campos estiverem vazios
        //trim verficar os espaçoes vazios saõ iguais a vazios
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            //Fazendo um novo erro
            throw new Error("Por favor preeencha todos os campos")
        }

    },
    // formatar os dados para salvar
    formatValues() {
        //pegar valores validateFields
        //let permite variações
        let {
            description,
            amount,
            date
        } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        //retornar os valores
        //Quando as variaveis tem o mesmo nome usamos shortcut colocamos o nome da varivel uma vez somante
        return {
            description,
            amount,
            date
        }
    },


    //Testar sempre depois da função
    //console.log(date)

    //apagar os dados do formulario
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },



    submit(event) {
        //não envia as informações padrao do evento
        event.preventDefault()


        //Tentar todos esses passos se algum cometer erro cate o Error
        try {

            //Verificar se todas as informações foram preeenchidas
            Form.validateFields()
            // formatar os dados para salvar
            const transaction = Form.formatValues()
            // Salvar
            // Salvar
            Transactions.add(transaction)
            //apagar os dados do formulario
            Form.clearFields()
            //Fechar modal
            Modal.close()


        } catch (error) {
            alert(error.message)
        }
    },
}




const App = {
    init() {

        //Para cada acontecimento execute a função, automatiza as execuções de todos os indices dos arrays(transaction)
        Transactions.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        //Chamar a função updateBalance
        DOM.updateBalance()

        //Setar as transactions
        Storage.set(Transactions.all)

    },
    reload() {
        //Fazer a limpeza
        DOM.clearTransactions()

        //Popula novamente
        App.init()
    },
}
App.init()