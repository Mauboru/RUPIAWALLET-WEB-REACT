import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { getTransactions } from '../services/transacao';
import { getCategory } from '../services/category';
import { format, subMonths, parseISO, addMonths } from 'date-fns';

export default function Dashboards() {
  const [transacoes, setTransacoes] = useState([]);
  const [periodo, setPeriodo] = useState('1'); 
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const response = await getTransactions();
        setTransacoes(response.data);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    };

      const fetchCategories = async () => {
        try {
          const response = await getCategory();
          setCategories(response.data);
        } catch (error) {
          console.error("Erro ao carregar categorias:", error);
        }
    };

      fetchTransacoes();
      fetchCategories();
  }, []);

  const filtrarPorPeriodo = (tx) => {
    const mesesAtras = parseInt(periodo);
    const dataLimite = subMonths(new Date(), mesesAtras);
    return tx.data ? parseISO(tx.data) >= dataLimite : false;
  };

  const processarDados = () => {
    const totalMensal = {};
    const totalPorFormaPagamento = {};
    const faturaCredito = {};
    const totalPorCategoria = { entrada: {}, saida: {} };
  
    let totalGasto = 0;
    let totalGanho = 0;
    let totalCredito = 0;
  
    transacoes.filter(filtrarPorPeriodo).forEach(tx => {
      const dataTx = tx.data ? parseISO(tx.data) : new Date();
      const mes = format(dataTx, 'yyyy-MM');
      const dia = dataTx.getDate();
  
      if (!totalMensal[mes]) totalMensal[mes] = { ganho: 0, gasto: 0 };
  
      if (tx.formaPagamento === 'CREDITO') {
        totalCredito += Number(tx.valor);
        const mesFatura = dia <= 12 ? mes : format(addMonths(dataTx, 1), 'yyyy-MM');
        faturaCredito[mesFatura] = (faturaCredito[mesFatura] || 0) + Number(tx.valor);
      }
  
      let categoriaNome = 'Outros';
      const cat = categories.find(c => c.id === tx.categoriaId);
      if (cat) categoriaNome = cat.nome;

  
      if (tx.tipo === 'SAIDA') {
        totalGasto += Number(tx.valor);
        totalMensal[mes].gasto += Number(tx.valor);
        totalPorFormaPagamento[tx.formaPagamento] = (totalPorFormaPagamento[tx.formaPagamento] || 0) + Number(tx.valor);
        totalPorCategoria.saida[categoriaNome] = (totalPorCategoria.saida[categoriaNome] || 0) + Number(tx.valor);
      } else {
        totalGanho += Number(tx.valor);
        totalMensal[mes].ganho += Number(tx.valor);
        totalPorCategoria.entrada[categoriaNome] = (totalPorCategoria.entrada[categoriaNome] || 0) + Number(tx.valor);
      }
    });
  
    return {
      totalMensal,
      totalPorFormaPagamento,
      faturaCredito,
      totalPorCategoria,
      totalGasto,
      totalGanho,
      totalCredito
    };
  };  

  const {
    totalPorCategoria,
    totalMensal,
    totalPorFormaPagamento,
    faturaCredito,
    totalGasto,
    totalGanho,
    totalCredito
  } = processarDados();

  return (
    <MainLayout>
      <Styled.Header>
        <Styled.Title>Dashboard Financeiro</Styled.Title>
        <Styled.PeriodoSelector>
          <label>Período:</label>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="1">Último mês</option>
            <option value="3">3 meses</option>
            <option value="6">6 meses</option>
            <option value="12">1 ano</option>
            <option value="0">Todos</option>
          </select>
        </Styled.PeriodoSelector>
      </Styled.Header>

      {/* Resumo Financeiro */}
      <Styled.ResumoContainer>
        <Styled.ResumoCard tipo="entrada">
          <h3>Total de Entradas</h3>
          <p>R$ {totalGanho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </Styled.ResumoCard>
        
        <Styled.ResumoCard tipo="saida">
          <h3>Total de Saídas</h3>
          <p>R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </Styled.ResumoCard>
        
        <Styled.ResumoCard tipo="saldo">
          <h3>Saldo Atual</h3>
          <p>R$ {(totalGanho - totalGasto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </Styled.ResumoCard>
        
        <Styled.ResumoCard tipo="credito">
          <h3>Fatura Cartão</h3>
          <p>R$ {totalCredito.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </Styled.ResumoCard>
      </Styled.ResumoContainer>
        
      {/* Soma por Categoria */}
      <Styled.Title>Soma por Categoria</Styled.Title>
      <Styled.ResumoContainer>
        {Object.entries(totalPorCategoria.saida).map(([nome, valor]) => {
          const categoria = categories.find(cat => cat.nome === nome);
          const cor = categoria?.cor || '#bdc3c7';
          const iconeUrl = categoria?.icone || null;

          return (
            <Styled.CategoriaCard key={nome} cor={cor}>
              {iconeUrl && (
                <img
                  src={iconeUrl}
                  alt={nome}
                  style={{ width: 32, height: 32, marginBottom: '0.5rem' }}
                />
              )}
              <h3>{nome}</h3>
              <p>R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </Styled.CategoriaCard>
          );
        })}
      </Styled.ResumoContainer>

    </MainLayout>
  );
}

const Styled = {  
  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  `,
  
  Title: styled.h1`
    color: #2c3e50;
    font-size: 2rem;
    margin: 0;
  `,
  
  PeriodoSelector: styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    label {
      font-weight: 500;
      color: #555;
    }
    
    select {
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid #ddd;
      background: white;
    }
  `,
  
  ResumoContainer: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 6rem;
  `,
  
  ResumoCard: styled.div`
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    text-align: center;
    border-left: 4px solid ${props => 
      props.tipo === 'entrada' ? '#4CAF50' : 
      props.tipo === 'saida' ? '#F44336' : 
      props.tipo === 'saldo' ? '#2196F3' : '#9C27B0'};
    
    h3 {
      margin-top: 0;
      color: #555;
      font-size: 1rem;
    }
    
    p {
      margin-bottom: 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: ${props => 
        props.tipo === 'entrada' ? '#4CAF50' : 
        props.tipo === 'saida' ? '#F44336' : 
        props.tipo === 'saldo' ? '#2196F3' : '#9C27B0'};
    }
  `,

  CategoriaCard: styled.div`
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    text-align: center;
    border-left: 4px solid ${props => props.cor || '#bdc3c7'};
    
    h3 {
      margin-top: 0;
      color: #555;
      font-size: 1rem;
    }

    p {
      margin-bottom: 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: ${props => props.cor || '#bdc3c7'};
    }
  `
};