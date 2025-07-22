import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";

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
      <Styled.Content>
        {/* Seção principal */}
        <Styled.Section>
          <Styled.TextContent>
            <Styled.Title>
              Guarde. <span className="green">Economize</span>. Controle suas finanças com <Styled.Span>Rupia Wallet</Styled.Span>
            </Styled.Title>
            <Styled.Text>
              Plataforma completa para controle financeiro. Ideal para empresas e profissionais que buscam eficiência e clareza.
            </Styled.Text>
          </Styled.TextContent>

          <Styled.Image>
            <img src="./background.png" alt="Imagem ilustrativa do sistema" />
          </Styled.Image>
        </Styled.Section>

        {/* Sobre o sistema */}
        <Styled.Section vertical>
          <Styled.Title>Sobre o <Styled.Span>Sistema</Styled.Span></Styled.Title>
          <Styled.Text>
            O Rupia Wallet foi desenvolvido para facilitar a gestão financeira de pessoas físicas e jurídicas.
            Com ele, você pode acompanhar entradas e saídas, categorizar transações, gerar relatórios e visualizar o desempenho financeiro com total clareza e praticidade.
          </Styled.Text>
        </Styled.Section>

        {/* Sobre nós */}
        <Styled.Section vertical>
          <Styled.Title>Sobre a <Styled.Span>Tecnomaub</Styled.Span></Styled.Title>
          <Styled.Text>
            A Tecnomaub é uma empresa focada em soluções digitais personalizadas. Nosso compromisso é criar experiências eficientes,
            intuitivas e seguras para transformar a forma como você interage com a tecnologia.
            Atuamos com desenvolvimento full stack, automação e consultoria especializada para empresas que buscam inovação com solidez.
          </Styled.Text>
        </Styled.Section>
      </Styled.Content>
    </MainLayout>
  );
}

const Styled = {
  Content: styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
  `,

  Section: styled.section`
    display: flex;
    flex-direction: ${({ vertical }) => (vertical ? "column" : "row")};
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 4rem;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  `,

  Title: styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 1rem;

    .green {
      color: #02f065;
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  `,

  Text: styled.p`
    font-size: 1.15rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text};
    max-width: 800px;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  `,

  Span: styled.span`
    color: ${({ theme }) => theme.colors.span};
  `,

  TextContent: styled.div`
    flex: 1;
  `,

  Image: styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 400px;
      height: auto;
      object-fit: contain;
    }

    @media (max-width: 768px) {
      img {
        max-width: 220px;
      }
    }
  `,
};
