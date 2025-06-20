import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import axios from "axios";

export default function NovaTransacao() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        tipo: "gasto",
        descricao: "",
        valor: "",
        data: new Date().toISOString().split("T")[0],
        categoriaId: "",
        formaPagamento: "Dinheiro",
        recorrente: false,
        observacoes: ""
    });

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setCategorias([
            { id: 1, nome: "Alimentação" },
            { id: 2, nome: "Transporte" },
            { id: 3, nome: "Educação" }
        ]);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser.user);
        }

        // axios.get("/api/categorias")
        // .then(res => setCategorias(res.data))
        // .catch(err => console.error("Erro ao carregar categorias:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.post("/api/transacoes", {
            ...form,
            valor: parseFloat(form.valor)
        });
        alert("Transação cadastrada com sucesso!");
        setForm({ ...form, descricao: "", valor: "", observacoes: "" });
        } catch (err) {
        console.error("Erro ao cadastrar transação:", err);
        alert("Erro ao salvar.");
        }
    };

    return (
        <MainLayout>
        <Styled.ContentWrapper>
            <Styled.Title>Nova Transação</Styled.Title>
            <Styled.Form onSubmit={handleSubmit}>
            <Styled.Select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="gasto">Gasto</option>
                <option value="ganho">Ganho</option>
            </Styled.Select>

            <Styled.Input
                name="descricao"
                placeholder="Descrição"
                value={form.descricao}
                onChange={handleChange}
                required
            />

            <Styled.Input
                name="valor"
                type="number"
                step="0.01"
                placeholder="Valor"
                value={form.valor}
                onChange={handleChange}
                required
            />

            <Styled.Input
                name="data"
                type="date"
                value={form.data}
                onChange={handleChange}
                required
            />

            <Styled.Select name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
            </Styled.Select>

            <Styled.Input
                name="formaPagamento"
                placeholder="Forma de Pagamento"
                value={form.formaPagamento}
                onChange={handleChange}
                required
            />

            <Styled.CheckboxLabel>
                <input
                type="checkbox"
                name="recorrente"
                checked={form.recorrente}
                onChange={handleChange}
                />
                Recorrente
            </Styled.CheckboxLabel>

            <Styled.Textarea
                name="observacoes"
                placeholder="Observações"
                value={form.observacoes}
                onChange={handleChange}
            />

            <Styled.Button type="submit">Salvar</Styled.Button>
            </Styled.Form>
        </Styled.ContentWrapper>
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
