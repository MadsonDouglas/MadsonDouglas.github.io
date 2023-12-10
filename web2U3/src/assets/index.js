let jogadas = 0;
let modo = 'dupla';

function iniciar_matriz(matrix_size) {

    //mapeando alguns tamanho de largura para a matrix
    const largura_content = { '3': '150px', '4': '200px', '5': '250px', '6': '300px', '7': '350px', '8': '400px', '9': '450px', '10': '500px' };

    // const matrix_size_input = document.getElementById("matrixSize");
    const matriz_container = document.getElementById("matrizContainer");

    // Limpe o conteúdo anterior
    matriz_container.innerHTML = '';


    matriz_container.style.width = largura_content[matrix_size];
    const matrix = criar_matriz(matrix_size);
    paint_matrix(matrix, matriz_container);
    adicionar_eventos_clique(matrix, matriz_container);
    resetar_jogo(matrix)
    jogadas = 0;
}

function validar_input() {
    const matrix_size_input = document.getElementById("matrixSize");
    const matrix_size = parseInt(matrix_size_input.value, 10);

    if (isNaN(matrix_size) || matrix_size < 3 || matrix_size > 10) {
        alert("Por favor, insira um número válido entre 3 e 10.");
        return;
    } else {
        iniciar_matriz(matrix_size)
    }
}

function criar_matriz(size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = Array.from({ length: size }, () => '');
        matrix.push(row);
    }
    return matrix;
}

function paint_matrix(matrix, container) {
    for (let i = 0; i < matrix.length; i++) {
        let div = document.createElement('div');
        div.className = `linha l${i}`;

        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell-${i}-${j}`;

            // Adicionando um span para exibir 'X' ou 'O'
            const span = document.createElement("div");
            span.textContent = matrix[i][j];
            cell.appendChild(span);

            div.appendChild(cell);
        }

        container.appendChild(div);
    }
}

function adicionar_eventos_clique(matrix, container) {
    const cells = container.getElementsByClassName("cell");

    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", function () {
            if (this.textContent === '' && !verificar_vencedor(matrix)) {
                const [row, col] = this.id.split('-').slice(1).map(Number);
                let content = jogadas % 2 == 0 ? 'X' : 'O';

                // Jogador humano
                if (modo === 'dupla') {
                    realizar_jogada(this, matrix, row, col, content);
                } else {
                    // Jogador sozinho contra o algoritmo
                    realizar_jogada(this, matrix, row, col, content);
                    if (!verificar_vencedor(matrix) && jogadas % 2 !== 0) {
                        // É a vez do algoritmo jogar
                        realizar_jogada_aleatoria(matrix);
                    }
                }
            }
        });
    }
}

function verificar_vencedor(matrix) {
    // Verificar linhas e colunas
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].every(cell => cell === 'X') || matrix.every(row => row[i] === 'X')) {
            return 'X';
        }
        if (matrix[i].every(cell => cell === 'O') || matrix.every(row => row[i] === 'O')) {
            return 'O';
        }
    }

    // Verificar diagonais
    if (matrix.every((row, index) => row[index] === 'X') || matrix.every((row, index) => row[matrix.length - 1 - index] === 'X')) {
        return 'X';
    }
    if (matrix.every((row, index) => row[index] === 'O') || matrix.every((row, index) => row[matrix.length - 1 - index] === 'O')) {
        return 'O';
    }

    return null;
}

function verificar_fim_de_jogo(matrix) {
    const vencedor = verificar_vencedor(matrix);
    let resultado = document.querySelector('#resultado');
    if (vencedor) {
        resultado.textContent = `O jogador '${vencedor}' venceu!`.toLocaleUpperCase()
        resultado.style.display = 'block';
        // alert(`O jogador ${vencedor} venceu!`);
        // resetarJogo(matrix);
    } else if (jogadas >= matrix.length * matrix.length) {
        resultado.textContent = `DEU VELHA!!!`;
        resultado.style.display = 'block';
        // alert("O jogo terminou em empate!");
        // resetarJogo(matrix);
    }
}

function realizar_jogada(cell, matrix, row, col, content) {
    const texto = document.createElement("div");
    const span = document.createElement('span');

    span.textContent = content;
    texto.appendChild(span);
    texto.classList.add('animate');

    cell.innerHTML = '';  // Limpar conteúdo existente
    cell.appendChild(texto);

    matrix[row][col] = content;
    jogadas++;
    verificar_fim_de_jogo(matrix);
}

function realizar_jogada_aleatoria(matrix) {
    // Encontrar células livres na matriz
    const cells_livres = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === '') {
                cells_livres.push({ row: i, col: j });
            }
        }
    }

    // Escolher aleatoriamente uma célula livre
    const jogada_aleatoria = cells_livres[Math.floor(Math.random() * cells_livres.length)];
    const row = jogada_aleatoria.row;
    const col = jogada_aleatoria.col;

    // aguardando alguns millisegundos para dar a impressão que a jogada foi pensada
    setTimeout(() => {
        realizar_jogada(document.getElementById(`cell-${row}-${col}`), matrix, row, col, 'O');
    }, 200);
}

function resetar_jogo(matrix) {
    let resultado = document.querySelector('#resultado');
    resultado.style.display = 'none';
    matrix.forEach(row => row.fill(''));
    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
    }
    jogadas = 0;
}

document.addEventListener("DOMContentLoaded", function () {

    const opcoes = document.querySelectorAll('.radio-buttons input[name="opcoes"]');

    opcoes.forEach(button => {
        button.addEventListener('change', function () {
            const { value } = this;
            modo = value
        });
    });

    let nova_partida = document.getElementById('nova_partida');

    nova_partida.addEventListener('click', function (event) {
        validar_input()
    });
}); 
