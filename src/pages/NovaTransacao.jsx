import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { newTransaction } from '../services/transacao';
import { getCategory, newCategory } from '../services/category';
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
  const [categoryData, setCategoryData] = useState({ tipo: "", nome: "", cor: "#000000", icone: "" }); 
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const [rawValor, setRawValor] = useState("");
  const [chooseModalInsert, setChooseModalInsert] = useState(1);

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
  
		if (chooseModalInsert === 1) fetchCategorias();
  }, [chooseModalInsert]);

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
	
	const handleImageChange = (event) => {
		const file = event.target.files[0];
	
		if (file) {
			const img = new Image();
			const reader = new FileReader();
	
			reader.onloadend = () => {
				img.onload = () => {
					if (img.width > 500 || img.height > 500) {
						setModal({
							show: true,
							type: "error",
							message: "A imagem deve ter no máximo 500x500 pixels.",
						});
					} else {
						setCategoryData(prev => ({ ...prev, icone: reader.result }));
					}
				};
				img.src = reader.result;
			};
	
			reader.readAsDataURL(file);
		}
	};

	const handleSubmitCategory = async (e) => {
		e.preventDefault(); 
		setLoading(true);
	
		try {
			const response = await newCategory(categoryData);
			setModal({
				show: true,
				type: "success",
				message: response.data.message,
			});
	
			const updated = await getCategory();
			setCategorias(updated.data);
	
			clearFields();
		} catch (error) {
			const mensagemErro = error?.response?.data?.message || "Erro ao conectar com o servidor. categoria";
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
		setCategoryData({
      tipo: "",
      nome: "",
			icone: "",
			cor: "#000000"
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
			<Styled.ScrollContainer>
				<Styled.TitleAndSelect>
					<Styled.Title>
						{chooseModalInsert === 1 ? "Nova Transação" : "Nova Categoria"}
					</Styled.Title>
					<Styled.Select
						value={chooseModalInsert}
						onChange={(e) => setChooseModalInsert(Number(e.target.value))}
					>
						<option value={1}>Transação</option>
						<option value={2}>Categoria</option>
					</Styled.Select>
				</Styled.TitleAndSelect>

				{ chooseModalInsert === 1 ? (
					<>
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
					</>
				) : (
						<>
							<Styled.Form onSubmit={handleSubmitCategory}> 
								<Styled.Select name="tipo" value={categoryData.tipo} onChange={(e) => setCategoryData({ ...categoryData, tipo: e.target.value })} required>
									<option value="" disabled>Selecione o tipo</option>
									<option value="gasto">GASTO</option>
									<option value="ganho">GANHO</option>
								</Styled.Select>
								

								<Styled.Input
									name="nome"
									placeholder="Nome"
									value={categoryData.nome}
									onChange={(e) => setCategoryData({ ...categoryData, nome: e.target.value })}
									required
								/>
									
								<Styled.Input
									type="file"
									name="icone"
									accept="image/*"
									onChange={handleImageChange}
								/>

								<Styled.FieldGroup>
									<Styled.Label>Cor:</Styled.Label>
									<Styled.ColorInput
										type="color"
										name="cor"
										value={categoryData.cor}
										onChange={(e) => setCategoryData({ ...categoryData, cor: e.target.value })}
									/>
									<Styled.ColorCode>{categoryData.cor}</Styled.ColorCode>
								</Styled.FieldGroup>

								<Styled.Button type="submit">Salvar</Styled.Button>

							</Styled.Form>
							<CustomModal
								show={modal.show}
								type={modal.type}
								message={modal.message}
								onHide={() => setModal({ ...modal, show: false })}
								/>
						</>
				)}
      </Styled.ScrollContainer>
    </MainLayout>
  );
}

const Styled = {
	ScrollContainer: styled.div`
		max-height: calc(100vh - 100px); /* ajusta 100px conforme altura do header/footer */
		overflow-y: auto;
		padding: 1rem;
		margin-bottom: 3rem;
	`,
		
	TitleAndSelect: styled.div`
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
		gap: 1rem;
		flex-wrap: wrap;
	`,

	FieldGroup: styled.div`
		display: flex;
		align-items: center;
		gap: 1rem;
	`,

	Label: styled.label`
		font-size: 1rem;
		font-weight: 500;
		color: #333;
	`,

	ColorInput: styled.input`
		width: 40px;
		height: 40px;
		border: none;
		padding: 0;
		background: none;
		cursor: pointer;
	`,

	ColorCode: styled.span`
		font-size: 0.95rem;
		color: #555;
		font-family: monospace;
	`,

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
