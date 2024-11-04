import axios from 'axios';

const URL = 'https://www.googleapis.com/youtube/v3/videos';
const API_KEY = process.env.YOUTUBE_API_KEY;

async function uploadVideoToYouTube(title: string, description: string, videoUrl: string,/* accessToken: string*/) {
    let accessToken = ''

    const videoData = {
        snippet: {
            title,
            description,
        },
        status: {
            privacyStatus: 'private', // You can set privacyStatus to 'public' if you want the video to be public
        },
    };

    try {
        const response = await axios.post(URL, {
            snippet: {
                title,
                description,
            },
            status: {
                privacyStatus: 'private', // Change as needed (private, public, unlisted)
            },
        }, {
            params: {
                part: 'snippet,status',
                key: API_KEY,
            },
        });

        console.log('Video uploaded successfully:', response.data);
        return response
    } catch (error) {
        console.error('Error uploading video to YouTube:', error);
    }
}

export default uploadVideoToYouTube;
