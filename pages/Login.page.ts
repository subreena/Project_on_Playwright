import { Page } from "@playwright/test";
export class Login {
    constructor(private page: Page) { }
    async doLogin(email: string, password: string) {
        await this.page.getByRole("textbox").first().fill(email);
        await this.page.getByRole("textbox").nth(1).fill(password);
        await this.page.getByRole("button", { name: "LOGIN" }).click();
    }

    async doLogout() {
        await this.page.getByRole('button', { name: 'account of current user' }).click();
        await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    }
}