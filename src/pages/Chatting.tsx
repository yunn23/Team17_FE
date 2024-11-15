import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import Modal from '../components/Modal'
import {
  ChatResponse,
  fetchInitialMessages,
  ChatMessage as ApiChatMessage,
} from '../api/getChatting'
import getMypage from '../api/getMypage'

interface MessageProps {
  isOwn: boolean
}

const Error = () => (
  <ErrorContainer>
    <ErrorMessage>오류가 발생했습니다.</ErrorMessage>
  </ErrorContainer>
)

const Loading = () => (
  <LoadingContainer>
    <LoadingText>로딩 중...</LoadingText>
  </LoadingContainer>
)

const Chatting = () => {
  const { groupId } = useParams<{ groupId: string }>()
  const queryClient = useQueryClient()
  const [inputMessage, setInputMessage] = useState('')
  const stompClient = useRef<Client | null>(null)
  const messageBoxRef = useRef<HTMLDivElement | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const teamName = location.state?.teamName

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ['userDetails'],
    queryFn: getMypage,
    retry: 1,
  })

  const currentUser = `${userData?.nickname}#${userData?.id}`

  const {
    data: chatData,
    error: chattingError,
    isLoading: chattingLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    ChatResponse,
    Error,
    InfiniteData<ChatResponse>,
    [string, string],
    number
  >({
    queryKey: ['chatMessages', groupId || ''],
    queryFn: ({ pageParam = 0 }) =>
      fetchInitialMessages(groupId || '', pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) {
        return lastPage.number + 1
      }
      return undefined
    },
    initialPageParam: 0,
  })

  const handlePrev = () => {
    navigate(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const message = e.target.value
    if (message.length > 500) {
      setModalMessage('채팅은 500자 이내로 작성해주세요.')
      setShowModal(true)
      return
    }
    setInputMessage(message)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    const connectWebSocket = () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        return
      }
      const socketUrl = `https://home-try.13.125.102.156.sslip.io/api/team/chatting/websocket?access_token=${token}`
      const socket = new SockJS(socketUrl)

      stompClient.current = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          stompClient.current?.subscribe(
            `/sub/${groupId}`,
            (message: IMessage) => {
              const newMessage = JSON.parse(message.body) as ApiChatMessage
              queryClient.setQueryData<InfiniteData<ChatResponse> | undefined>(
                ['chatMessages', groupId],
                (oldData) => {
                  if (!oldData) return undefined
                  const firstPage = oldData.pages[0]
                  if (!firstPage) return oldData

                  const updatedPage = {
                    ...firstPage,
                    content: [...firstPage.content, newMessage],
                  }

                  return {
                    ...oldData,
                    pages: [updatedPage, ...oldData.pages.slice(1)],
                  }
                }
              )
              setTimeout(() => {
                if (messageBoxRef.current) {
                  messageBoxRef.current.scrollTo({
                    top: messageBoxRef.current.scrollHeight,
                    behavior: 'smooth',
                  })
                }
              }, 100)
            }
          )
        },
      })
      stompClient.current.activate()
    }
    connectWebSocket()
    return () => {
      stompClient.current?.deactivate()
    }
  }, [groupId, queryClient])

  useEffect(() => {
    const handleScroll = async () => {
      if (!messageBoxRef.current || !hasNextPage || isFetchingNextPage) return
      const { scrollTop, scrollHeight } = messageBoxRef.current

      if (scrollTop < 100) {
        const prevScrollHeight = scrollHeight

        await fetchNextPage()
        const newScrollHeight = messageBoxRef.current.scrollHeight
        messageBoxRef.current.scrollTop =
          newScrollHeight - (prevScrollHeight - scrollTop)
      }
    }

    const currentMessageBox = messageBoxRef.current
    currentMessageBox?.addEventListener('scroll', handleScroll)

    return () => {
      currentMessageBox?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    if (
      chatData &&
      chatData.pages &&
      chatData.pages.length > 0 &&
      chatData.pages[0].number === 0 &&
      !initialLoadComplete
    ) {
      setInitialLoadComplete(true)
      setTimeout(() => {
        if (messageBoxRef.current) {
          messageBoxRef.current.scrollTo({
            top: messageBoxRef.current.scrollHeight,
            behavior: 'auto',
          })
        }
      }, 100)
    }
  }, [chatData, initialLoadComplete])

  if (chattingLoading || userLoading) return <Loading />
  if (chattingError || userError) return <Error />

  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    if (!stompClient.current || !stompClient.current.active) {
      return
    }

    const messagePayload = {
      nickname: currentUser || 'Unknown User',
      message: inputMessage,
      chattedAt: new Date().toISOString(),
    }

    stompClient.current.publish({
      destination: `/pub/${groupId}`,
      body: JSON.stringify(messagePayload),
      skipContentLengthHeader: true,
    })

    setInputMessage('')
    setTimeout(() => {
      messageBoxRef.current?.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }, 100)
  }

  const allMessages = chatData
    ? chatData.pages
        .flatMap((page) => page.content)
        .sort(
          (a, b) =>
            new Date(a.chattedAt).getTime() - new Date(b.chattedAt).getTime()
        )
    : []

  const renderMessages = (messages: ApiChatMessage[]) => {
    let lastDate: string | null = null

    return messages.map((msg) => {
      const messageDate = new Date(msg.chattedAt).toLocaleDateString()
      const isNewDate = lastDate !== messageDate
      lastDate = messageDate

      const isOwnMessage = `${msg.nickName}#${msg.memberId}` === currentUser

      return (
        <Box key={msg.chatId}>
          {isNewDate && (
            <DateSeparator>
              <span>{messageDate}</span>
            </DateSeparator>
          )}
          <MessageContainer isOwn={isOwnMessage}>
            <MessageInfo isOwn={isOwnMessage}>
              {`${msg.nickName}#${msg.memberId}`}
            </MessageInfo>
            <MessageContentContainer isOwn={isOwnMessage}>
              <MessageBubble isOwn={isOwnMessage}>{msg.message}</MessageBubble>
              <TimeStamp>
                {new Date(msg.chattedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TimeStamp>
            </MessageContentContainer>
          </MessageContainer>
        </Box>
      )
    })
  }

  return (
    <PageWrapper>
      <PageContainer>
        <HeaderContainer>
          <Prev onClick={handlePrev}>{'<'}</Prev>
          <PageTitle>{teamName}</PageTitle>
        </HeaderContainer>
        <MessageBox ref={messageBoxRef}>
          {renderMessages(allMessages)}
        </MessageBox>
      </PageContainer>
      <InputContainer>
        <StyledInput
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              sendMessage()
              e.preventDefault()
            }
          }}
          placeholder="메세지를 입력하세요"
        />
        <StyledButton onClick={sendMessage}>&gt;</StyledButton>
      </InputContainer>
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          <ModalTitle>알림</ModalTitle>
          <ModalText>{modalMessage}</ModalText>
          <ModalBtnContainer>
            <CancelBtn onClick={handleCloseModal}>닫기</CancelBtn>
          </ModalBtnContainer>
        </Modal>
      )}
    </PageWrapper>
  )
}

