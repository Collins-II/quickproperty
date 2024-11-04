'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'

import {
    CreateEventParams,
    UpdateEventParams,
    DeleteEventParams,
    GetAllEventsParams,
    GetEventsByUserParams,
    GetRelatedEventsByCategoryParams,
    CreateVideoParams,
} from '../../types/index'
import Genre from '../database/models/listing.model'
import Video from '../database/models/video.model'

const getCategoryByName = async (name: string) => {
    return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const getGenreByName = async (name: string) => {
    return Genre.findOne({ name: { $regex: name, $options: 'i' } })
}


const populateEvent = (query: any) => {
    return query
        //.populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
        .populate([
            { path: 'category', model: Category, select: '_id name' },
            { path: 'genre', model: Genre, select: '_id name' }
            // Add more populate options if needed
        ])
}

// CREATE
export async function uploadVideo({ event, path }: CreateVideoParams) {
    try {
        await connectToDatabase()

        /*const organizer = await User.findById(userId)
        if (!organizer) throw new Error('Organizer not found')*/

        const newEvent = await Video.create({ ...event, category: event.categoryId, genre: event.genre })
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        handleError(error)
    }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
    try {
        await connectToDatabase()

        const event = await populateEvent(Event.findById(eventId))

        if (!event) throw new Error('Event not found')

        return JSON.parse(JSON.stringify(event))
    } catch (error) {
        handleError(error)
    }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
        await connectToDatabase()

        const eventToUpdate = await Video.findById(event._id)
        if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
            throw new Error('Unauthorized or event not found')
        }

        const updatedEvent = await Video.findByIdAndUpdate(
            event._id,
            { ...event, category: event.categoryId },
            { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
        handleError(error)
    }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category, genre }: GetAllEventsParams) {
    try {
        await connectToDatabase();

        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {};
        const categoryCondition = category ? { category: await getCategoryByName(category) } : {};
        const genreCondition = genre ? { genre: await getGenreByName(genre) } : {};

        const conditions = {
            $and: [titleCondition, genreCondition, categoryCondition],
        };

        const skipAmount = (Number(page) - 1) * limit;
        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit);

        const events = await populateEvent(eventsQuery);
        const eventsCount = await Video.countDocuments(conditions);

        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount / limit),
        };
    } catch (error) {
        handleError(error);
        throw error; // Re-throw the error to propagate it further if needed
    }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
        await connectToDatabase()

        const conditions = { organizer: userId }
        const skipAmount = (page - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Video.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
}: GetRelatedEventsByCategoryParams) {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Video.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}
