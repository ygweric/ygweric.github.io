import { syncBlogImagesToPublic } from './syncBlogImagesToPublic.mjs'

async function prebuild() {
  await syncBlogImagesToPublic(process.env.WATCH === 'true')
}

prebuild()
