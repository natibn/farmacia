const { pool } = require('../config');
const Produto = require('../entities/produto');

const getProdutosDB = async () => {
    try {
        const { rows } = await pool.query(`SELECT * FROM produtos ORDER BY nome`);
        return rows.map((produto) => new Produto(produto.codigo, produto.nome, produto.descricao, produto.quantidade_estoque,
            produto.ativo, produto.valor, produto.data_cadastro, produto.categoria));
    } catch(err){
        throw "Erro: " + err;
    }
}

const addProdutoDB = async (body) => {
    try {
        const { nome } = body;
        const results = await pool.query(`INSERT INTO produtos (nome)
        VALUES ($1) RETURNING codigo, nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria`,[nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria]);
        const produto = results.rows[0];
        return new Produto(produto.codigo, produto.nome, produto.descricao, produto.quantidade_estoque,
            produto.ativo, produto.valor, produto.data_cadastro, produto.categoria);
    } catch (err){
        throw "Erro ao inserir o produto: " + err;
    }
}

const updateProdutoDB = async (body) => {
    try {
        const { codigo, nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria } = body;
        const results = await pool.query(`UPDATE produtos SET nome = $2, descricao = $3, quantidade_estoque = $4,
        ativo = $5, valor = $6, data_cadastro = $7, categoria = $8
         WHERE codigo = $1 returning codigo, nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria`,
         [codigo, nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo} para 
            ser alterado`;
        }
        const produto = results.rows[0];
        return new Produto(produto.codigo, produto.nome, produto.descricao, produto.quantidade_estoque,
            produto.ativo, produto.valor, produto.data_cadastro, produto.categoria);
    } catch (err){
        throw "Erro ao alterar o produto: " + err;
    }
}

const deleteProdutoDB = async (codigo) => {
    try {        
        const results = await pool.query(`DELETE FROM produtos
         WHERE codigo = $1`,[codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo} para 
            ser removido`;
        } else {
            return "Produto removido com sucesso";
        }
    } catch (err){
        throw "Erro ao remover o produto: " + err;
    }
}

const getProdutoPorCodigoDB = async (codigo) => {
    try {        
        const results = await pool.query(`SELECT * FROM produtos
         WHERE codigo = $1`,[codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } else {
            const produto = results.rows[0];
            return new Produto(produto.codigo, produto.nome, produto.descricao, produto.quantidade_estoque,
                produto.ativo, produto.valor, produto.data_cadastro, produto.categoria);
        }
    } catch (err){
        throw "Erro ao recuperar o produto: " + err;
    }
}

module.exports = {
    getProdutosDB, addProdutoDB, updateProdutoDB,
     deleteProdutoDB, getProdutoPorCodigoDB
}
