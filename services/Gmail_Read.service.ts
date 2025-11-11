import {request} from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

async function fetchID(){
    const api = await request.newContext({
        baseURL: 'https://gmail.googleapis.com',
        extraHTTPHeaders: {
            "Accept" : "*/*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
         }
    });
    const response = await api.get("/gmail/v1/users/me/messages");
    const data = await response.json()
    const emailID = data.messages[0].id;
    return emailID;
}

export async function readLatestEmail() {
    const id = await fetchID();
    const api = await request.newContext({
        baseURL: "https://gmail.googleapis.com",
        extraHTTPHeaders: {
            "Accept" : "*/*",
            "Content-Type":"application/json",
            "Authorization": `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`
        }
    });

    const response = await api.get("gmail/v1/users/me/messages/"+id);
    const resJson = await response.json();
    const latestEmail = resJson.snippet;
    return latestEmail;
    
}