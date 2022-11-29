import fsPromises from 'fs/promises'
import path from 'path'
import * as url from 'url'


export const __dirname = () => url.fileURLToPath(new URL('.', import.meta.url))

export const ensureDir = async s => await fsPromises.mkdir(path.dirname(s), { recursive: true })

export const fileStat = async fp => await fsPromises.stat(fp)

export const fileSize = async fp => (await fsPromises.stat(fp)).size

