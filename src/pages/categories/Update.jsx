import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import styled from "styled-components";
import { getCategoryById, updateCategory } from '../../services/category';
import { CustomModal } from "../../components";
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";

export default function Update() {
  const [data, setData] = useState({ tipo: "", nome: "", cor: "#000000", icone: "" });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await getCategoryById(id); 
        setData(response.data);
      } catch (error) {
        console.error(error);
        setModal({
          show: true,
          type: "error",
          message: error?.response?.data?.message || "Erro ao carregar a categoria.",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
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
            setData(prev => ({ ...prev, icone: reader.result }));
          }
        };
        img.src = reader.result;
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateCategory(id, data); 
      setModal({
        show: true,
        type: "success",
        message: response.data.message || "Categoria atualizada com sucesso.",
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
        <Styled.Title>Categoria <FaEdit style={{ marginLeft: 6, fontSize: "0.8rem" }} /></Styled.Title>

        <Styled.Form onSubmit={handleSubmit}>
          <Styled.Select name="tipo" value={data.tipo} onChange={handleChange} required>
            <option value="" disabled>Selecione o tipo</option>
            <option value="gasto">GASTO</option>
            <option value="ganho">GANHO</option>
          </Styled.Select>

          <Styled.Input
            name="nome"
            placeholder="Nome"
            value={data.nome}
            onChange={handleChange}
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
                src={data.icone.startsWith("data:") ? data.icone : `${import.meta.env.VITE_BASE_URL}${data.icone}`}
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

          <Styled.Button type="submit" disabled={loading}>Salvar</Styled.Button>
          <Styled.Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={loading}>Cancelar</Styled.Button>
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
  
	Title: styled.h2`
		text-align: center;
		margin-bottom: 2rem;
		color: ${({ theme }) => theme.colors.text};
		font-size: 2rem;
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

  FieldGroup: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
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