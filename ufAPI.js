const selectEst = document.getElementById('estado')
const selectCid = document.getElementById('cidade')
selectCid.disabled = true

//------- Códigos uf -------//
//Função para capturar os códigos de cada Estados e colocálos numa variável.
let codigoUf = '';
const codigosUF = () => {
    for(let i = 11; i <= 17; i++){
        codigoUf += `${i}|`    
    }
    //Região Nordeste
    for(let i = 21; i <= 29; i++){
        codigoUf += `${i}|`    
    }
    //Região Sudeste
    for(let i = 31; i <= 35; i++){
        codigoUf += `${i}|`    
    }
    //Região Sul
    for(let i = 41; i <= 43; i++){
        codigoUf += `${i}|`    
    }
    //Região Centro-Oeste
    for(let i = 50; i <= 53; i++){
        codigoUf += `${i}|`    
    }
    return codigoUf
}

let criarElemento = (select, sigla, nome) => {
    let option = document.createElement('option')
    option.value = sigla
    option.innerHTML = nome
    select.appendChild(option)
}

fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${codigosUF()}/distritos`)
    .then(response => {
        return response.json()
    })
    .then(responseJson => {
        //ResponseJson é um array de objetos que tornou-se um Json, contendo todas cidades.

        //Váriaveis que armazenarão o que foi escolhido
        let cidadeResult = ''
        let estadoResult = ''

        selectEst.addEventListener('change', (eventEst) => {
            selectCid.disabled = false
            estadoResult = eventEst.target.value
            selectCid.innerHTML = '' //Limpor o select de Estado, para não agregar cidades de outro estado
            
            let selectCidOptions = [] //Array que armazenará as cidades do estado escolhido
            for(let i = 0; i < responseJson.length; i++){
                //Percorro cada índice do array cidadeOjetos, que contém as cidades. Pegando sua sigla e nome
                const cidadesSigla = responseJson[i].municipio.microrregiao.mesorregiao.UF.sigla //Sigla do estadoo que a cidade pertence
                const cidadesNome = responseJson[i].nome

                if(eventEst.target.value == cidadesSigla){
                    selectCidOptions.push(cidadesNome)
                }
            }
            //Coloco o array com os nomes das cidades do estado selecionado em ordem alfabética
            selectCidOptions.sort()

            //percorrendo o array e criando elementos com o seu respectivo nome
            for(nome of selectCidOptions){
                criarElemento(selectCid, nome, nome)
            }

            /*Quando um novo estado for escolhido, a variável que armazena a cidade escolhida recebe como valor a primeira cidade da lista.
            Pois já vem selecionada no select a primeira cidade, e como só é colocado a cidade escolhida quando o select é mudado, se o usuário
            escolher um estado e nem mexer na cidade, automaticamente será a primeira cidade.*/
            cidadeResult = selectCidOptions[0]
        })

        //Quando select de cidade é mudado, atribuo à variavel cidadeResult a cidade que foi escolhida
        selectCid.addEventListener('change', (eventCid) => {
            cidadeResult = eventCid.target.value
        })

        //--------- Mostrar o estado a cidade escolhida -----------//
        const result = document.querySelector('#result')
        const buttonResult = document.getElementById('botaoResult')
        buttonResult.addEventListener('click', () =>{
            result.style.display = 'block'
            if(!estadoResult == ''){
                result.innerHTML = `<p>Você escolheu <strong>${cidadeResult} - ${estadoResult}</strong> </p`
            } else {
                
                result.innerHTML = `<p class="font-bold"> Não deixe nada em branco! </p>`
            }

            
        })

        //------------------ Popular estados ----------------//
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(response => {
            return response.json()
        })
        .then(responseJson => {
            console.log(responseJson)

            //Se o nome do array for igual ao nome do responseJson pegar a sigla do responseJson
            let estadosNome = []
            for(nome of responseJson){
                estadosNome.push(nome.nome)
            }
            estadosNome.sort()
            
            let estadoArr = []
            for(estado of responseJson){
                for(let i = 0; i < estadosNome.length; i++){
                    if(estadosNome[i] == estado.nome){
                        estadoArr[i] = {nome: estadosNome[i], sigla: estado.sigla}
                    }
                }
            }
            
            //Criar as options dos Estados
            for(estado of estadoArr){
                criarElemento(selectEst, estado.sigla, estado.nome)
            }
        })
    })


    


















