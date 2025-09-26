import { useEffect, useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import styled, { ThemeProvider } from "styled-components";
import { getTransactionsByMonth } from '../services/transacao';
import { getCategory } from '../services/category';
import { FaPlus, FaArrowUp, FaArrowDown, FaCreditCard, FaPiggyBank, FaBalanceScale, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';

const theme = {
  colors: {
    primary: '#6a11cb',
    secondary: '#2575fc',
    background: '#f4f7f9',
    cardBackground: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    success: '#2ecc71',
    error: '#e74c3c',
    warning: '#f39c12',
    info: '#3498db',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '12px',
};

export default function Home() {
  const [mesSelecionado, setMesSelecionado] = useState(() => String(new Date().getMonth() + 1));
  const [transacoes, setTransacoes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openSelect, setOpenSelect] = useState(false);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);

  const meses = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('pt-BR', { month: 'long' })
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const anoAtual = new Date().getFullYear();
        const periodo = `${anoAtual}-${String(mesSelecionado).padStart(2, '0')}`;

        const [transRes, catRes] = await Promise.all([
          getTransactionsByMonth(periodo),
          getCategory()
        ]);

        setTransacoes(transRes.data);
        setCategories(catRes.data.filter(cat => cat.nome !== 'CORREÇÃO'));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mesSelecionado]);

  const gerarRelatorio = async () => {
    setLoadingRelatorio(true);
    try {
      const anoAtual = new Date().getFullYear();
      const periodo = `${anoAtual}-${String(mesSelecionado).padStart(2, '0')}`;

      // enviar transacoes no corpo
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/relatorio/${periodo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // mudar pra JSON
          'Authorization': '@senhas12',
        },
        body: JSON.stringify({ transacoes }) // enviar as transações que estão no estado
      });

      if (!response.ok) throw new Error('Erro ao gerar relatório');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${periodo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    } finally {
      setLoadingRelatorio(false);
    }
  };

  const handleMonthSelect = (index) => {
    setMesSelecionado(index + 1);
    setOpenSelect(false);
  };

  const { totalGanho, totalGasto, saldo } = useMemo(() => {
    let ganho = 0;
    let gasto = 0;
    transacoes.forEach(t => {
      const valor = parseFloat(t.valor);
      if (t.tipo === "ENTRADA") ganho += valor;
      else if (t.tipo === "SAIDA") gasto += valor;
    });
    return { totalGanho: ganho, totalGasto: gasto, saldo: ganho - gasto };
  }, [transacoes]);

  const { faturaAtual, caixinha, periodoFatura } = useMemo(() => {
    const today = new Date();
    const ano = today.getFullYear();
    const mesNum = parseInt(mesSelecionado, 10);

    const inicio = today.getDate() >= 12
      ? new Date(ano, mesNum - 1, 12)
      : new Date(ano, mesNum - 2, 12);
    const fim = today.getDate() >= 12
      ? new Date(ano, mesNum, 11)
      : new Date(ano, mesNum - 1, 11);

    let fatura = 0;
    let caixinhaTotal = 0;

    transacoes.forEach(t => {
      const valor = parseFloat(t.valor);
      const data = new Date(t.data);
      if (t.tipo === "SAIDA") {
        if (t.formaPagamento === "CREDITO" && data >= inicio && data <= fim) {
          fatura += valor;
        }
        if (t.categoria.nome === "Caixinha") {
          caixinhaTotal += valor;
        }
      }
    });

    return {
      faturaAtual: fatura,
      caixinha: caixinhaTotal,
      periodoFatura: { inicio, fim }
    };
  }, [transacoes, mesSelecionado]);

  const gastosPorCategoria = useMemo(() => {
    const porCategoria = {};
    transacoes.forEach(t => {
      if (t.tipo === "SAIDA") {
        const categoriaId = t.categoriaId;
        if (!porCategoria[categoriaId]) {
          porCategoria[categoriaId] = {
            ...categories.find(c => c.id === categoriaId),
            total: 0,
            transacoes: []
          };
        }
        porCategoria[categoriaId].total += parseFloat(t.valor);
        porCategoria[categoriaId].transacoes.push(t);
      }
    });
    return Object.values(porCategoria)
      .filter(cat => cat.id && cat.nome)
      .sort((a, b) => b.total - a.total);
  }, [transacoes, categories]);

  const toggleCategoria = (id) => setCategoriasExpandidas(p => ({ ...p, [id]: !p[id] }));
  const formatCurrency = (value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <ThemeProvider theme={theme}>
      <MainLayout>
        <Styled.Header>
          <div>
            <Styled.Title> <FaHome /> Resumo</Styled.Title>
            <Styled.Subtitle>Resumo financeiro do seu mês</Styled.Subtitle>
          </div>
          <Styled.ButtonsWrapper>
            <div style={{ position: 'relative' }}>
              <Styled.MonthButton onClick={() => setOpenSelect(!openSelect)}>
                <FaCalendarAlt style={{ marginRight: '8px' }} />
                {meses[mesSelecionado - 1]}
              </Styled.MonthButton>

              {openSelect && (
                <Styled.MonthDropdown>
                  {meses.map((mes, index) => (
                    <Styled.MonthOption key={index} onClick={() => handleMonthSelect(index)}>
                      {mes}
                    </Styled.MonthOption>
                  ))}
                </Styled.MonthDropdown>
              )}
            </div>

            <Styled.RelatorioButton onClick={gerarRelatorio} disabled={loadingRelatorio}>
              {loadingRelatorio ? (
                <span className="spinner"></span>
              ) : (
                <FaFileAlt />
              )}
            </Styled.RelatorioButton>
          </Styled.ButtonsWrapper>
        </Styled.Header>

        {isLoading ? <p>Carregando...</p> : (
          <>
            <Styled.SummaryGrid>
              <Styled.SummaryCard color={theme.colors.success}>
                <FaArrowUp />
                <div>
                  <h4>Entradas</h4>
                  <p>{formatCurrency(totalGanho)}</p>
                </div>
              </Styled.SummaryCard>
              <Styled.SummaryCard color={theme.colors.error}>
                <FaArrowDown />
                <div>
                  <h4>Saídas</h4>
                  <p>{formatCurrency(totalGasto)}</p>
                </div>
              </Styled.SummaryCard>
              <Styled.SummaryCard color={theme.colors.info}>
                <FaBalanceScale />
                <div>
                  <h4>Saldo</h4>
                  <p>{formatCurrency(saldo)}</p>
                </div>
              </Styled.SummaryCard>
              <Styled.SummaryCard color={theme.colors.primary}>
                <FaCreditCard />
                <div>
                  <h4>Fatura Atual</h4>
                  <p>{formatCurrency(faturaAtual)}</p>
                </div>
              </Styled.SummaryCard>
              <Styled.SummaryCard color={theme.colors.warning}>
                <FaPiggyBank />
                <div>
                  <h4>Reservas</h4>
                  <p>{formatCurrency(caixinha)}</p>
                </div>
              </Styled.SummaryCard>
            </Styled.SummaryGrid>

            <Styled.SectionTitle>Gastos por Categoria</Styled.SectionTitle>
            <Styled.CategoryGrid>
              {gastosPorCategoria.map(cat => (
                <Styled.CategoriaCard key={cat.id} onClick={() => toggleCategoria(cat.id)}>
                  <Styled.CategoriaHeader>
                    {cat.icone && <img src={`${import.meta.env.VITE_BASE_URL}${cat.icone}`} alt={cat.nome} />}
                    <h3>{cat.nome}</h3>
                  </Styled.CategoriaHeader>
                  <p>{formatCurrency(cat.total)}</p>
                  <Styled.ProgressBar>
                    <Styled.Progress percent={(cat.total / totalGasto) * 100} color={cat.cor || theme.colors.secondary} />
                  </Styled.ProgressBar>

                  {categoriasExpandidas[cat.id] && (
                    <Styled.Detalhes>
                      {cat.transacoes.map(t => (
                        <Styled.Descricao key={t.id}>
                          <span>{t.descricao || 'Sem descrição'}</span>
                          <span>{formatCurrency(parseFloat(t.valor))}</span>
                        </Styled.Descricao>
                      ))}
                    </Styled.Detalhes>
                  )}
                </Styled.CategoriaCard>
              ))}
            </Styled.CategoryGrid>
          </>
        )}
        <Styled.FAB>
          <FaPlus />
        </Styled.FAB>
      </MainLayout>
    </ThemeProvider>
  );
}

