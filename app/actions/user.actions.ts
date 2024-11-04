'use server'

import { revalidatePath } from 'next/cache'
import { handleError } from '@/app/lib/utils'

import { CreateUserParams } from '@/app/types/index'
import { connectToDatabase } from '../lib/database'
import User from '../lib/database/models/user.model'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user)

    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    //if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}


export async function getUserByEmail(email: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email })

    //if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
};