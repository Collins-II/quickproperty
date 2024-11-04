"use server"

import { CreateCategoryParams } from "@/types/index"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/reservation.model"

export const createCategory = async ({ categoryName, type }: CreateCategoryParams) => {
  try {
    await connectToDatabase();

    const newCategory = await Category.create({ name: categoryName, type });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error)
  }
}

export const getAllCategories = async () => {
  try {
    await connectToDatabase();

    const categories = await Category.find();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error)
  }
}