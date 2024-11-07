import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
// import { DateTime } from 'luxon'
import Timer from '../components/Timer'
import ExerciseList, { Exercise } from '../components/ExerciseList'
import DiaryCreate from '../components/DiaryCreate'
import TodayDiary from '../components/TodayDiary'
import Error from '../components/Error'
import Loading from '../components/Loading'
import DateSelect from '../components/DateSelect'
import getMain from '../api/getMain'

const Main = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const resetHour = 3
  const getCustomDate = (date: Date) => {
    const adjustedDate = new Date(date)

    // 만약 현재 시간이 새벽 3시 이전이라면 하루 전 날짜로 조정
    if (date.getTime() < resetHour) {
      adjustedDate.setDate(adjustedDate.getDate() - 1)
    }

    const year = adjustedDate.getFullYear()
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0')
    const day = String(adjustedDate.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }
  const formattedDate = getCustomDate(selectedDate)
  // eslint-disable-next-line spaced-comment
  //const formattedDate = DateTime.fromJSDate(selectedDate).toFormat('yyyyMMdd')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['main', formattedDate],
    queryFn: () => getMain(formattedDate),
    retry: 1,
  })

  const [totalTime, setTotalTime] = useState(data?.totalTime)
  const [exerciseList, setExerciseList] = useState<Exercise[]>(
    data?.exerciseList || []
  )
  const [diary, setDiary] = useState(data?.diary || [])

  const isAnyActive = exerciseList?.some((exercise) => exercise.isActive)

  useEffect(() => {
    if (data) {
      const fetchedTotalTime = data?.totalTime || 0
      const fetchedExerciseList = data?.exerciseList || []
      const fetchedDiary = data?.diaries.content || []

      setTotalTime(fetchedTotalTime)
      setExerciseList(fetchedExerciseList)
      setDiary(fetchedDiary)
    }
  }, [data])

  useEffect(() => {
    const activeExercise = exerciseList.find(
      (exercise: Exercise) => exercise.isActive
    )
    if (activeExercise && activeExercise.startTime) {
      const elapsedTime =
        Date.now() - new Date(activeExercise.startTime).getTime()
      setTotalTime((prevTime: number) => prevTime + elapsedTime)
    }
  }, [exerciseList])

  const activeExercise = exerciseList.find((exercise) => exercise.isActive)

  if (isLoading) return <Loading />
  if (isError) return <Error name="메인화면" />

  return (
    <MainWrapper>
      <DateContainer>
        <DateSelect
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <Timer
          totalTime={totalTime}
          setExerciseList={setExerciseList}
          isAnyActive={isAnyActive}
          selectedDate={selectedDate}
          activeExerciseId={activeExercise?.exerciseId}
        />
      </DateContainer>
      <Container>
        <ExerciseList
          exerciseList={exerciseList}
          setTotalTime={setTotalTime}
          setExerciseList={setExerciseList}
        />
      </Container>
      <Container>
        <DiaryCreate />
      </Container>
      <Container>
        <TodayDiary diaryData={diary} />
      </Container>
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

export default Main
