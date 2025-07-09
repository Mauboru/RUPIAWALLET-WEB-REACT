import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";
import { getCategoryById, updateCategory } from '../services/category';
import { CustomModal } from "../components";
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

export default function EditarCategoria() {
  const [categoryData, setCategoryData] = useState({ tipo: "", nome: "", cor: "#000000", icone: "" });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await getCategoryById(id); // Fetch category by ID
        setCategoryData(response.data);
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
    if (id) { // Only fetch if ID is available
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
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
            setCategoryData(prev => ({ ...prev, icone: reader.result }));
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
      const response = await updateCategory(id, categoryData); // Update category
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
    
  const getImageSource = (iconData) => {
    // Check if the iconData is a base64 string (starts with data:image/)
    if (iconData && iconData.startsWith('data:image/')) {
        return iconData;
    }
    // Otherwise, assume it's a URL path from the server
    return iconData ? `${import.meta.env.VITE_BASE_URL}${iconData}` : '';
  };

  return (
    <MainLayout>
      <Styled.Title>Editar Categoria</Styled.Title>
      <Styled.Form onSubmit={handleSubmit}>
        <Styled.Select name="tipo" value={categoryData.tipo} onChange={handleChange} required>
          <option value="" disabled>Selecione o tipo</option>
          <option value="gasto">GASTO</option>
          <option value="ganho">GANHO</option>
        </Styled.Select>

        <Styled.Input
          name="nome"
          placeholder="Nome"
          value={categoryData.nome}
          onChange={handleChange}
          required
        />

        <Styled.Input
          type="file"
          name="icone"
          accept="image/*"
          onChange={handleImageChange}
        />
        
        {categoryData.icone && (
          <Styled.ImagePreview
            src={getImageSource(categoryData.icone)}
            alt="Ícone da categoria"
          />
        )}

        <Styled.FieldGroup>
          <Styled.Label>Cor:</Styled.Label>
          <Styled.ColorInput
            type="color"
            name="cor"
            value={categoryData.cor}
            onChange={handleChange}
          />
          <Styled.ColorCode>{categoryData.cor}</Styled.ColorCode>
        </Styled.FieldGroup>

        <Styled.Button type="submit" disabled={loading}>Salvar</Styled.Button>
        <Styled.Button type="button" onClick={() => navigate(-1)} disabled={loading} style={{ backgroundColor: '#999', marginTop: '8px' }}>
          Cancelar
        </Styled.Button>
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
    max-width: 600px;
    margin: 0 auto;
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

  Button: styled.button`
    padding: 0.9rem;
    background-color: #007bff;
    color: white;
    border: none;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;

    &:hover:enabled {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
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
  ImagePreview: styled.img`
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 5px;
  `,
};