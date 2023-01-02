/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
}

module.exports = {
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
}

module.exports = nextConfig
