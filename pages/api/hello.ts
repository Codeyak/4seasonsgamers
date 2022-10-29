// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { bggAPIService } from '~/services/bggAPIService'

const bggAPIServiceInstance = bggAPIService()

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const person = bggAPIServiceInstance.getUserGamesOwned('baldgoat')
  console.log('PERSON', person)
  res.status(200).json(person)
}
