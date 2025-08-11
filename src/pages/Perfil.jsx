import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";

export default function Perfil() {
  const user = {
    name: "Mauboru Silva",
    email: "mauboru@example.com",
    saldo: 1250.75,
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.reload();
  }

  return (
    <MainLayout>
      <Styled.Container>
        <Styled.Avatar src={user.avatar} alt="Foto de perfil" />
        <Styled.Name>{user.name}</Styled.Name>
        <Styled.Email>{user.email}</Styled.Email>

        <Styled.InfoBox>
          <Styled.InfoLabel>Saldo Atual</Styled.InfoLabel>
          <Styled.InfoValue>R$ {user.saldo.toFixed(2)}</Styled.InfoValue>
        </Styled.InfoBox>

        <Styled.Buttons>
          <Styled.Button primary onClick={() => alert("Editar dados")}>
            Editar Dados
          </Styled.Button>
          <Styled.Button onClick={logout}>Logout</Styled.Button>
        </Styled.Buttons>
      </Styled.Container>
    </MainLayout>
  );
}

const Styled = {
  Container: styled.div`
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
  `,
  
  Avatar: styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 24px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  `,

  Name: styled.h1`
    font-size: 1.8rem;
    margin: 0;
    color: #222;
    font-weight: 700;
  `,

  Email: styled.p`
    font-size: 1rem;
    color: #ffffffff;
    margin: 4px 0 24px 0;
  `,
  
  InfoBox: styled.div`
    width: 100%;
    max-width: 320px;
    background: #f9f9f9ff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 40px;
    text-align: center;
  `,
  
  InfoLabel: styled.p`
    font-size: 0.9rem;
    color: #686868ff;
    margin-bottom: 8px;
  `,

  InfoValue: styled.p`
    font-size: 1.6rem;
    font-weight: 700;
    color: #4caf50;
  `,

  Buttons: styled.div`
    width: 100%;
    max-width: 320px;
    display: flex;
    gap: 16px;
  `,

  Button: styled.button`
    flex: 1;
    padding: 14px 0;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    color: white;
    background-color: ${(props) => (props.primary ? "#1976d2" : "#e53935")};
    transition: background-color 0.3s;

    &:hover {
      background-color: ${(props) => (props.primary ? "#1565c0" : "#c62828")};
    }
  `,
};
