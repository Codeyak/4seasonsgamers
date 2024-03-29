import { NextApiRequest } from 'next'

export const stringFromParameter = (req: NextApiRequest, key: string):string => {
	const item = req.query[key]
	if (Array.isArray(item)) { return item[0] }
	return String(item)
}

export const arrayFromParameter = (req: NextApiRequest, key: string):string[] => {
	const item = req.query[key]
	if (Array.isArray(item)) { return item }
	return [ String(item) ]
}
