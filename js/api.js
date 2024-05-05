var URL_BASE = "https://my-json-server.typicode.com/Gelvazio/sistemajavafrontend/";
var SERVIDOR_DESENVOLVIMENTO = false;

function loadUrlBase() {
    var url_atual = window.location.href;
    if (url_atual.includes("http://localhost:5500/")) {
        SERVIDOR_DESENVOLVIMENTO = true;
    }

    if (SERVIDOR_DESENVOLVIMENTO) {
        URL_BASE = "http://localhost:3000/";
    }
}

loadUrlBase();

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
    const preco = document.querySelector("#preco").value;
    const categoria_id = document.querySelector("#categoria").value;

    const oDados = {
        id,
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

        console.log(aListaDados);

        let body = document.querySelector(".containerTable-body");
        body.innerHTML = "";

        data.forEach(function(produto, key) {
            console.log("codigo: " + produto["id"]);
            console.log("descricao: " + produto["descricao"]);
            console.log("preco: " + produto["preco"]);
            console.log("categoria: " + produto["categoria_id"]);

            const codigo = produto["id"];
            const descricao = produto["descricao"];
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

            const acoes = `<div class="botoes">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#formulario01">
                        Incluir
                    </button>
                    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#formulario01">
                        Alterar
                    </button>
                    <button class='btn btn-danger' onclick='excluirProduto(` + codigo + `)'>Excluir</button>
                </div>`;
            body.innerHTML += `<tr>
            <td class="containerTable-lblValue" align="center">` + codigo + `</td>
            <td class="containerTable-lblValue">` + descricao + `</td>
            <td class="containerTable-lblValue">` + preco + `</td>
            <td class="containerTable-lblValue">` + descricao_categoria + `</td>
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

// $('#formulario01').on('show.bs.modal', function(event) {
//     var button = document. // Botão que acionou o modal

//     var recipient = button.data('whatever') // Extrai informação dos atributos data-*
//         // Se necessário, você pode iniciar uma requisição AJAX aqui e, então, fazer a atualização em um callback.
//         // Atualiza o conteúdo do modal. Nós vamos usar jQuery, aqui. No entanto, você poderia usar uma biblioteca de data binding ou outros métodos.
//     var modal = $(this);

//     modal.find('.modal-title').text('Nova mensagem para ' + recipient);
//     modal.find('.modal-body input').val(recipient);

// })

function alterarProduto(id) {
    callApi("DELETE", "produtos/" + id, function() {
        atualizaConsulta();
    });
}