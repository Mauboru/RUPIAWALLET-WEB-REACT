import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { getTransactionsByMonth, deleteTransaction } from "../services/transacao";
import { getCategory, deleteCategory } from "../services/category";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Buscar() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth());
  const [formaFilter, setFormaFilter] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [modoVisualizacao, setModoVisualizacao] = useState("transacoes");
  const [categorias, setCategorias] = useState([]);
  const [tipoExclusao, setTipoExclusao] = useState(null); 
  const navigate = useNavigate();

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  const abrirModal = (id, tipo) => {
    setIdParaExcluir(id);
    setTipoExclusao(tipo);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setIdParaExcluir(null);
    setModalAberto(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [monthFilter]);

  useEffect(() => {
    let data = [...transactions];

    if (formaFilter) data = data.filter((t) => t.formaPagamento === formaFilter);
    if (categoriaFilter) data = data.filter((t) => t.categoria?.nome === categoriaFilter);

    setFiltered(data);
  }, [formaFilter, categoriaFilter, transactions]);

  useEffect(() => {
    if (modoVisualizacao === "categorias") {
      fetchCategorias();
    }
  }, [modoVisualizacao]);

  const fetchCategorias = async () => {
    try {
      const response = await getCategory();
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const confirmarExclusaoCategoria = async () => {
    try {
      await deleteCategory(idParaExcluir);
      await fetchCategorias();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    } finally {
      fecharModal();
    }
  };

  const editarCategoria = (id) => {
    navigate(`/editar-category/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/editar-transacao/${id}`);
  }

  const fetchTransactions = async () => {
    try {
      const response = await getTransactionsByMonth(monthFilter);
      setTransactions(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmarExclusao = async () => {
    try {
      await deleteTransaction(idParaExcluir);
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      fecharModal();
    }
  };

  const uniqueFormas = [...new Set(transactions.map((t) => t.formaPagamento))];
  const uniqueCategorias = [...new Set(transactions.map((t) => t.categoria?.nome || ""))];

  const clearFilters = () => {
    setMonthFilter(getCurrentMonth());
    setFormaFilter("");
    setCategoriaFilter("");
  };

  return (
    <MainLayout>
      <Styled.Title>Tela de Busca</Styled.Title>

      <Styled.Filters>
        <div>
          <label>Modo:</label>
          <select value={modoVisualizacao} onChange={(e) => setModoVisualizacao(e.target.value)}>
            <option value="transacoes">Transações</option>
            <option value="categorias">Categorias</option>
          </select>
        </div>

        {modoVisualizacao === "transacoes" && (
          <>
            {/* filtros atuais de transações */}
            <div>
              <label>Mês:</label>
              <input
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
              />
            </div>

            <div>
              <label>Forma:</label>
              <select value={formaFilter} onChange={(e) => setFormaFilter(e.target.value)}>
                <option value="">Todas</option>
                {uniqueFormas.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Categoria:</label>
              <select value={categoriaFilter} onChange={(e) => setCategoriaFilter(e.target.value)}>
                <option value="">Todas</option>
                {uniqueCategorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <Styled.ClearButton onClick={clearFilters}>Limpar Filtros</Styled.ClearButton>
          </>
        )}
      </Styled.Filters>

      <Styled.TableWrapper>
        {modoVisualizacao === "transacoes" ? (
          filtered.length === 0 ? (
            <Styled.EmptyMessage>Nenhuma transação encontrada.</Styled.EmptyMessage>
          ) : (
              <Styled.Table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Forma</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <Styled.TableRow key={t.id} tipo={t.tipo}>
                      <td>{new Date(t.data).toLocaleDateString()}</td>
                      <td>{t.descricao}</td>
                      <td>{t.categoria?.nome || "-"}</td>
                      <td>{t.formaPagamento}</td>
                      <td>{t.tipo}</td>
                      <td>R$ {Number(t.valor).toFixed(2)}</td>
                      <td>
                        <Styled.ActionButton onClick={() => handleEdit(t.id)} title="Editar">
                          <FaEdit />
                        </Styled.ActionButton>
                        <Styled.ActionButton onClick={() => abrirModal(t.id, "transacao")} title="Excluir" danger>
                          <FaTrash />
                        </Styled.ActionButton>
                      </td>
                    </Styled.TableRow>
                  ))}
                </tbody>
              </Styled.Table>

          )
        ) : (
          categorias.length === 0 ? (
            <Styled.EmptyMessage>Nenhuma categoria encontrada.</Styled.EmptyMessage>
          ) : (
            <Styled.Table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td>
                      <Styled.ActionButton onClick={() => editarCategoria(c.id)} title="Editar">
                        <FaEdit />
                      </Styled.ActionButton>
                      <Styled.ActionButton onClick={() => abrirModal(c.id, "categoria")} title="Excluir" danger>
                        <FaTrash />
                      </Styled.ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Styled.Table>
          )
        )}
      </Styled.TableWrapper>

      {modalAberto && (
        <Styled.ModalOverlay>
          <Styled.ModalBox>
            <h3>Confirmar Exclusão</h3>
            {tipoExclusao === "categoria" ? (
              <p>Ao excluir esta categoria, todas as transações relacionadas também serão removidas. Deseja continuar?</p>
            ) : (
              <p>Tem certeza que deseja excluir esta transação?</p>
            )}
            <Styled.ModalActions>
              <button onClick={fecharModal}>Cancelar</button>
              <button onClick={tipoExclusao === "categoria" ? confirmarExclusaoCategoria : confirmarExclusao}>Excluir</button>
            </Styled.ModalActions>
          </Styled.ModalBox>
        </Styled.ModalOverlay>
      )}
    </MainLayout>
  );
}

const Styled = {
  Title: styled.h2`
    margin: 24px 16px;
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  `,

  TableRow: styled.tr`
    background-color: ${({ tipo }) =>
      tipo === "ENTRADA" ? "#eafaf1" :
      tipo === "SAIDA" ? "#fdecea" :
      "transparent"};

    td {
      color: ${({ tipo }) =>
        tipo === "ENTRADA" ? "#27ae60" :
        tipo === "SAIDA" ? "#c0392b" :
        "#2c3e50"};
    }

    &:hover {
      background-color: ${({ tipo }) =>
        tipo === "ENTRADA" ? "#d4f6e2" :
        tipo === "SAIDA" ? "#f9dad8" :
        "#f5f9fc"};
    }
  `,

  Filters: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin: 0 16px 24px;
    align-items: flex-end;

    div {
      display: flex;
      flex-direction: column;
      min-width: 160px;
    }

    label {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
      color: #34495e;
    }

    input,
    select {
      padding: 8px 12px;
      font-size: 15px;
      border-radius: 6px;
      border: 1.5px solid #bdc3c7;
      transition: border-color 0.2s ease;

      &:focus {
        border-color: #2980b9;
        outline: none;
      }
    }

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: stretch;

      div {
        min-width: auto;
        width: 100%;
      }

      ${/* Botão limpar também ocupa 100% */ ""}
      button {
        width: 100%;
        margin-top: 12px;
        height: 42px;
      }
    }
  `,

  ClearButton: styled.button`
    background-color: #7f8c8d;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-weight: 600;
    cursor: pointer;
    height: 40px;
    align-self: flex-start;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #95a5a6;
    }
  `,

  TableWrapper: styled.div`
    width: 100%;
    overflow-x: auto;
    padding: 0 16px 48px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
    border-radius: 8px;
    background: #fff;
    margin-bottom: 85px;
  `,

  Table: styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
    min-width: 720px;

    thead {
      background-color: #ecf0f1;
    }

    th, td {
      padding: 14px 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      vertical-align: middle;
      color: #2c3e50;
    }

    th {
      font-weight: 700;
    }

    tr:hover {
      background-color: #f5f9fc;
    }

    td:last-child {
      display: flex;
      gap: 12px;
    }
  `,

  EmptyMessage: styled.p`
    padding: 24px;
    text-align: center;
    color: #7f8c8d;
    font-size: 16px;
    font-style: italic;
  `,

  ActionButton: styled.button`
    background: ${({ danger }) => (danger ? "#e74c3c" : "#3498db")};
    color: white;
    border: none;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.25s ease;

    &:hover {
      background-color: ${({ danger }) => (danger ? "#c0392b" : "#2980b9")};
    }

    svg {
      font-size: 16px;
    }
  `,

  ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  ModalBox: styled.div`
    background: white;
    padding: 2rem;
    border-radius: 10px;
    max-width: 400px;
    text-align: center;

    h3 {
      margin: 0 0 1rem;
    }

    p {
      margin-bottom: 1.5rem;
    }
  `,

  ModalActions: styled.div`
    display: flex;
    justify-content: space-around;

    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }

    button:first-child {
      background: #ccc;
    }

    button:last-child {
      background: #e74c3c;
      color: white;
    }
  `,
};
