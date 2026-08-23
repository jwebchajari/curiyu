const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
	serverExternalPackages: ["firebase-admin", "jwks-rsa"],
};

export default nextConfig;
