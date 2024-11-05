import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import getMarket from '../api/getMarket'
import Loading from '../components/Loading'
import Error from '../components/Error'
import marketTag from '../mocks/marketTag'
import MarketTagFilter from '../components/MarketTagFilter'


const Market = () => {

  const [tagId, setTagId] = useState<number | undefined>(undefined)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['market', tagId],
    queryFn: () => getMarket(tagId),
    retry: 1
  })

  const [activeTag, setActiveTag] = useState<number | null>(null)
  const toggleFilter = (tagIdTmp: number) => {
    const newActiveTag = activeTag === tagIdTmp ? null : tagIdTmp
    setActiveTag(newActiveTag)
    setTagId(newActiveTag || undefined)
  }
  

  if (isLoading) return <Loading />
  if (isError) return <Error name="마켓화면" />

  return (
    <MarketWrapper>
      <MarketTitle>마켓</MarketTitle>
      <MarketTagFilter
        tags={marketTag.tagList}
        activeTag={activeTag}
        onToggleFilter={toggleFilter}
      />
      <ProductWrapper>
        {data?.content.map((product) => (
          <ProductLink key={product.productId} href={product.productUrl} target='_blank' rel='noopener noreferrer'>
            <ProductContainer>
              <ProductPhoto src={product.imageUrl} alt={product.name} width={90} height={90} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductSite>{product.storeName}</ProductSite>
                <ProductPrice>
                  {Number(product.price).toLocaleString()}원
                </ProductPrice>
              </ProductInfo>
          </ProductContainer>
          </ProductLink>
          
        ))}
      </ProductWrapper>
    </MarketWrapper>
  )
}

const MarketWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 55px);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const MarketTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 18px;
  font-weight: 500;
`

const ProductWrapper = styled.div`
  overflow-y: auto;
`

const ProductContainer = styled.div`
  border-radius: 10px;
  border: 2px solid #b5c3e9;
  margin: 10px 5px;
  display: flex;
  flex-direction: row;
`

const ProductLink = styled.a`
  text-decoration: none;
  color: inherit;
`

const ProductPhoto = styled.img`
  margin: 10px;
  width: 90px;
  height: 90px;
  border-radius: 5px;
  padding: 2px 10px;
`

const ProductInfo = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 65%;
`

const ProductName = styled.div`
  margin-top: 20px;
`

const ProductSite = styled.div`
  color: #8e8e8e;
  margin-top: 7px;
  font-size: 14px;
`

const ProductPrice = styled.div`
  margin-top: 10px;
  align-self: flex-end;
  margin-right: 20px;
`

export default Market
