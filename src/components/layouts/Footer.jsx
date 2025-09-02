import { styled } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaPlusCircle, FaChartPie, FaFileExcel } from "react-icons/fa";
import { useState } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <Styled.FooterContainer>
      <Styled.FooterButton onClick={() => navigate("/buscar")} $active={isActive("/buscar")}>
        <FaSearch />
        <Styled.Label>Buscar</Styled.Label>
      </Styled.FooterButton>

      <Styled.FooterButton onClick={() => setShowModal(true)} $active={isActive("/inserir")}>
        <FaPlusCircle />
        <Styled.Label>Inserir</Styled.Label>
      </Styled.FooterButton>

      <Styled.FooterButton onClick={() => navigate("/dashboards")} $active={isActive("/dashboards")}>
        <FaChartPie />
        <Styled.Label>Gráficos</Styled.Label>
      </Styled.FooterButton>

      <Styled.FooterButton onClick={() => navigate("/excel")} $active={isActive("/excel")}>
        <FaFileExcel />
        <Styled.Label>Excel</Styled.Label>
      </Styled.FooterButton>

      {showModal && (
        <Styled.ModalOverlay onClick={() => setShowModal(false)}>
          <Styled.ModalContent onClick={(e) => e.stopPropagation()}>
            <Styled.ModalOption onClick={() => { setShowModal(false); navigate("/inserir/transacoes"); }}>
              Transação
            </Styled.ModalOption>
            <Styled.ModalOption onClick={() => { setShowModal(false); navigate("/inserir/categorias"); }}>
              Categoria
            </Styled.ModalOption>
          </Styled.ModalContent>
        </Styled.ModalOverlay>
      )}
    </Styled.FooterContainer>
  );
}

const Styled = {
  FooterContainer: styled.footer`
    position: fixed;
    bottom: -1px;
    width: 100%;
    height: 85px;
    background-color: #1b1b1b;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 1rem;
    border-top: 1px solid #333;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
    z-index: 100;
  `,

  FooterButton: styled.button`
    background: ${({ $active }) =>
      $active ? "rgba(255, 255, 255, 0.08)" : "transparent"};
    border: none;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 12px;
    backdrop-filter: ${({ $active }) => ($active ? "blur(6px)" : "none")};
    box-shadow: ${({ $active }) =>
      $active ? "0 2px 8px rgba(0,0,0,0.4)" : "none"};
    transition: all 0.2s ease-in-out;
  `,

  Label: styled.span`
    font-size: 0.7rem;
    margin-top: 2px;
  `,

  ModalOverlay: styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  ModalContent: styled.div`
    background: #2c2c2c;
    padding: 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 240px;
    color: white;
  `,

  ModalOption: styled.button`
    background: #444;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #666;
    }
  `,
};