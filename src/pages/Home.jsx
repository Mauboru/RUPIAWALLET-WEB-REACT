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
      <Styled.ContentWrapper>
        <Styled.MainTitle>Bem-vindo, {user ? user.name : 'Visitante'}!</Styled.MainTitle>
        <Styled.InfoText>Este é um ambiente de demonstração.</Styled.InfoText>
        <Styled.InfoText>Para solicitar acesso completo, entre em contato com o administrador.</Styled.InfoText>
      </Styled.ContentWrapper>
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
};
