/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 暂时移除 transpilePackages，因为 pdf-lib 的 ESM 版本现在应该可用了
  // transpilePackages: ['pdf-lib'], 
};

export default nextConfig; 