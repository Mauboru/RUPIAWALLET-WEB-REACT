import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { getTransactions } from '../services/transacao';

export default function Dashboards() {
  const [transacoes, setTransacoes] = useState([]);

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

  const totalPorCategoria = {};
  const totalMensal = {};

  let totalGasto = 0;
  let totalGanho = 0;

  transacoes.forEach(tx => {
    const mes = tx.data?.slice(0, 7); // yyyy-mm
    if (!totalMensal[mes]) totalMensal[mes] = { ganho: 0, gasto: 0 };

    if (tx.tipo === 'gasto') {
      totalGasto += Number(tx.valor);
      totalMensal[mes].gasto += Number(tx.valor);
      const cat = tx.categoria?.nome || 'Sem Categoria';
      totalPorCategoria[cat] = (totalPorCategoria[cat] || 0) + Number(tx.valor);
    } else {
      totalGanho += Number(tx.valor);
      totalMensal[mes].ganho += Number(tx.valor);
    }
  });

  const pieData = Object.entries(totalPorCategoria).map(([nome, valor]) => ({
    name: nome,
    value: valor,
  }));

  const barData = Object.entries(totalMensal).map(([mes, valores]) => ({
    mes,
    gasto: valores.gasto,
    ganho: valores.ganho,
  }));

  const cores = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  return (
    <MainLayout>
      <Styled.Wrapper>
        <Styled.Title>Resumo Financeiro</Styled.Title>

        <Styled.Card>
          <p><strong>Total Ganho:</strong> R$ {totalGanho.toFixed(2)}</p>
          <p><strong>Total Gasto:</strong> R$ {totalGasto.toFixed(2)}</p>
          <p><strong>Saldo:</strong> R$ {(totalGanho - totalGasto).toFixed(2)}</p>
        </Styled.Card>

        <Styled.ChartWrapper>
          <h3>Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Styled.ChartWrapper>

        <Styled.ChartWrapper>
          <h3>Gastos e Ganhos por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ganho" fill="#4CAF50" name="Ganhos" />
              <Bar dataKey="gasto" fill="#F44336" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </Styled.ChartWrapper>
      </Styled.Wrapper>
    </MainLayout>
  );
}

const Styled = {
  Wrapper: styled.div`
    padding: 2rem;
    max-width: 900px;
    margin: auto;
  `,
  Title: styled.h2`
    text-align: center;
    margin-bottom: 2rem;
  `,
  Card: styled.div`
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
    font-size: 1.2rem;
  `,
  ChartWrapper: styled.div`
    margin-bottom: 3rem;
  `
};
