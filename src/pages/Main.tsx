import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useIntersectionObserver } from 'usehooks-ts'
import { isSameDay } from 'date-fns'
import Timer from '../components/Timer'
import ExerciseList, { Exercise } from '../components/ExerciseList'
import DiaryCreate from '../components/DiaryCreate'
import TodayDiary from '../components/TodayDiary'
import Error from '../components/Error'
import Loading from '../components/Loading'
import DateSelect from '../components/DateSelect'
import getMain from '../api/getMain'
import Modal from '../components/Modal'

const resetHour = 3

export const handleAdjustDate = (date: Date) => {
  const adjustedDate = new Date(date)

  if (date.getHours() < resetHour) {
    adjustedDate.setDate(adjustedDate.getDate() - 1)
  }
  return adjustedDate
}

export const getCustomDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

const Main = () => {
  const newDate = new Date()
  const [selectedDate, setSelectedDate] = useState(handleAdjustDate(newDate))
  const formattedDate = getCustomDate(selectedDate)
  const [isWarningOpen, setIsWarningOpen] = useState(false)

  const today = new Date()
  // eslint-disable-next-line spaced-comment
  //const formattedDate = DateTime.fromJSDate(selectedDate).toFormat('yyyyMMdd')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['main', formattedDate],
    queryFn: () => getMain(formattedDate),
    select: (mainData) => ({
      totalTime: mainData.totalTime,
      exerciseList: mainData.exerciseList,
    }),
    retry: 1,
  })

  const {
    data: diaryData,
    isLoading: isDiaryLoading,
    isError: isDiaryError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['diary', formattedDate],
    queryFn: ({ pageParam = 0 }) => getMain(formattedDate, pageParam as number),
    getNextPageParam: (lastPage) =>
      !lastPage.diaries.last
        ? lastPage.diaries.pageable.pageNumber + 1
        : undefined,
    initialPageParam: 0,
  })

  const { ref } = useIntersectionObserver({
    threshold: 0.1,
    onChange: () => {
      if (hasNextPage) fetchNextPage()
    },
  })

  const [totalTime, setTotalTime] = useState(data?.totalTime || 0)
  const [exerciseList, setExerciseList] = useState<Exercise[]>(
    data?.exerciseList || []
  )
  const [diary, setDiary] = useState(
    diaryData?.pages.flatMap((page) => page.diaries.content || [])
  )

  const isAnyActive = exerciseList?.some((exercise) => exercise.isActive)

  useEffect(() => {
    if (data) {
      const fetchedTotalTime = data?.totalTime || 0
      const fetchedExerciseList = data?.exerciseList || []
      const fetchedDiary = diaryData?.pages.flatMap(
        (page) => page.diaries.content || []
      )

      setTotalTime(fetchedTotalTime)
      setExerciseList(fetchedExerciseList)
      setDiary(fetchedDiary)
    }
  }, [data, diaryData?.pages])

  useEffect(() => {
    const activeExercise = exerciseList.find(
      (exercise: Exercise) => exercise.isActive
    )
    if (activeExercise && activeExercise.startTime) {
      const elapsedTime =
        Date.now() - new Date(activeExercise.startTime).getTime()
      setTotalTime((prevTime) =>
        prevTime !== undefined ? prevTime + elapsedTime : elapsedTime
      )
    }
  }, [exerciseList])

  const activeExercise = exerciseList.find((exercise) => exercise.isActive)

  const handleWarningClose = () => {
    setIsWarningOpen(false)
  }

  if (isLoading || isDiaryLoading) return <Loading />
  if (isError || isDiaryError) return <Error name="메인화면" />

  return (
    <MainWrapper>
      <DateContainer>
        <DateSelect
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <Timer
          totalTime={totalTime ?? 0}
          setExerciseList={setExerciseList}
          isAnyActive={isAnyActive}
          selectedDate={selectedDate}
          activeExerciseId={activeExercise?.exerciseId}
        />
      </DateContainer>
      <Container>
        <ExerciseList
          selectedDate={selectedDate}
          exerciseList={exerciseList}
          setTotalTime={setTotalTime}
          setExerciseList={setExerciseList}
        />
      </Container>
      {isSameDay(selectedDate, today) && (
        <Container>
          <DiaryCreate />
        </Container>
      )}
      <Container>
        <TodayDiary diaryData={diary || []} />
      </Container>
      <Modal isOpen={isWarningOpen} onClose={handleWarningClose}>
        <ModalBody>
          <ModalBodyLine>
            {' '}
            운동이 진행중입니다. 운동을 종료해주세요
          </ModalBodyLine>
        </ModalBody>
        <ModalBtnContainer>
          <DoneBtn onClick={handleWarningClose}>확인</DoneBtn>
        </ModalBtnContainer>
      </Modal>
      <div ref={ref} />
    </MainWrapper>
  )
}

const MainWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 55px);
  overflow-y: auto;
  background-color: #f2f2f6;
  padding: 20px;
  box-sizing: border-box;
`

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 20px 20px 10px 20px;
  border-radius: 10px;
  margin: 20px 0px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 20px 0px;
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

const ModalBody = styled.div`
  margin-top: 5px;
  margin-bottom: 7px;
  margin-right: 50px;
  display: flex;
  flex-direction: column;
`

const ModalBodyLine = styled.div`
  color: #5d5d5d;
  margin-top: 5px;
  font-size: 15px;
`

export default Main
