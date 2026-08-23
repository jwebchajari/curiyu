const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
	experimental: {
		serverComponentsExternalPackages: ["firebase-admin", "jwks-rsa"],
	},
};

export default nextConfig;
