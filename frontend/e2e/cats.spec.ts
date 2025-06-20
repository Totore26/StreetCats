import { test, expect } from '@playwright/test';

test.describe('Streetcats E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/');
    });

    
});