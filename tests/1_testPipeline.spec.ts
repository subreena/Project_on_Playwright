import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { Registration } from "../pages/Registration.page";
import { UserModel } from "../models/userModel";
import { generateRandomNumber, getLastUser, reloadEnv, saveEnv, saveJsonData } from "../utils/Utils";
import { readLatestEmail } from "../services/Gmail_Read.service";
import { Login } from "../pages/Login.page";
import { AddItem } from "../pages/AddItem.page";
import { ItemModel } from "../models/ItemModel";
import { ResetPassword } from "../pages/ResetPassword.page";
import * as dotenv from "dotenv";
import { UploadImage } from "../pages/UploadImage.page";
dotenv.config({ override: true });


test.describe.serial("User Registration", async () => {

    let page: Page;
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
    });

    test.afterAll(async () => {
        await page.close();
    })

    test("Create New User", async () => {
        await page.goto("https://dailyfinance.roadtocareer.net/");

        const person: UserModel = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: `teachercopilot123+${generateRandomNumber(100, 999)}@gmail.com`,
            password: "1234",
            phoneNumber: `01905${generateRandomNumber(100000, 999999)}`,
            address: faker.location.streetAddress()
        }

        const registerUser = new Registration(page);
        await registerUser.userRegistration(person);

        saveJsonData(person, "./resources/userData.json");
        await page.waitForTimeout(5000);
        let latestEmail = await readLatestEmail();
        console.log(latestEmail);
        expect(latestEmail).toContain("Welcome to our platform");

    })

    test("User can Login", async () => {
        await page.goto("https://dailyfinance.roadtocareer.net/")
        const login = new Login(page);
        let data = getLastUser("./resources/userData.json");

        await page.waitForTimeout(5000);
        let email = data.email;
        let password = data.password;
        console.log(email + "\n" + password);
        await login.doLogin(email, password);
        //     const actual = await page.getByRole("heading", { name: "User Daily Costs" }).textContent();
        //    await expect(actual).toEqual("User Daily Costs");
        await expect(page).toHaveURL(/.*\/user/);
    })

    test("Create Item", async () => {
        const itemPage = new AddItem(page);
        for (let index = 0; index < 2; index++) {

            const itemData: ItemModel = {
                itemName: faker.commerce.product(),
                amount: generateRandomNumber(1000, 9999).toString(),
            }
            await itemPage.doAddItem(itemData);
            console.log(itemData);
        }
        await page.waitForTimeout(2000);
        // await page.pause();

    })


    test("Get item in table", async () => {
        const tableData = await page.getByRole("table").allInnerTexts();
        console.log(tableData);
        const getItem = new AddItem(page);
        await getItem.doGetItemList("./resources/items.txt");
        // await page.pause();

    })

    test("User can logout", async () => {
        const logout = new Login(page);
        await logout.doLogout();
    })

    test("User can reset password", async () => {
        await page.goto('https://dailyfinance.roadtocareer.net/');
        const reset = new ResetPassword(page);
        let resetEmail = getLastUser("./resources/userData.json").email;
        saveEnv("userEmail", resetEmail);
        await reset.doResetPassword(resetEmail)
        await page.waitForTimeout(5000);
        let lastEmail = await readLatestEmail();
        console.log(lastEmail);
        await page.waitForTimeout(5000);
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const match = lastEmail.match(urlRegex);

        if (match) {
            const resetUrl = new URL(match[0]);
            console.log("Navigating to:", resetUrl);
            await page.goto(resetUrl.href, { waitUntil: "domcontentloaded" });
            const newPassword = "newPassword";
            saveEnv("userPassword", newPassword);
            await reset.doInputNewPassword(newPassword);
        } else {
            throw new Error("No reset link found in email");
        }
    })

    test("User can upload image", async () => {
        await page.goto('https://dailyfinance.roadtocareer.net/');
        const newLogin = new Login(page);
        reloadEnv();
        const email = process.env.userEmail!;
        const pass = process.env.userPassword!;

        await newLogin.doLogin(email, pass);
        const uploadImage = new UploadImage(page);
        await uploadImage.doUploadImage("./resources/profile_image.png");

        const profileImage = page.locator('img.profile-image');
        await expect(profileImage).toBeVisible();
        await page.waitForTimeout(5000);
        const src = await profileImage.getAttribute('src');
        expect(src).toContain('profileImage');

    })

})