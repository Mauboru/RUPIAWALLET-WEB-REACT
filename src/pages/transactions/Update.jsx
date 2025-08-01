import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import styled from "styled-components";
import { updateTransaction, getTransactionById } from '../../services/transacao';
import { getCategory } from '../../services/category';
import { CustomModal } from "../../components";
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";

export default function Update() {
  const [data, setData] = useState({
    tipo: "",
    categoriaId: "",
    descricao: "",
    valor: "",
    data: "",
    formaPagamento: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const [rawValor, setRawValor] = useState("");
  const { id } = useParams();
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const response = await getCategory();
        setCategorias(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      try {
        const response = await getTransactionById(id);
        const t = response.data;
        const valorFormatado = (() => {
          if (t.valor == null) return "";
          const str = (t.valor * 100).toString().padStart(3, "0");
          const cents = str.slice(-2);
          const reais = str.slice(0, -2);
          return Number(reais).toLocaleString("pt-BR") + "," + cents;
        })();

        setRawValor((t.valor * 100).toString());
        setData({ ...t, valor: valorFormatado });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCurrencyChange = (e) => {
    let onlyDigits = e.target.value.replace(/\D/g, "");

    if (onlyDigits === "") {
      setRawValor("");
      setData(prev => ({ ...prev, valor: "" }));
      return;
    }

    onlyDigits = onlyDigits.padStart(3, "0");

    const cents = onlyDigits.slice(-2);
    const reais = onlyDigits.slice(0, -2) || "0";
    const formatted = Number(reais).toLocaleString('pt-BR') + "," + cents;

    setRawValor(onlyDigits);
    setData(prev => ({ ...prev, valor: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const valorNumerico = parseFloat(rawValor) / 100;
      const response = await updateTransaction(id, { ...data, valor: valorNumerico });
      setModal({
        show: true,
        type: "success",
        message: response.data.message || "Transação atualizada com sucesso.",
      });
    } catch (error) {
      const mensagemErro = error?.response?.data?.message || "Erro ao conectar com o servidor.";
      setModal({
        show: true,
        type: "error",
        message: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
			<Styled.ScrollContainer>
        <Styled.Title>
          Transação <FaEdit style={{ marginLeft: 6, fontSize: "0.8rem" }} />
        </Styled.Title>
        <Styled.Form onSubmit={handleSubmit}>

          <Styled.Input
            name="data"
            type="date"
            value={data.data}
            onChange={handleChange}
            required
          />

          <Styled.Select name="tipo" value={data.tipo} onChange={handleChange} required>
            <option value="" disabled>Selecione o tipo</option>
            <option value="ENTRADA">ENTRADA</option>
            <option value="SAIDA">SAÍDA</option>
          </Styled.Select>

          <Styled.Select name="formaPagamento" value={data.formaPagamento} onChange={handleChange} required>
            <option value="" disabled>Selecione a forma de pagamento</option>
            <option value="DINHEIRO">DINHEIRO</option>
            <option value="PIX">PIX</option>
            <option value="CREDITO">CRÉDITO</option>
            <option value="DEBITO">DÉBITO</option>
          </Styled.Select>

          <Styled.Select name="categoriaId" value={data.categoriaId} onChange={handleChange} required>
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </Styled.Select>

          <Styled.Input
            name="descricao"
            placeholder="Descrição"
            value={data.descricao}
            onChange={handleChange}
            required
          />

          <Styled.Input
            name="valor"
            type="text"
            placeholder="Valor"
            value={data.valor}
            onChange={handleCurrencyChange}
            required
          />

          <Styled.Button type="submit" disabled={loading}>Salvar</Styled.Button>
          <Styled.Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </Styled.Button>
        </Styled.Form>

        <CustomModal
          show={modal.show}
          type={modal.type}
          message={modal.message}
          onHide={() => setModal({ ...modal, show: false })}
        />
      </Styled.ScrollContainer>
    </MainLayout>
  );
}

const Styled = {
  ScrollContainer: styled.div`
    overflow-y: auto;
    padding: 1rem;
    margin-bottom: 3rem;
  `,
  
  Title: styled.h2`
    text-align: center;
    margin-bottom: 2rem;
	  color: ${({ theme }) => theme.colors.text};
    font-size: 2rem;
  `,

  Form: styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
  `,

  Input: styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    -webkit-appearance: none;
  `,

  Select: styled.select`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  `,

  Button: styled.button`
    padding: 0.9rem;
    background-color: ${({ variant }) => variant === 'secondary' ? '#6c757d' : '#007bff'};
    color: white;
    border: none;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: ${({ variant }) => variant === 'secondary' ? '#5a6268' : '#0056b3'};
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
};