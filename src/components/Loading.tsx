import styled from '@emotion/styled'

const Loading = () => {
  return (
    <LoadingWrapper>
      <LoadingText>로딩중 ...</LoadingText>
    </LoadingWrapper>
  )
}

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 55px);
`

const LoadingText = styled.div`
  font-size: 18px;
`

export default Loading
