/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	serverRuntimeConfig: {
		gamers: [
			{
				id: 0,
				firstName: 'Pat',
				lastName: 'McCoy',
				bggUsername: 'baldgoat',
			},
		],
	},
	publicRuntimeConfig: {
		perPage: 25,
	},
}

module.exports = nextConfig
