import { Page } from '@playwright/test'
import { UserModel } from '../models/userModel';

export class Registration {
    constructor(private page: Page) { }
    // async navigate() {
    //     await this.page.goto("/");
    // }
    async userRegistration(user: UserModel) {

        await this.page.getByRole("link", { name: "Register" }).click();
        await this.page.getByLabel("First Name").fill(user.firstName);
        await this.page.getByLabel("Last Name").fill(user.lastName);
        await this.page.getByLabel("Email").fill(user.email);
        await this.page.getByLabel("Password").fill(user.password);
        await this.page.getByLabel("Phone Number").fill(user.phoneNumber);
        await this.page.getByLabel("Address").fill(user.address);

        await this.page.getByRole("radio").nth(1).check();
        await this.page.getByRole("checkbox").check();

        await this.page.getByRole("button", { name: "REGISTER" }).click()
    }

}