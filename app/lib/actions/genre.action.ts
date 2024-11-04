"use server"

import { CreateGenreParams } from "@/types/index"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Genre from "../database/models/listing.model"

export const createGenre = async ({ genreName, type }: CreateGenreParams) => {
    try {
        await connectToDatabase();

        const newGenre = await Genre.create({ name: genreName, type });

        return JSON.parse(JSON.stringify(newGenre));
    } catch (error) {
        handleError(error)
    }
}

export const getAllGenres = async () => {
    try {
        await connectToDatabase();

        const genres = await Genre.find();

        return JSON.parse(JSON.stringify(genres));
    } catch (error) {
        handleError(error)
    }
}