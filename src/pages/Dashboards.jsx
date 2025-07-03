import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { getTransactionsByMonth } from '../services/transacao';
import { getCategory } from '../services/category';

export default function Dashboards() {
  const [mesSelecionado, setMesSelecionado] = useState(() => String(new Date().getMonth() + 1));
  const [totalGanho, setTotalGanho] = useState(0);
  const [totalGasto, setTotalGasto] = useState(0);
  const [totalCredito, setTotalCredito] = useState(0);
  const [totalPorCategoria, setTotalPorCategoria] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const anoAtual = now.getFullYear();
        const mesFormatado = mesSelecionado.padStart(2, '0');
        const periodo = `${anoAtual}-${mesFormatado}`;
  
        const [transRes, catRes] = await Promise.all([
          getTransactionsByMonth(periodo),
          getCategory()
        ]);
  
        const transacoes = transRes.data;
        const categorias = catRes.data;
        setCategories(categorias);
  
        let ganho = 0;
        let gasto = 0;
        let credito = 0;
        const porCategoria = {};
  
        transacoes.forEach((transacao) => {
          const valor = parseFloat(transacao.valor);
          if (transacao.tipo === "ENTRADA") {
            ganho += valor;
          } else if (transacao.tipo === "SAIDA") {
            gasto += valor;
            if (transacao.formaPagamento === "CREDITO") {
              credito += valor;
            }
            const categoriaId = transacao.categoriaId;
            porCategoria[categoriaId] = (porCategoria[categoriaId] || 0) + valor;
          }
        });
  
        setTotalGanho(ganho);
        setTotalGasto(gasto);
        setTotalCredito(credito);
        setTotalPorCategoria(porCategoria);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
  
    fetchData();
  }, [mesSelecionado]);
  
  return (
    <MainLayout>
      <Styled.Header>
        <Styled.Title>Dashboard Financeiro</Styled.Title>
        <Styled.PeriodoSelector>
        <label>Mês:</label>
          <select value={mesSelecionado} onChange={(e) => setMesSelecionado(e.target.value)}>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
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
        {Object.entries(totalPorCategoria).map(([categoriaId, valor]) => {
          const categoria = categories.find(cat => cat.id === Number(categoriaId));
          if (!categoria) return null;

          return (
            <Styled.CategoriaCard key={categoriaId} cor={categoria.cor}>
              {categoria.icone && <img src={categoria.icone} alt={categoria.nome} style={{ width: 32, height: 32, marginBottom: '0.5rem' }} />}
              <h3>{categoria.nome}</h3>
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