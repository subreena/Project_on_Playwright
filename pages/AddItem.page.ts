import { Page } from '@playwright/test';
import { ItemModel } from '../models/ItemModel';
import * as fs from 'fs';

export class AddItem {
    constructor(private page: Page) { }



    async doAddItem(item: ItemModel) {

        await this.page.getByRole("button", { name: "Add cost" }).click();

        await this.page.getByLabel("Item Name").fill(item.itemName);

        await this.page.getByRole('button', { name: '+' }).click();

        await this.page.getByLabel("Amount").fill(item.amount);
        await this.page.getByRole('textbox', { name: 'Remarks' }).last().fill("This is test remarks for " + item.itemName);
    
        await this.page.getByRole("button", { name: "Submit" }).click();
        await this.page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });

    }

    async doGetItemList(filePath: string) {
        const rows = await this.page.locator("table tr");
        const rowCount = await rows.count();
        let tableData = "";

        for (let i = 0; i < rowCount; i++) {


            let cell;
            const thCount = await rows.nth(i).locator("th").count();
            if (thCount > 0) {
                cell = (await rows.nth(i).locator("th").allTextContents()).slice(0, -1).join(" | ");
            }
            else {
                cell = (await rows.nth(i).locator("td").allTextContents()).slice(0, -1).join(" | ");
            }
            tableData += cell + "\n";
        }

        // Overwrites the file each time
        fs.writeFileSync(filePath, tableData, { encoding: "utf-8" });
    }

}