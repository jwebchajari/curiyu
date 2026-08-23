/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
	// 🔥 Esto arregla el error de ESM y CommonJS con Firebase Admin
	serverExternalPackages: ["firebase-admin", "jwks-rsa"],
};

export default nextConfig;
