import * as bcrypt from 'bcryptjs'

export const compare = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const hash = (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}
