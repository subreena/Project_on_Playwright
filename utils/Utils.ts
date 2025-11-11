import { UserModel } from "../models/userModel";
import * as path from "path";
import * as dotenv from "dotenv";
import  * as fs from 'fs';
import userData from "../resources/userData.json";

export function generateRandomNumber(min: number, max: number){
    return Math.floor(Math.random()*(max-min)+min);
} 


export function saveJsonData(jsonObject: UserModel, fileUrl:string):void{
    let dataArray: UserModel[] = userData;
    dataArray.push(jsonObject);
    fs.writeFileSync(fileUrl, JSON.stringify(dataArray,null,2))    
}

export function getLastUser(filePath:string):UserModel{
    let data = JSON.parse(fs.readFileSync(filePath,"utf-8"));
    return data[data.length-1];
}

export function updateJsonData(email:string,password:string, fileUrl:string):void{
  let data = JSON.parse(fs.readFileSync(fileUrl,"utf-8"));
 for(let i=0; i<data.length;i++){
 if(data[i].email === email){
    data[i].password = password;
    break;  
  }
 }
   fs.writeFileSync(fileUrl, JSON.stringify(data, null, 2), "utf-8");
}

export function saveEnv(
  key: string,
  value: string,
  envFilePath?: string
): void {
  const envPath = envFilePath || path.resolve(__dirname, "..", ".env");
  const newLine = `${key}=${value}`;
  const exists = fs.existsSync(envPath);

  let content = exists ? fs.readFileSync(envPath, "utf-8") : "";

  // Replace existing key or append if missing
  content = content.match(new RegExp(`^${key}=`, "m"))
    ? content.replace(new RegExp(`^${key}=.*`, "m"), newLine)
    : `${content.trim()}\n${newLine}\n`;

  fs.writeFileSync(envPath, content.trim() + "\n", "utf-8");
  console.log(`Saved ${key} to ${envPath}`);
}
export function reloadEnv() {
  dotenv.config({ override: true });
}