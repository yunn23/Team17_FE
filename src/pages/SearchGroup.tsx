import React, { useState, ChangeEvent, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { getGroup, Team, TeamResponse } from '../api/getGroup'
import GroupListContainer from '../components/GroupListContainer'
import GroupModal from '../components/GroupModal'
import TagFilter from '../components/TagFilter'
import SearchBar from '../components/SearchBar'

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

const SearchGroup = () => {
  const [activeFilters, setActiveFilters] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [modalType, setModalType] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<Team | undefined>(
    undefined
  )
  const [initialLoad, setInitialLoad] = useState(true)
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const fetchMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<TeamResponse, Error>({
    queryKey: ['groupPage', searchTerm, activeFilters],
    queryFn: async ({ pageParam = 0 }: QueryFunctionContext) => {
      const page = typeof pageParam === 'number' ? pageParam : 0
      return getGroup(page, 16, 'teamId,asc', searchTerm, activeFilters)
    },
    getNextPageParam: (lastPage: TeamResponse) => {
      return !lastPage.last ? lastPage.pageable.pageNumber + 1 : undefined
    },
    enabled: initialLoad,
    refetchOnWindowFocus: false,
    initialPageParam: 0,
  })

  const groups = data?.pages.flatMap((page) => page.content) || []

  useEffect(() => {
    if (!fetchMoreRef.current) return undefined
    const fetchMoreElement = fetchMoreRef.current

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      })
    }, options)

    observerRef.current.observe(fetchMoreElement)

    return (): void => {
      if (observerRef.current && fetchMoreElement) {
        observerRef.current.unobserve(fetchMoreElement)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    if (initialLoad) {
      refetch().then(() => setInitialLoad(false))
    }
  }, [initialLoad, refetch])

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const toggleFilter = (tagId: number | null | undefined) => {
    if (tagId !== null && tagId !== undefined) {
      setActiveFilters(
        activeFilters.includes(tagId)
          ? activeFilters.filter((id) => id !== tagId)
          : [...activeFilters, tagId]
      )
      setInitialLoad(true)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const executeSearch = () => {
    refetch()
  }

  const handleGroupClick = (group: Team) => {
    setSelectedGroup(group)
    setPassword('')
    if (group.maxParticipants === group.currentParticipants) {
      setModalType('max')
    } else {
      setModalType(group.hasPassword ? 'password' : 'info') // 기존 로직 유지
    }
  }

  const closeModal = () => {
    setModalType('')
    setPassword('')
  }

  const verifyPasswordSuccess = () => {
    setModalType('info')
  }

  const handlePasswordIncorrect = () => {
    setModalType('error')
  }

  const refreshGroups = () => {
    refetch()
  }

  const navigateToAddGroup = () => {
    navigate('/addGroup')
  }

  if (isLoading) return <Loading />
  if (isError) return <Error />

  return (
    <PageWrapper>
      <PageContainer>
        <PageTitle>그룹 탐색</PageTitle>
        <SearchBar
          onChange={handleSearchChange}
          value={searchTerm}
          onSearch={executeSearch}
        />
        <TagFilter
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
        />
        {groups && (
          <>
            <GroupListContainer
              groups={groups}
              searchTerm={searchTerm}
              onCardClick={handleGroupClick}
            />
            <LoadingTrigger ref={fetchMoreRef}>
              {isFetchingNextPage && <Loading />}
            </LoadingTrigger>
          </>
        )}
        {modalType && (
          <GroupModal
            modalType={modalType}
            selectedGroup={selectedGroup}
            password={password}
            onPasswordChange={handlePasswordChange}
            onClose={closeModal}
            onPasswordIncorrect={handlePasswordIncorrect}
            onPasswordVerified={verifyPasswordSuccess}
            refreshGroups={refreshGroups}
          />
        )}
      </PageContainer>
      <AddButton onClick={navigateToAddGroup}>+</AddButton>
    </PageWrapper>
  )
}

/* Page */
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 55px);
  overflow-y: auto;
`

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const PageTitle = styled.p`
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: bold;
`

const AddButton = styled.button`
  align-self: flex-end;
  margin-top: auto;
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 100px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: rgba(181, 195, 233, 0.8);
  color: white;
  font-size: 24px;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover {
    background-color: #b5c3e9;
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

const LoadingTrigger = styled.div`
  height: 20px;
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default SearchGroup
