import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled, { keyframes } from "styled-components";

export default function Home() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const storedUser = localStorage.getItem("userData");
        if (!storedUser) return;
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser.user);
      } catch (err) {
        console.error("Erro ao carregar resumo:", err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <MainLayout>
      <Styled.AboutSection>
        <Styled.Content>
          <h1>
            Guarde. <span className="green">Economize</span>. Controle suas finanças com <Styled.Span>Rupia Wallet</Styled.Span>
          </h1>
          <Styled.Text>
            Plataforma completa para controle financeiro.
            Ideal para empresas e profissionais que buscam eficiência e clareza.
          </Styled.Text>
        </Styled.Content>

        <Styled.Image>
          <img
            src="./background.png"
            alt="Corrida de apostas"
          />
        </Styled.Image>
      </Styled.AboutSection>
    </MainLayout>
  );
}

const Styled = {
  ContentWrapper: styled.section`
    text-align: center;
    margin-top: 3rem;
    color: #222;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `,

  MainTitle: styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 2rem;
  `,

  InfoText: styled.p`
    color: #555;
    font-size: 1.15rem;
    margin: 0.7rem 0;
  `,
  
  Span: styled.span`
    color: ${({ theme }) => theme.colors.span};
  `,

  AboutSection: styled.section`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4rem 2rem;
    background: transparent;
    flex-wrap: nowrap;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      padding: 2rem 1rem;
      flex-wrap: nowrap;
      align-items: center;
    }
  `,

  Image: styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    img {
      max-width: 400px;
      max-height: 300px;
      width: 100%;
      height: auto;
      object-fit: contain;
    }

    @media (max-width: 768px) {
      order: 0;
      max-width: 100%;
      margin-bottom: 1.5rem;

      img {
        max-width: 115px;
        width: 100%;
        height: auto;
        object-fit: contain;
      }
    }
  `,

  Content: styled.div`
    flex: 1;
    max-width: 700px;
    margin: 0 auto;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      color: white;

      .green {
        color: #02f065ff;
      }
    }

    @media (max-width: 768px) {
      order: 1;
      max-width: 100%;
      padding: 0 1rem;
      text-align: center;

      h1 {
        font-size: 2rem;
      }
    }
  `,
  
  Text: styled.p`
    font-size: 1.1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    text-align: left;

    @media (max-width: 768px) {
      text-align: center;
      font-size: 1rem;
    }
  `,

  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  `,
};