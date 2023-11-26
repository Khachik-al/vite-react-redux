import { f } from './index'

type CategoryList = {
  token: string
  type: 'faq' | 'tutorial'
}

export const getAllCategories = ({ token, type }: CategoryList) =>
  f({ method: 'get', path: `/${type}-category` })({ token, body: {} })

export const getContent = ({
  token,
  filteredData,
  order,
  page = 1,
  pageSize = 10,
}: {
  token: string
  filteredData: any
  order?: any
  page?: number
  pageSize?: number
}) => {
  const getQuery = () => {
    const queryArr = Object.keys(filteredData)
      .filter((item) => filteredData[item] !== '')
      .map((item) => `${item}=${filteredData[item]}`)

    return `${queryArr.join('&')}&${order.sortKey}=${order.order}`
  }
  const query = getQuery()

  return f({
    method: 'get',
    path: `/content/?page=${page}&size=${pageSize}&${query}`,
  })({ token, body: {} })
}

export const cloneContentById = ({
  id,
  token,
  type,
}: {
  id: string
  token: string
  type: 'faq' | 'tutorial'
}) => f({ method: 'POST', path: `/${type}/${id}/copy` })({ token })
