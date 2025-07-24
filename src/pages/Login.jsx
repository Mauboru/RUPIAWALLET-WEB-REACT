import { useState, useEffect, useMemo } from "react";
import logo from "/background.png";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import styled from 'styled-components';
import { CustomModal, PasswordInput, CustomInput, CustomButton, CustomLink } from "../components";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const moneyElements = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => (
      <img
        key={i}
        src="/money.png"
        className="money"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${3 + Math.random() * 3}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ));
  }, []);
  
  const submitDataLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/");
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
    <Styled.Container>
      <Styled.MoneyRain>
        {moneyElements}
      </Styled.MoneyRain>

      <Styled.FormWrapper>
        <Styled.Logo src={logo} alt="logo" />
        <Styled.Title>Rupia <Styled.Span>Wallet</Styled.Span></Styled.Title>
        <form onSubmit={submitDataLogin}>
          <CustomInput
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <CustomLink href="/reset-password">Esqueci minha senha!</CustomLink>
          <hr className="my-4 border-light" />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CustomButton type="submit" loading={loading} disabled={!email || !password}>
              Login
            </CustomButton>
          </div>
          <CustomLink href="/register">Não tem cadastro? Registre-se aqui!</CustomLink>
        </form>
        <CustomModal
          show={modal.show}
          type={modal.type}
          message={modal.message}
          onHide={() => setModal({ ...modal, show: false })}
        />
      </Styled.FormWrapper>
    </Styled.Container>
  );
}

const Styled = {
  Container: styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.primaryTransparent1};
  `,

  Title: styled.h1`
    font-size: 2.3rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 40px;
  `,

  Span: styled.span`
    color: ${({ theme }) => theme.colors.primaryDark};
  `,

  Logo: styled.img`
    max-width: 180px;
    margin-bottom: 32px;
  `,

  FormWrapper: styled.div`
    width: 100%;
    max-width: 400px;
    background: ${({ theme }) => theme.colors.primaryTransparent2};
    padding: 32px 24px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;

    form {
      width: 100%;
    }

    hr {
      border: none;
      border-top: 1px solid #ccc;
      margin: 16px 0;
    }
  `,

  MoneyRain: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;

    .money {
      position: absolute;
      top: -100px;
      width: 30px;
      height: auto;
      animation: fall linear infinite;
      opacity: 0.8;
    }

    @keyframes fall {
      0% {
        transform: translateY(-100px) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      100% {
        transform: translateY(110vh) rotate(360deg);
        opacity: 0;
      }
    }
  `,
};