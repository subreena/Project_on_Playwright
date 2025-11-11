import { Page } from "@playwright/test";

export class UploadImage {
  constructor(private page: Page) { }

  async doUploadImage(imageUrl: string) {
    await this.page.getByRole('button', { name: 'account of current user' }).click();
    await this.page.getByRole('menuitem', { name: 'Profile' }).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Choose File' }).setInputFiles(imageUrl);
    this.page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => { });
    });
    await this.page.getByRole('button', { name: 'Upload Image' }).click();
    await this.page.getByRole('button', { name: 'Update' }).click();
  }
}