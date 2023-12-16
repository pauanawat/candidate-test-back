
import { createUser } from '../initData/initDataUser'
import { createPost } from '../initData/initDataPost'

export const initData = async () => {
    await createUser()
    await createPost()
} 