export default Chatting

/* Page 스타일링 */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f2f2f6;
  padding: 20px;
  padding-bottom: 40px;
  box-sizing: border-box;
  height: calc(100vh - 55px);
  overflow: hidden;
`

const PageContainer = styled.div`
  padding: 10px 0px 20px 0px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 20px 0px;
  height: 100%;
  overflow: hidden;
`
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 5px 0px;
  width: 90%;
`

const Prev = styled.div`
  font-size: 24px;
  cursor: pointer;
  font-weight: 500;
  position: absolute;
  left: 0;
  padding-left: 10px;
  margin-top: 5px;
`

const PageTitle = styled.p`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #5673c1;
`

/* Chat */
const MessageBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
`
const Box = styled.div`
  display: flex;
  flex-direction: column;
`

const MessageContainer = styled.div<MessageProps>`
  display: flex;
  flex-direction: column;
  align-self: ${(props) => (props.isOwn ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
  max-width: 350px;
`

const MessageContentContainer = styled.div<MessageProps>`
  display: flex;
  justify-content: flex-start;
  flex-direction: ${(props) => (props.isOwn ? 'row-reverse' : 'row')};
  align-items: center;
  width: 100%;
`

const MessageBubble = styled.div<MessageProps>`
  max-width: 70%;
  padding: 7px 10px;
  border-radius: 10px;
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.4;

  background-color: ${(props) => (props.isOwn ? '#EDF1FA' : '#F3F2F2')};
  align-self: ${(props) => (props.isOwn ? 'flex-end' : 'flex-start')};
  margin: ${(props) => (props.isOwn ? '0 20px 0 5px' : '0 5px 0 20px')};

  word-wrap: break-word;
  white-space: pre-wrap;
`

const MessageInfo = styled.div<MessageProps>`
  font-size: 10px;
  color: #4a4a4a;
  text-align: ${(props) => (props.isOwn ? 'right' : 'left')};
  margin: ${(props) => (props.isOwn ? '0px' : '0px 0px 5px 23px')};
  display: ${(props) => (props.isOwn ? 'none' : 'block')};
`

const TimeStamp = styled.span`
  font-size: 9px;
  color: #4a4a4a;
  align-self: flex-end;
`

const DateSeparator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  color: #999;
  font-size: 12px;
  & > span {
    background-color: #f1f1f1;
    padding: 5px 10px;
    border-radius: 15px;
  }
`

/* Input bar 스타일링 */
const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 12px;
  background-color: #ffffff;
  border-radius: 10px;
  box-sizing: border-box;
`

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  background-color: #f5f5f5;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  outline: none;
  margin-right: 10px;

  &::placeholder {
    color: #999;
  }
`

const StyledButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 10px;
  color: gray;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: gray;
    color: white;
  }
`
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`

const LoadingText = styled.p`
  font-size: 20px;
`

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`

const ErrorMessage = styled.p`
  font-size: 20px;
`

/* Modal 스타일링 */
const ModalTitle = styled.div`
  font-size: 20px;
  width: 100%;
  text-align: left;
  padding: 10px;
  box-sizing: border-box;
`

const ModalText = styled.p`
  width: 96%;
  color: #8e8e8e;
  font-size: 12px;
  padding: 0px 6px;
  margin: 10px 0px;
  box-sizing: border-box;
  border: none;
  outline: none;
`

const ModalBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`

const CancelBtn = styled.div`
  padding: 5px 15px;
  color: #969393;
  cursor: pointer;
`
