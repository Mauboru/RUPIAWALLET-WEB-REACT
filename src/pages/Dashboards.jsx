import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { getTransactions } from '../services/transacao';
import { format, subMonths, parseISO, addMonths } from 'date-fns';

export default function Dashboards() {
  const [transacoes, setTransacoes] = useState([]);
  const [periodo, setPeriodo] = useState('1'); 

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const response = await getTransactions();
        setTransacoes(response.data);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    };

    fetchTransacoes();
  }, []);

  const filtrarPorPeriodo = (tx) => {
    const mesesAtras = parseInt(periodo);
    const dataLimite = subMonths(new Date(), mesesAtras);
    return tx.data ? parseISO(tx.data) >= dataLimite : false;
  };

  const processarDados = () => {
    const totalPorCategoria = { entrada: {}, saida: {} };
    const totalMensal = {};
    const totalPorFormaPagamento = {};
    const faturaCredito = {};

    let totalGasto = 0;
    let totalGanho = 0;
    let totalCredito = 0;

    transacoes.filter(filtrarPorPeriodo).forEach(tx => {
      const dataTx = tx.data ? parseISO(tx.data) : new Date();
      const mes = format(dataTx, 'yyyy-MM');
      const dia = dataTx.getDate();
      
      if (!totalMensal[mes]) {
        totalMensal[mes] = { ganho: 0, gasto: 0 };
      }

      // Cálculo para fatura do cartão de crédito (fecha dia 12, vence dia 19)
      if (tx.formaPagamento === 'CREDITO') {
        totalCredito += Number(tx.valor);
        const mesFatura = dia <= 12 ? mes : format(addMonths(dataTx, 1), 'yyyy-MM');
        faturaCredito[mesFatura] = (faturaCredito[mesFatura] || 0) + Number(tx.valor);
      }

      if (tx.tipo === 'SAIDA') {
        totalGasto += Number(tx.valor);
        totalMensal[mes].gasto += Number(tx.valor);
        
        const cat = tx.categoria?.nome || 'Sem Categoria';
        totalPorCategoria.saida[cat] = (totalPorCategoria.saida[cat] || 0) + Number(tx.valor);
        
        // Forma de pagamento
        totalPorFormaPagamento[tx.formaPagamento] = (totalPorFormaPagamento[tx.formaPagamento] || 0) + Number(tx.valor);
      } else {
        totalGanho += Number(tx.valor);
        totalMensal[mes].ganho += Number(tx.valor);
        
        const cat = tx.categoria?.nome || 'Sem Categoria';
        totalPorCategoria.entrada[cat] = (totalPorCategoria.entrada[cat] || 0) + Number(tx.valor);
      }
    });

    return {
      totalPorCategoria,
      totalMensal,
      totalPorFormaPagamento,
      faturaCredito,
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
};