const Styled = {
  Header: styled.header`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.large};
    flex-wrap: wrap;
  `,

  Title: styled.h1`
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  `,

  Subtitle: styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  `,

  SummaryGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.medium};
    margin-bottom: ${({ theme }) => theme.spacing.large};
  `,

  SummaryCard: styled.div`
    background: ${({ theme }) => theme.colors.cardBackground};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ theme }) => theme.spacing.medium};
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.medium};
    border-left: 5px solid ${props => props.color};

    svg {
      font-size: 1.8rem;
      color: ${props => props.color};
    }

    h4 {
      margin: 0 0 4px;
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.textSecondary};
    }

    p {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
    }
  `,

  SectionTitle: styled.h2`
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    margin-top: ${({ theme }) => theme.spacing.large};
    border-bottom: 1px solid #eee;
    padding-bottom: ${({ theme }) => theme.spacing.small};
  `,

  CategoryGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.medium};
  `,

  CategoriaCard: styled.div`
    background: ${({ theme }) => theme.colors.cardBackground};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ theme }) => theme.spacing.medium};
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    p {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      margin: ${({ theme }) => theme.spacing.small} 0;
      text-align: right;
    }
  `,

  CategoriaHeader: styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.small};
    margin-bottom: ${({ theme }) => theme.spacing.small};

    img {
      width: 32px;
      height: 32px;
    }

    h3 {
      margin: 0;
      font-size: 1.1rem;
      color: ${({ theme }) => theme.colors.text};
    }
  `,

  ProgressBar: styled.div`
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-top: ${({ theme }) => theme.spacing.medium};
  `,

  Progress: styled.div`
    width: ${props => props.percent}%;
    height: 100%;
    background-color: ${props => props.color};
    border-radius: 3px;
    transition: width 0.5s ease-in-out;
  `,

  Detalhes: styled.div`
    margin-top: ${({ theme }) => theme.spacing.medium};
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
  `,

  Descricao: styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: ${({ theme }) => theme.spacing.small} 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  `,

  FAB: styled.button`
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(45deg, ${({ theme }) => theme.colors.secondary}, ${({ theme }) => theme.colors.primary});
    color: white;
    border: none;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  `,

  ButtonsWrapper: styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.small};
    align-items: center;
  `,

  MonthButton: styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0.6rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid #ddd;
    background-color: ${({ theme }) => theme.colors.cardBackground};
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
  `,

  MonthDropdown: styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background: ${({ theme }) => theme.colors.cardBackground};
    border: 1px solid #ddd;
    border-radius: ${({ theme }) => theme.borderRadius};
    margin-top: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 10;
    width: max-content;
    min-width: 150px;
  `,

  MonthOption: styled.div`
    padding: 0.5rem 1rem;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }
  `,

  RelatorioButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 0.6rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: none;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
};