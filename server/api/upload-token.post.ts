import { AuraImage } from '@auraimage/sdk'

const aura = new AuraImage({
  secretKey: process.env.AURAIMAGE_SECRET_KEY!,
  projectName: process.env.AURAIMAGE_PROJECT_NAME!
})

const cdnUrl = process.env.CDN_URL || 'https://cdn.auraimage.ai'

export default defineEventHandler(async () => {
  try {
    const token = await aura.signUpload()
    return { token, cdnUrl }
  } catch (err) {
    console.error(err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to sign upload token' })
  }
})
