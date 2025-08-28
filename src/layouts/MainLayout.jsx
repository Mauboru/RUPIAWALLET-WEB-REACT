import styled from "styled-components";
import { useEffect, useState } from "react";
import Footer from "../components/layouts/Footer";
import Sidebar from "../components/layouts/Sidebar";

export default function MainLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Wrapper>
      {isMobile ? (
        <Main>
          <Content>{children}</Content>
          <Footer />
        </Main>
      ) : (
        <>
          <Sidebar />
          <Main>
            <Content>{children}</Content>
          </Main>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Content = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2rem;
  overflow-y: auto;
  height: 100%;
`;
