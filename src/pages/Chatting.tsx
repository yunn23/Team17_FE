/* eslint-disable no-console */
import { useState, useEffect, useRef, useCallback } from 'react'
import styled from '@emotion/styled'
import { useParams, useNavigate } from 'react-router-dom'
import { Client, IMessage, Frame } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { fetchInitialMessages, ChatMessage } from '../api/getChatting'

interface MessageProps {
  isOwn: boolean
}

const Chatting = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const currentUser = { nickname: 'GuestUser' }
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const stompClient = useRef<Client | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const handlePrev = () => {
    navigate(-1)
  }

  const loadInitialMessages = useCallback(async () => {
    if (roomId) {
      try {
        const initialMessages = await fetchInitialMessages(roomId)
        setMessages(initialMessages)
      } catch (error) {
        console.error('Failed to load initial messages:', error)
      }
    }
  }, [roomId])

  useEffect(() => {
    loadInitialMessages()
  }, [roomId, loadInitialMessages])

  const subscribeToChat = useCallback(() => {
    stompClient.current?.subscribe(
      `/topic/messages/${roomId}`,
      (message: IMessage) => {
        const newMessage = JSON.parse(message.body) as ChatMessage
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }
    )
    stompClient.current?.subscribe(
      '/user/queue/errors',
      (message: IMessage) => {
        console.error('Error received:', message.body)
      }
    )
  }, [roomId])

  useEffect(() => {
    loadInitialMessages()
    const connectWebSocket = () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }
      const socketUrl = `http://13.125.102.156:8080/api/team/chatting/websocket?access_token=${token}`
      const socket = new SockJS(socketUrl)

      stompClient.current = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: (frame: Frame) => {
          console.log('Connected:', frame)
          subscribeToChat()
        },
        onStompError: (frame: Frame) => {
          console.error('STOMP Error:', frame.headers.message)
          alert(`Connection error: ${frame.headers.message}`)
        },
        onWebSocketClose: (evt) => {
          console.error('WebSocket closed:', evt)
          if (evt.code === 1006) {
            console.log('Reconnecting...')
          }
        },
        onWebSocketError: (evt) => {
          console.error('WebSocket error:', evt)
        },
      })
      stompClient.current.activate()
    }

    connectWebSocket()
    return () => {
      stompClient.current?.deactivate()
    }
  }, [roomId, loadInitialMessages, subscribeToChat])

  const sendMessage = () => {
    if (!inputMessage.trim()) return
    if (stompClient.current?.active) {
      const message = {
        chatId: Date.now(),
        nickname: currentUser.nickname,
        message: inputMessage,
        createdAt: new Date().toISOString(),
      }
      stompClient.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(message),
      })
      console.log('Message sent.')
      setMessages((prevMessages) => [...prevMessages, message])
      setInputMessage('')
    } else {
      console.error('Cannot send message - WebSocket is not connected.')
      alert('Cannot send message - WebSocket is not connected.')
    }
  }

  return (
    <PageWrapper>
      <PageContainer>
        <HeaderContainer>
          <Prev onClick={handlePrev}>{'<'}</Prev>
          <PageTitle>매일 운동 도전</PageTitle>
        </HeaderContainer>
        <div>
          {messages.map((msg) => (
            <MessageContainer
              key={msg.chatId}
              isOwn={msg.nickname === currentUser.nickname}
            >
              <MessageInfo isOwn={msg.nickname === currentUser.nickname}>
                {msg.nickname}
              </MessageInfo>
              <MessageContentContainer
                isOwn={msg.nickname === currentUser.nickname}
              >
                <MessageBubble isOwn={msg.nickname === currentUser.nickname}>
                  {msg.message}
                </MessageBubble>
                <TimeStamp isOwn={msg.nickname === currentUser.nickname}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TimeStamp>
              </MessageContentContainer>
            </MessageContainer>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </PageContainer>
      <InputContainer>
        <StyledInput
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              sendMessage()
              e.preventDefault()
            }
          }}
          placeholder="your message..."
        />
        <StyledButton onClick={sendMessage}>&gt;</StyledButton>
      </InputContainer>
    </PageWrapper>
  )
}

export default Chatting

/* Page */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f2f2f6;
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 55px);
  overflow-y: auto;
  overflow-x: hidden;
`

const PageContainer = styled.div`
  padding: 10px 0px 20px 0px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 20px 0px;
  height: 75%;
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
const MessageContainer = styled.div<MessageProps>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOwn ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`

const MessageContentContainer = styled.div<MessageProps>`
  display: flex;
  flex-direction: ${(props) => (props.isOwn ? 'row-reverse' : 'row')};
  align-items: center;
`

const MessageBubble = styled.div<MessageProps>`
  max-width: 70%;
  padding: 7px 10px;
  border-radius: 10px;
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.4;

  /* Align the message to the right if it's the currentUser's message */
  background-color: ${(props) => (props.isOwn ? '#EDF1FA' : '#F3F2F2')};
  margin: ${(props) => (props.isOwn ? '0 20px 0 5px' : '0 5px 0 20px')};
`

const MessageInfo = styled.div<MessageProps>`
  font-size: 10px;
  color: #4a4a4a;
  text-align: ${(props) => (props.isOwn ? 'right' : 'left')};
  margin: ${(props) => (props.isOwn ? '0px' : '0px 0px 5px 23px')};
  display: ${(props) => (props.isOwn ? 'none' : 'block')};
`

const TimeStamp = styled.span<MessageProps>`
  font-size: 9px;
  color: #4a4a4a;
  align-self: ${(props) => (props.isOwn ? 'flex-end' : 'flex-start')};
`

/* Input bar */
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
  border-radius: 20px;
  outline: none;
  margin-right: 10px;

  &::placeholder {
    color: #999;
  }
`

const StyledButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 50%;
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
