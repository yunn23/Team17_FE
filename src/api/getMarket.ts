import axiosInstance from "./axiosInstance"

interface Tags {
    tagId: number
    productTagName: string
}

interface Content {
    productId: number
    imageUrl: string
    productUrl: string
    name: string
    price: number
    storeName: string
    tag: Tags[] 
}

interface MarketResponse {
    content: Content[]
}

const getMarket = async ( tagIds?: number ): Promise<MarketResponse> => {
    const response = await axiosInstance.get('/api/market', {
        params: tagIds ? { tagIds } : undefined
    })
    return response.data
}

export default getMarket