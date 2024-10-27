import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Duration } from 'luxon'
import Timer from '../components/Timer'
import ExerciseList, { Exercise } from '../components/ExerciseList'
import DiaryCreate from '../components/DiaryCreate'
import axiosInstance from '../api/axiosInstance'
import TodayDiary from '../components/TodayDiary'
import Error from '../components/Error'
import Loading from '../components/Loading'

const fetchExercise = async () => {
  const accessToken = localStorage.getItem('authToken')

  const response = await axiosInstance.get('/api', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

const Main = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['main'],
    queryFn: fetchExercise,
    retry: 1,
  })

  const [totalTime, setTotalTime] = useState(0)
  const [exerciseList, setExerciseList] = useState<Exercise[]>([])
  const [diary, setDiary] = useState([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState(new Date())
  const isAnyActive = exerciseList.some((exercise) => exercise.isActive)

  const [newDiary, setNewDiary] = useState('')

  const durationToMs = (duration: string) => {
    return Duration.fromISO(duration).as('milliseconds')
  }

  useEffect(() => {
    if (data) {
      const {
        totalTime: fetchedTotalTime,
        exerciseList: fetchedExerciseList,
        diary: fetchedDiary,
      } = data

      setTotalTime(durationToMs(fetchedTotalTime))
      setExerciseList(fetchedExerciseList)
      setDiary(fetchedDiary)

      const activeExercise = fetchedExerciseList.find(
        (exercise: Exercise) => exercise.isActive
      )
      if (activeExercise && activeExercise.startTime) {
        const elapsedTime =
          Date.now() - new Date(activeExercise.startTime).getTime()
        setTotalTime((prevTime) => prevTime + elapsedTime)
      }
    }
  }, [data])

  const handleDiarySubmit = async () => {
    try {
      const response = await axiosInstance.post('/api/diary', {
        memo: newDiary,
      })
      // eslint-disable-next-line no-console
      console.log('Diary 전송 성공', response.data)
      setNewDiary('')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error submitting diary:', error)
    }
  }

  if (isLoading) return <Loading />
  if (isError) return <Error />
  return (
    <MainWrapper>
      <DateContainer>
        <Timer
          totalTime={totalTime}
          setExerciseList={setExerciseList}
          isAnyActive={isAnyActive}
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
      <Container>
        <DiaryCreate
          newDiary={newDiary}
          setNewDiary={setNewDiary}
          onSubmit={handleDiarySubmit}
        />
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
