import styled from '@emotion/styled'
import React from 'react'
import GroupList from './GroupList'
import { Team } from '../api/getGroup'

interface GroupListContainerProps {
  groups: Team[]
  searchTerm: string
  onCardClick: (group: Team) => void
}

const GroupListContainer: React.FC<GroupListContainerProps> = ({
  groups,
  searchTerm,
  onCardClick,
}) => {
  const filteredGroups = groups.filter((group) =>
    group.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!groups || groups.length === 0)
    return (
      <NoGroupsMessage>
        일치하는 그룹이 <br />
        없습니다.
      </NoGroupsMessage>
    )

  return (
    <GroupList
      groups={filteredGroups}
      showMenuButton={false}
      onCardClick={onCardClick}
    />
  )
}

const NoGroupsMessage = styled.div`
  font-size: 18px;
  margin-top: 40px;
  padding: 100px;
  text-align: center;
  color: #8e8e8e;
`

export default GroupListContainer
