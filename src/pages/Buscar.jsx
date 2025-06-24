import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { getTransactions } from '../services/transacao';
import { useEffect, useState } from "react";

export default function Buscar() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <MainLayout>
      <Styled.Title>Tela de Busca</Styled.Title>
      <Styled.TableWrapper>
        {transactions.length === 0 ? (
          <Styled.EmptyMessage>Nenhuma transação encontrada.</Styled.EmptyMessage>
        ) : (
          <Styled.Table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Forma</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td data-label="Data">{t.data}</td>
                  <td data-label="Descrição">{t.descricao}</td>
                  <td data-label="Valor">R$ {parseFloat(t.valor).toFixed(2)}</td>
                  <td data-label="Forma">{t.formaPagamento}</td>
                </tr>
              ))}
            </tbody>
          </Styled.Table>
        )}
      </Styled.TableWrapper>
    </MainLayout>
  );
}

const Styled = {
  Title: styled.h2`
    margin: 16px 0;
    font-size: 20px;
  `,

  TableWrapper: styled.div`
    width: 100%;
    overflow-x: auto;
    padding: 0 16px;
    padding-bottom: 38px
  `,

  Table: styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;

    thead {
      background-color: #f0f0f0;
    }

    th, td {
      padding: 12px 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    @media (max-width: 600px) {
      thead {
        display: none;
      }

      tr {
        display: block;
        margin-bottom: 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 8px;
      }

      td {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        border: none;
        border-bottom: 1px solid #eee;
      }

      td::before {
        content: attr(data-label);
        font-weight: bold;
        margin-right: 8px;
      }
    }
  `,

  EmptyMessage: styled.p`
    padding: 16px;
    text-align: center;
    color: #777;
  `,
};
