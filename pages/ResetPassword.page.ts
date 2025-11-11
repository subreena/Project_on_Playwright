import {Page} from '@playwright/test';
import { readLatestEmail } from '../services/Gmail_Read.service';


export class ResetPassword{
    constructor(private page:Page){ }

    async doResetPassword(email:string){
        await this.page.getByRole('link', { name: 'Reset it here' }).click();
        await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
        await this.page.getByRole('button', { name: 'Send Reset Link' }).click();
        await this.page.getByRole('textbox', { name: 'Email' }).click();
        }

    async doInputNewPassword(password: string){
        await this.page.getByRole('textbox', { name: 'Confirm Password' }).fill(password);
        await this.page.getByRole('textbox', { name: 'New Password' }).fill(password);
        await this.page.getByRole('button',{name:  "RESET PASSWORD"}).click();
    }
}