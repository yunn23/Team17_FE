import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import DateSelect from '../components/DateSelect'
import chatbubble from '../assets/chatbubble.svg'
import getRanking from '../api/getRanking'
import Loading from '../components/Loading'
import Error from '../components/Error'
import { formatTime } from '../components/Timer'
import { handleAdjustDate } from './Main'

const Ranking = () => {
  const location = useLocation()
  const teamName = location.state?.teamName
  const { groupId } = useParams()
  const [selectedDate, setSelectedDate] = useState(handleAdjustDate(new Date()))
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['ranking', groupId, formattedDate],
    queryFn: () =>
      getRanking({
        groupId: groupId || '',
        page: 0,
        size: 8,
        sort: 'time,asc',
        date: formattedDate,
      }),
    retry: 1,
  })

  const [rankData, setRankData] = useState(data)

  useEffect(() => {
    setRankData(data)
  }, [data])

  if (isLoading) return <Loading />
  if (isError) return <Error name="랭킹화면" />

  return (
    <RankingWrapper>
      <TitleContainer>
        <Link to="/mygroup">
          <BeforeButton>&lt;</BeforeButton>
        </Link>
        <Title>{teamName}</Title>
        <Space></Space>
      </TitleContainer>
      <RankContainer>
        <DateContainer>
          <DateSelect
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </DateContainer>
        <EntireRank>
          {rankData?.slice?.content?.map((ranker) => (
            <RankElement
              rank={ranker.ranking}
              time={ranker.totalExerciseTime}
              key={ranker.name}
            >
              <RankerCount
                rank={ranker.ranking}
                time={ranker.totalExerciseTime}
              >
                {ranker.totalExerciseTime === 0 ? '-' : ranker.ranking}
              </RankerCount>
              <RankerName>{ranker.name}</RankerName>
              <RankerTime>{formatTime(ranker.totalExerciseTime)}</RankerTime>
            </RankElement>
          )) || <Error name="랭크" />}
        </EntireRank>
      </RankContainer>
      <MyRank>
        {rankData?.myRanking !== null && rankData?.myRanking !== undefined && (
          <MyRankElement
            rank={rankData.myRanking}
            time={rankData.myExerciseTime}
          >
            <MyRankerCount
              rank={rankData.myRanking}
              time={rankData.myExerciseTime}
            >
              {rankData.myExerciseTime === 0 ? '-' : rankData.myRanking}
            </MyRankerCount>
            <RankerName>{rankData.myNickname}</RankerName>
            <RankerTime>{formatTime(rankData.myExerciseTime)}</RankerTime>
          </MyRankElement>
        )}
      </MyRank>
      <Link to={`/chat/${groupId}`} state={{ teamName }}>
        <ChatButton>
          <ChatIcon src={chatbubble} alt="chat icon" />
        </ChatButton>
      </Link>
    </RankingWrapper>
  )
}

const RankingWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 55px);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`

const BeforeButton = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #5673c1;
  cursor: pointer;
`

const Title = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #5673c1;
`

const Space = styled.div``

const RankContainer = styled.div`
  border: 2px solid #b5c3e9;
  border-radius: 10px;
`

const DateContainer = styled.div`
  padding: 15px 20px;
  color: #4a4a4a;
`

const EntireRank = styled.div`
  height: 435px;
  overflow-y: auto;
`

const MyRank = styled.div`
  margin-top: 20px;
`

interface RankElementProps {
  rank: number
  time: number
}

const MyRankElement = styled.div<RankElementProps>`
  display: flex;
  font-size: 18px;
  padding: 10px 20px;
  border: 2px solid #b5c3e9;
  border-radius: 10px;
  background: ${(props) => {
    if (props.time !== 0) {
      if (props.rank === 1)
        return 'linear-gradient(90deg, #FFF 0%, #FFC329 100%)'
      if (props.rank === 2)
        return 'linear-gradient(90deg, rgba(255, 255, 255, 0.30) 0%, rgba(0, 0, 0, 0.23) 100%)'
      if (props.rank === 3)
        return 'linear-gradient(90deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 170, 70, 0.30) 100%)'
    }
    return ''
  }};
`

const MyRankerCount = styled.div<RankElementProps>`
  padding: 10px;
  margin-left: 5px;
  font-weight: 500;
  color: ${(props) => {
    if (props.time !== 0) {
      if (props.rank === 1) return '#D7C100'
      if (props.rank === 2) return '#989898'
      if (props.rank === 3) return '#B46100'
    }
    return ''
  }};
`

const RankElement = styled.div<RankElementProps>`
  display: flex;
  padding: 10px 20px;
  border-top: 1px solid #b5c3e9;
  align-items: center;
  background: ${(props) => {
    if (props.time !== 0) {
      if (props.rank === 1)
        return 'linear-gradient(90deg, #FFF 0%, #FFC329 100%)'
      if (props.rank === 2)
        return 'linear-gradient(90deg, rgba(255, 255, 255, 0.30) 0%, rgba(0, 0, 0, 0.23) 100%)'
      if (props.rank === 3)
        return 'linear-gradient(90deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 170, 70, 0.30) 100%)'
    }
    return ''
  }};
`

const RankerCount = styled.div<RankElementProps>`
  padding: 10px;
  margin-left: 5px;
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => {
    if (props.time !== 0) {
      if (props.rank === 1) return '#D7C100'
      if (props.rank === 2) return '#989898'
      if (props.rank === 3) return '#B46100'
    }
    return '#4a4a4a'
  }};
`

const RankerName = styled.div`
  padding: 10px;
  margin-left: 25px;
  font-size: 18px;
  color: #4a4a4a;
`

const RankerTime = styled.div`
  padding: 10px;
  margin-left: auto;
  color: #4a4a4a;
  font-size: 18px;
`

const ChatButton = styled.div`
  position: absolute;
  right: -10px;
  bottom: 37px;
  transform: translateX(-50%);
  background-color: #b5c3e9;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  cursor: pointer;
`

const ChatIcon = styled.img`
  width: 33px;
  height: 33px;
  padding: 13px 11px 13px 14px;
`

export default Ranking
