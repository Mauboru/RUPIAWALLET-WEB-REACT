import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { newTransaction } from '../services/transacao';
import { getCategory } from '../services/category';
import { CustomModal } from "../components";

export default function NovaTransacao() {
  const [data, setData] = useState({
    tipo: "",
    categoriaId: "",
    descricao: "",
    valor: "",
    data: new Date().toISOString().split("T")[0],
    formaPagamento: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const [rawValor, setRawValor] = useState("");

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const valorNumerico = parseFloat(rawValor) / 100;
      const response = await newTransaction({ ...data, valor: valorNumerico });
      setModal({
        show: true,
        type: "success",
        message: response.data.message,
      });
      clearFields();
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

  const clearFields = () => {
    setData({
      tipo: "",
      categoriaId: "",
      descricao: "",
      valor: "",
      data: new Date().toISOString().split("T")[0], 
      formaPagamento: "",
    });
    setRawValor("");
  };

  const handleCurrencyChange = (e) => {
    let onlyDigits = e.target.value.replace(/\D/g, "");
    
    if (onlyDigits === "") {
      setRawValor("");
      setData(prev => ({ ...prev, valor: "" }));
      return;
    }
  
    onlyDigits = onlyDigits.padStart(2, "0");
    
    const cents = onlyDigits.slice(-2);
    const reais = onlyDigits.slice(0, -2) || "0"; 
    const formatted = Number(reais).toLocaleString('pt-BR') + "," + cents;
    
    setRawValor(onlyDigits);
    setData(prev => ({ ...prev, valor: formatted }));
  };

  return (
    <MainLayout>
      <Styled.Title>Nova Transação</Styled.Title>
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

        <Styled.Button type="submit">Salvar</Styled.Button>
      </Styled.Form>
      <CustomModal
        show={modal.show}
        type={modal.type}
        message={modal.message}
        onHide={() => setModal({ ...modal, show: false })}
      />
    </MainLayout>
  );
}

const Styled = {
  ContentWrapper: styled.div`
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    font-family: 'Segoe UI', sans-serif;
  `,
  Title: styled.h2`
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #333;
  `,
  Form: styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  `,

  Input: styled.input`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  `,
  Select: styled.select`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  `,
  Textarea: styled.textarea`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: vertical;
    font-size: 1rem;
    min-height: 80px;
  `,
  CheckboxLabel: styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
  `,
  Button: styled.button`
    padding: 0.9rem;
    background-color: #007bff;
    color: white;
    border: none;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  `
};
