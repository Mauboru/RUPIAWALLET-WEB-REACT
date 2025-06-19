import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import defaultUserImg from "/user.jpg";
import { FaBars } from "react-icons/fa";

export default function Header({ onToggleSidebar }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.user);
      // setProfileImage(parsedUser.user.image ? `${import.meta.env.VITE_BASE_URL_PROFILE}${parsedUser.user.image}` : null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <HeaderContainer>
      <MenuButton onClick={onToggleSidebar}>
        <FaBars />
      </MenuButton>
      <UserInfo>
        <UserName>{user?.name || 'Convidado'}</UserName>
        <UserButton onClick={toggleMenu}>
          <img src={profileImage || defaultUserImg} alt="Usuário" />
        </UserButton>
        {isMenuOpen && (
          <UserMenu>
            <MenuItem>{user?.email || 'email@convidado.com'}</MenuItem>
            <MenuItem onClick={() => navigate("/profile")}>Editar Perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </UserMenu>
        )}
      </UserInfo>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  height: 60px;
  width: calc(100% - 2rem);
  margin: 1rem auto;
  background-color: #1b1b1b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: block;

  @media (min-width: 768px) {
    display: none;
  }
`;

const UserInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const UserName = styled.span`
  margin-right: 0.8rem;
  font-weight: 500;
  font-size: 1rem;
  color: #fff;
`;

const UserButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 0.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 10;
  min-width: 160px;
`;

const MenuItem = styled.div`
  padding: 0.75rem 1.2rem;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3a3a3a;
  }
`;
