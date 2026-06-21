import fs from 'fs'
import path from 'path'

try {
  const src = 'C:/Users/admin/.gemini/antigravity-ide/brain/845f3791-d8ee-400a-9d4d-abe4c69c1726/hero_3d_cab_1781668059607.png'
  const dest = 'd:/CAB_Web/cab-booking-app/public/hero_cab.png'
  const destDir = path.dirname(dest)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log('Successfully copied hero_cab.png to public/')
  } else {
    console.error('Source hero_cab.png not found at ' + src)
  }
} catch (e) {
  console.error('Error copying hero image:', e)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

