import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";

export default function Excel() {
  return (
    <MainLayout>
      <Styled.Container>
        <iframe
          src="https://docs.google.com/spreadsheets/d/1W2t3NUqJLS1Ci99n7wba0VdDOixzyfopVJzatOLrRQ8/edit?usp=sharing"
          frameBorder="0"
          width="100%"
          height="800"
          title="Excel Sheet"
        />
      </Styled.Container>
    </MainLayout>
  );
}

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    iframe {
      width: 100%;
      height: 120vh;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  `,
};
