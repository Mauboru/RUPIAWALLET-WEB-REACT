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
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});
  const [transacoes, setTransacoes] = useState([]);

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
        setTransacoes(transacoes);
        const categorias = catRes.data.filter(cat => cat.nome !== 'CORREÇÃO');
        setCategories(categorias);
  
        let ganho = 0;
        let gasto = 0;
        let credito = 0;
        let porCategoria = {};

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

  const toggleCategoria = (categoriaId) => {
    setCategoriasExpandidas(prev => ({
      ...prev,
      [categoriaId]: !prev[categoriaId]
    }));
  };

  function getPeriodoFaturaAtual(today = new Date()) {
    const ano = today.getFullYear();
  
    let inicio, fim;
  
    if (today.getDate() >= 12) {
      inicio = new Date(ano, mesSelecionado - 1, 12);
      fim = new Date(ano, mesSelecionado, 11);
    } else {
      inicio = new Date(ano, mesSelecionado - 2, 12); // menos dois por conta do horario
      fim = new Date(ano, mesSelecionado - 1, 11);
    }
  
    return { inicio, fim };
  }

  let totalFaturaAtual = 0;
  let totalCaixinhaAtual = 0;
  const { inicio, fim } = getPeriodoFaturaAtual();

  transacoes.forEach((transacao) => {
    const valor = parseFloat(transacao.valor);
    const data = new Date(transacao.data);

    if (transacao.tipo === "SAIDA") {
      if (transacao.formaPagamento === "CREDITO") {
        if (data >= inicio && data <= fim) {
          totalFaturaAtual += valor;
        }
      } else if (transacao.categoria.nome === "Caixinha") {
        totalCaixinhaAtual += valor;
      }
    }
  });
  
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
          <p>R$ {Math.max(totalGanho - totalGasto, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </Styled.ResumoCard>
        
        <Styled.ResumoCard tipo="credito">
          <h3>Fatura Atual</h3>
          <p>R$ {totalFaturaAtual .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>
            Período: {inicio.toLocaleDateString()} a {fim.toLocaleDateString()}
          </p>
        </Styled.ResumoCard>

        <Styled.ResumoCard tipo="caixinha">
          <h3>Caixinha</h3>
          <p>R$ {totalCaixinhaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </Styled.ResumoCard>
      </Styled.ResumoContainer>
        
      {/* Soma por Categoria */}
      <Styled.Title>Soma por Categoria</Styled.Title>
      <Styled.ResumoContainer>
        {Object.entries(totalPorCategoria).map(([categoriaId, _]) => {
          const categoria = categories.find(cat => cat.id === Number(categoriaId));
          if (!categoria) return null;

          // Transações filtradas conforme a lógica
          const transacoesFiltradas = transacoes.filter(t => {
            const mesmoId = t.categoriaId === Number(categoriaId);
            const saida = t.tipo === 'SAIDA';

            if (categoria.nome === 'Cartão de Crédito') {
              return saida && t.formaPagamento === 'CREDITO'; // apenas se for crédito
            }

            return mesmoId && saida; // padrão
          });

          // Soma com base nas transações filtradas
          const valorTotal = transacoesFiltradas.reduce((acc, t) => acc + parseFloat(t.valor), 0);

          return (
            <Styled.CategoriaCard key={categoriaId} cor={categoria.cor} onClick={() => toggleCategoria(categoriaId)}>
              {categoria.icone && (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${categoria.icone}`}
                  alt={categoria.nome}
                  style={{ width: 32, height: 32, marginBottom: '0.5rem' }}
                />
              )}
              <h3>{categoria.nome}</h3>
              <p>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>

              {categoriasExpandidas[categoriaId] && (
                <Styled.Detalhes>
                  {transacoesFiltradas.map(t => (
                    <Styled.Descricao key={t.id}>
                      * {t.descricao || 'Sem descrição'} — R${' '}
                      {parseFloat(t.valor).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </Styled.Descricao>
                  ))}
                </Styled.Detalhes>
              )}
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
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  `,

  Title: styled.h1`
    font-size: 1.75rem;
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 1rem;
    flex: 1 1 100%;
  `,

  PeriodoSelector: styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
      font-weight: 500;
      color: #333;
    }

    select {
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 1rem;
    }
  `,

  ResumoContainer: styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 4rem;

    @media(min-width: 480px) {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  `,

  ResumoCard: styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    border-left: 4px solid ${props =>
      props.tipo === 'entrada' ? '#2ecc71' :
      props.tipo === 'saida' ? '#e74c3c' :
      props.tipo === 'saldo' ? '#3498db' : 
      props.tipo === 'caixinha' ? '#dbd034ff' : '#8e44ad'};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    h3 {
      font-size: 0.95rem;
      color: #666;
      margin: 0 0 0.4rem;
    }

    p {
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0;
      color: ${props =>
        props.tipo === 'entrada' ? '#27ae60' :
        props.tipo === 'saida' ? '#c0392b' :
        props.tipo === 'saldo' ? '#2980b9' :
        props.tipo === 'caixinha' ? '#ada200ff' : '#7d3c98'};
    }
  `,

  CategoriaCard: styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    border-left: 4px solid ${props => props.cor || '#bdc3c7'};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 36px;
      height: 36px;
      margin-bottom: 0.5rem;
    }

    h3 {
      margin: 0.25rem 0;
      font-size: 1rem;
      color: #444;
    }

    p {
      font-size: 1.2rem;
      font-weight: bold;
      color: ${props => props.cor || '#7f8c8d'};
      margin: 0;
    }
  `,

  Detalhes: styled.div`
    margin-top: 1rem;
    width: 100%;
    background: #f8f8f8;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.9rem;
    text-align: left;
    color: #555;
  `,

  Descricao: styled.p`
    font-size: 0.8rem;
    margin: 0.25rem 0;
  `
};