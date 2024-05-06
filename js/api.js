// var URL_BASE = "https://my-json-server.typicode.com/Gelvazio/sistemajavafrontend/";
var URL_BASE = "http://localhost:3000/";
var SERVIDOR_DESENVOLVIMENTO = false;

var ACAO_CONSULTAR = "ACAO_CONSULTAR";
var ACAO_INCLUIR = "ACAO_INCLUIR";
var ACAO_ALTERAR = "ACAO_ALTERAR";
var ACAO_EXCLUIR = "ACAO_EXCLUIR";

let ACAO = "ACAO_INCLUIR";

function loadUrlBase() {
    var url_atual = window.location.href;
    if (url_atual.includes("http://localhost:5500/")) {
        SERVIDOR_DESENVOLVIMENTO = true;
    }

    if (SERVIDOR_DESENVOLVIMENTO) {
        URL_BASE = "http://localhost:3000/";
    }
}

function atualizaTask() {
    console.log("Atualizando task...");
    console.log("Atualizando api task...");

    callApi("GET", "produtos");
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

function callApi(method, rota, func = false) {
    const url = URL_BASE + rota;
    try {
        fetch(url, {
                method: method, // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: getHeaders(),
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
            }).then(response => response.json())
            .then(data => {
                let oRetorno = JSON.stringify(data);
                console.log(data);

                if (func) {
                    func(data);
                }
            });
    } catch (error) {
        console.log("Erro:" + error);
    }
}

function callApiPost(method, rota, data = false, func = false) {
    const url = URL_BASE + rota;
    try {
        fetch(url, {
                method: method, // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: getHeaders(),
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                body: JSON.stringify(data)
            }).then(response => response.json())
            .then(data => {
                let oRetorno = JSON.stringify(data);
                console.log(data);

                if (func) {
                    func(data);
                }
            });
    } catch (error) {
        console.log("Erro:" + error);
    }
}

function confirmar(formulario) {
    const id = document.querySelector("#id").value;
    const descricao = document.querySelector("#descricao").value;
    const nome = document.querySelector("#descricao").value;
    const preco = document.querySelector("#preco").value;

    let categoria_id = document.querySelector("#categoria").value;
    if (categoria_id == "") {
        categoria_id = 1;
    }

    const oDados = {
        id,
        nome,
        descricao,
        preco,
        categoria_id
    };

    callApiPost("POST", "produtos", oDados, function() {
        atualizaConsulta();
    });
}

function atualizaConsulta() {

    callApi("GET", "produtos", function(data) {
        let aListaDados = JSON.stringify(data);

        // console.log(aListaDados);

        let body = document.querySelector(".containerTable-body");
        body.innerHTML = "";

        data.forEach(function(produto, key) {
            // console.log("codigo: " + produto["id"]);
            // console.log("descricao: " + produto["descricao"]);
            // console.log("preco: " + produto["preco"]);
            // console.log("categoria: " + produto["categoria_id"]);

            const codigo = produto["id"];
            const descricao = produto["descricao"];
            const nome = produto["nome"];
            const preco = produto["preco"];
            const categoria = produto["categoria_id"];

            let descricao_categoria = "Comida";
            if (categoria == 1) {
                descricao_categoria = "Comida";
            }

            if (categoria == 2) {
                descricao_categoria = "Bebida";
            }

            if (categoria == 3) {
                descricao_categoria = "Produto de Limpeza";
            }

            const acoes = `
                <div class="botoes">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#formulario01" onclick='incluirProduto(` + codigo + `)'>
                        Incluir
                    </button>
                    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#formulario01" onclick='alterarProduto(` + codigo + `)'>
                        Alterar
                    </button>
                    <button class='btn btn-danger' onclick='excluirProduto(` + codigo + `)'>Excluir</button>
                </div>`;

            body.innerHTML += `
            <tr>
                <td class="containerTable-lblValue" align="center">` + codigo + `</td>
                <td class="containerTable-lblValue">` + nome + `</td>
                <td class="containerTable-lblValue" align="center">` + preco + `</td>
                <td class="containerTable-lblValue" align="center">` + descricao_categoria + `</td>
                <td class="containerTable-lblValue">` + acoes + `</td>
            </tr>`;
        });
    });

}

function excluirProduto(id) {
    callApi("DELETE", "produtos/" + id, function() {
        atualizaConsulta();
    });
}

function getProximoId(tabela, func) {
    callApi("GET", tabela, function(data) {
        const tamanho = data.length;

        // Pega o tamanho atual dos dados e soma 1
        const proximo_id = (parseInt(tamanho) + 1);

        if (func) {
            // Passa este novo valor por parametro para o retorno na abertura do Modal
            func(proximo_id);
        }
    });
}

$('#formulario01').on('show.bs.modal', function(event) {
    console.log("CHAMANDO A FUNCAO AO INICIAR O MODAL");
    // var button = document.querySelector("#btn_formulario_01"); // Botão que acionou o modal
    // var recipient = button.data('whatever'); // Extrai informação dos atributos data-*

    // Se necessário, você pode iniciar uma requisição AJAX aqui e, então, fazer a atualização em um callback.
    // Atualiza o conteúdo do modal.Nós vamos usar jQuery, aqui.No entanto, você poderia usar uma biblioteca de data binding ou outros métodos.
    var modal = $(this);

    // modal.find('.modal-title').text('Nova mensagem para ' + 1);
    // modal.find('.modal-body input').val(2);

    getProximoId('produtos', function(id) {
        let proximo_id = id;

        const acao_atual = modal.find('#ACAO').val();

        console.log("acao_atual: " + acao_atual);

        if (ACAO == ACAO_INCLUIR) {
            console.log("incluindo..." + ACAO);
        } else {
            proximo_id = parseInt(modal.find("#ALTERACAO_ID").value);
            console.log("alterando...");
        }

        // Atualizacao do id da tela
        modal.find('#id').val(proximo_id);
    });
})

function incluirProduto() {
    document.querySelector("#ACAO").value = ACAO_INCLUIR;
}

function alterarProduto(id) {
    console.log("CHAMANDO A FUNCAO alterarProduto()");

    document.querySelector("#ACAO").value = ACAO_ALTERAR;
    document.querySelector("#ALTERACAO_ID").value = id;
}

function alterarProduto(id) {

}