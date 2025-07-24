import { useState } from "react";
import styled from 'styled-components';
import logo from "/logomarca.png";
import { sendNewPassword } from "../services/auth";
import { CustomModal, CustomButton, PasswordInput, CustomLink } from "../components";
import backgroundImg from "/fundo.png";
import { useParams } from 'react-router-dom';

export default function Create() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleSendNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      console.error("Token não encontrado!");
      return;
		}
		
		if (senha.length < 8) {
			setModal({
				show: true,
				type: "error",
				message: 'A senha deve ter no mínimo 8 caracteres.',
			});	
			setLoading(false);
			return;
		}

		const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
		if (!regexSenha.test(senha)) {
			setModal({
				show: true,
				type: "error",
				message: 'A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial.',
			});	
			setLoading(false);
			return;
		}

    try {
      const response = await sendNewPassword(confirmarSenha, token);
      if (response.status === 200) {
        setModal({
          show: true,
          type: "success",
          message: "Sua senha foi alterada com sucesso!.",
        });
      }
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
    <Styled.ResetPage>
      <Styled.Container>
        <Styled.LeftPanel/>
        
        <Styled.RightPanel>
          <Styled.Logo src={logo} alt="logo" />
					<Styled.Title>Crie sua Nova Senha!</Styled.Title>
					
					<form onSubmit={handleSendNewPassword}>
						<PasswordInput
								label="Senha"
								name="password"
								value={senha}
								onChange={(e) => setSenha(e.target.value)}
								required
						/>

						<PasswordInput
								label="Senha"
								name="password"
								value={confirmarSenha}
								onChange={(e) => setConfirmarSenha(e.target.value)}
								required
						/>

            <hr className="my-4 border-light" />

						<div style={{ display: "flex", justifyContent: "center" }}>
							<CustomButton type="submit" loading={loading} disabled={!senha || senha !== confirmarSenha}>
								Enviar
							</CustomButton>
						</div>

						<CustomLink href="/">Voltar para o Login!</CustomLink>
						
          </form>
        </Styled.RightPanel>
      </Styled.Container>

      <CustomModal
        show={modal.show}
        type={modal.type}
        message={modal.message}
        onHide={() => setModal({ ...modal, show: false })}
      />
    </Styled.ResetPage>
  );
}

const Styled = {
	Title: styled.h1`
		color: white;
		font-size: 2rem;
		margin-bottom: 1rem;
		text-align: center;
	`,
	Container: styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    flex-direction: row;
  `,

  Logo: styled.img`
    max-width: 265px;
    display: block;
    margin: 0 auto 1rem auto;
  `,

  ResetPage: styled.div`
		width: 100%;
		height: 100vh;
		overflow: hidden;
  `,

  LeftPanel: styled.div`
    flex: 2.8;
    position: relative;
    height: 100%;
    overflow: hidden;
    background-image: url(${backgroundImg});
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center;

    @media (max-width: 767px) {
      display: none;
    }
  `,

  RightPanel: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primaryDarkTwo};
    padding: 2rem 1rem;
    height: 100%;

    @media (min-width: 768px) {
      max-width: 600px;
      padding: 3rem 2rem;
    }
  `,
};