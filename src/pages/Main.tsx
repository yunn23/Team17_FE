import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useIntersectionObserver } from 'usehooks-ts'
import Timer from '../components/Timer'
import ExerciseList, { Exercise } from '../components/ExerciseList'
import DiaryCreate from '../components/DiaryCreate'
import TodayDiary from '../components/TodayDiary'
import Error from '../components/Error'
import Loading from '../components/Loading'
import DateSelect from '../components/DateSelect'
import getMain from '../api/getMain'

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
  // eslint-disable-next-line spaced-comment
  //const formattedDate = DateTime.fromJSDate(selectedDate).toFormat('yyyyMMdd')

  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['main', formattedDate],
  //   queryFn: () => getMain(formattedDate),
  //   retry: 1,
  // })

  const { data, isLoading, isError, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['main', formattedDate],
    queryFn: ({ pageParam = 0 }) => getMain(formattedDate, pageParam as number),
    getNextPageParam: (lastPage) =>
      !lastPage.diaries.last ? lastPage.diaries.pageable.pageNumber + 1 : undefined,
    initialPageParam: 0,
  })

  const { ref } = useIntersectionObserver({
    threshold: 0.1,
    onChange: () => {
      if (hasNextPage) fetchNextPage()
    }
  })

  const [totalTime, setTotalTime] = useState(data?.pages.reduce((acc, page) => acc + (page.totalTime || 0), 0))
  const [exerciseList, setExerciseList] = useState<Exercise[]>([])
  const [diary, setDiary] = useState(data?.pages.flatMap((page) => page.diaries.content || []))

  const isAnyActive = exerciseList?.some((exercise) => exercise.isActive)

  useEffect(() => {
    if (data) {
      const fetchedTotalTime = data.pages.reduce((acc, page) => acc + (page.totalTime || 0), 0)
      const fetchedExerciseList = data.pages.flatMap((page) => page.exerciseList || [])
      const fetchedDiary = data.pages.flatMap((page) => page.diaries.content || [])

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
      setTotalTime((prevTime) => (prevTime !== undefined ? prevTime + elapsedTime : elapsedTime))
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
          totalTime={totalTime ?? 0}
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
        <TodayDiary diaryData={diary || []} />
      </Container>
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

export default Main
