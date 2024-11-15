import styled from '@emotion/styled'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import Modal from './Modal'

interface DiaryCreateProps {
  isAnyActive: boolean
}

const postDiary = async (memo: string) => {
  const accessToken = localStorage.getItem('authToken')

  const response = await axiosInstance.post(
    '/api/diary',
    {
      memo,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return response.data
}

const DiaryCreate: React.FC<DiaryCreateProps> = ({ isAnyActive }) => {
  const queryClient = useQueryClient()

  const [newDiary, setNewDiary] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('올바른 값을 입력해주세요.')

  const mutationDiary = useMutation<string, Error, string>({
    mutationFn: postDiary,
    onSuccess: () => {
      setNewDiary('')
      queryClient.invalidateQueries({ queryKey: ['diary'] })
      queryClient.invalidateQueries({ queryKey: ['main'] })
    },
  })

  const onSubmit = () => {
    if (isAnyActive) {
      handleOpenAlert(
        '운동이 실행 중 입니다\n운동 종료 후 일기를 작성해주세요!'
      )
    } else {
      if (newDiary.trim() === '') {
        handleOpenAlert('일기 텍스트가 비어있습니다\n일기를 작성해주세요!')
        setNewDiary('')
        return
      }
      if (newDiary.length > 255) {
        handleOpenAlert('일기는 최대 255자까지 작성 가능합니다.')
        return
      }
      mutationDiary.mutate(newDiary)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenAlert = (message = '올바른 값을 입력해주세요.') => {
    setAlertMessage(message)
    setIsModalOpen(true)
  }

  return (
    <DiaryCreateWrapper>
      <TitleContainer>
        <Title>홈트 일기</Title>
        <CreateButton onClick={onSubmit}>작성 완료</CreateButton>
      </TitleContainer>
      <TextArea
        value={newDiary}
        onChange={(e) => setNewDiary(e.target.value)}
        placeholder="일기를 작성하세요"
      />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalText>
          <AlertText>{alertMessage}</AlertText>
        </ModalText>
        <ModalBtnContainer>
          <DoneBtn onClick={handleCloseModal}>확인</DoneBtn>
        </ModalBtnContainer>
      </Modal>
    </DiaryCreateWrapper>
  )
}

const DiaryCreateWrapper = styled.div``
const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px 7px 5px;
  margin-bottom: 10px;
`

const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
`

const CreateButton = styled.div`
  background-color: #86a1e9;
  color: #ffffff;
  padding: 5px 7px;
  font-size: 13px;
  border-radius: 5px;
  cursor: pointer;
`

const TextArea = styled.textarea`
  width: 99%;
  border: 2px solid #b5c3e9;
  border-radius: 10px;
  outline: none;
  resize: none;
  box-sizing: border-box;
  padding: 15px;
  height: 120px;
  font-size: 15px;
`
const ModalText = styled.div`
  margin-top: 10px;
`

const AlertText = styled.div`
  color: #4a4a4a;
  text-align: center;
  margin-top: 5px;
  white-space: pre-line;
  line-height: 1.5;
`

const ModalBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`

const DoneBtn = styled.div`
  padding: 5px;
  color: #6d86cb;
  cursor: pointer;
`

export default DiaryCreate
