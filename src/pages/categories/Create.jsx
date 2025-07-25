import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import styled from "styled-components";
import { getCategory, newCategory } from '../../services/category';
import { CustomModal } from "../../components";
import { FaPlus } from "react-icons/fa";

export default function Create() {
  const [data, setData] = useState({ tipo: "", nome: "", cor: "#000000", icone: "" }); 
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });

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
						setData(prev => ({ ...prev, icone: reader.result }));
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
			const response = await newCategory(data);
			setModal({
				show: true,
				type: "success",
				message: response.data.message,
			});
	
			const updated = await getCategory();
			setCategorias(updated.data);
	
			clearFields();
		} catch (error) {
			console.log(error)
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
      nome: "",
			icone: "",
			cor: "#000000"
    });
  };

  return (
		<MainLayout>
			<Styled.ScrollContainer>
				<Styled.Title>
					Categoria <FaPlus style={{ marginLeft: 6, fontSize: "0.8rem" }} />
				</Styled.Title>
				<Styled.Form onSubmit={handleSubmitCategory}> 
					<Styled.Select name="tipo" value={data.tipo} onChange={(e) => setData({ ...data, tipo: e.target.value })} required>
						<option value="" disabled>Selecione o tipo</option>
						<option value="gasto">GASTO</option>
						<option value="ganho">GANHO</option>
					</Styled.Select>
					

					<Styled.Input
						name="nome"
						placeholder="Nome"
						value={data.nome}
						onChange={(e) => setData({ ...data, nome: e.target.value })}
						required
					/>
						
					<Styled.FileImageWrapper>
						<Styled.Input
							type="file"
							name="icone"
							accept="image/*"
							onChange={handleImageChange}
						/>

						{data.icone && (
							<Styled.ImagePreview
								src={data.icone}
								alt="Ícone da categoria"
							/>
						)}
					</Styled.FileImageWrapper>

					<Styled.FieldGroup>
						<Styled.ColorInput
							type="color"
							name="cor"
							value={data.cor}
							onChange={(e) => setData({ ...data, cor: e.target.value })}
						/>
					</Styled.FieldGroup>

					<Styled.Button type="submit">Salvar</Styled.Button>

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
	FileImageWrapper: styled.div`
		display: flex;
		align-items: center;
		gap: 1rem;
	`,

	ScrollContainer: styled.div`
		overflow-y: auto;
		padding: 1rem;
		margin-bottom: 3rem;
	`,

	FieldGroup: styled.div`
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
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
	`,

	Select: styled.select`
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 8px;
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
	`,

	Input: styled.input`
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		font-size: 1rem;
		background-color: white;
		width: 100%;

		&::file-selector-button {
			background-color: #007bff;
			color: white;
			border: none;
			padding: 0.5rem 1rem;
			border-radius: 6px;
			cursor: pointer;
			margin-right: 1rem;
		}
	`,

	ColorInput: styled.input`
		appearance: none;
		width: 100%;
		height: 40px;
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 0;
		background-color: white;
		cursor: pointer;

		&::-webkit-color-swatch-wrapper {
			padding: 0;
			border-radius: 8px;
		}

		&::-webkit-color-swatch {
			border: none;
			border-radius: 8px;
		}
	`,

	ImagePreview: styled.img`
		max-width: 80px;
		max-height: 80px;
		object-fit: contain;
		display: block;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 5px;
	`,
};