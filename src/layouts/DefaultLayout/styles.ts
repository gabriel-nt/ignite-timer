import styled from 'styled-components'

export const LayoutContainer = styled.div`
  max-width: 74rem;
  height: calc(100vh - 10rem);
  margin: 5rem auto;
  padding: 2.5rem;

  background-color: ${(props) => props.theme['gray-800']};
  border-radius: 8px;

  display: flex;
  flex-direction: column;

  @media (max-width: 1368px) {
    margin-right: 2rem;
    margin-left: 2rem;
  }

  @media (max-height: 700px) {
    height: 100%;
  }
`
