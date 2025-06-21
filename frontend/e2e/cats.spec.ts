import { test, expect } from '@playwright/test';

test.describe('StreetCats E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/');
    });

    test('1. login con credenziali errrate', async ({ page }) => {
        await page.goto('http://localhost:4200/');
        await page.getByRole('link', { name: 'Login' }).click();
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('FakeUsername');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('FakePassw');
        await page.getByRole('button', { name: 'Accedi' }).click();
        await page.getByRole('button', { name: 'Accedi' }).click();
    });

    test('2. Signup con credenziali giuste', async ({ page }) => {
        await page.getByRole('link', { name: 'Signup' }).click();
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('123456789');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('123456789');
        await page.getByRole('checkbox', { name: 'Accetto i Termini e Condizioni' }).check();
        await page.getByRole('button', { name: 'Registrati' }).click();
        // verifica reindirizzamento alla pagina di login
        await expect(page).toHaveURL('http://localhost:4200/login', { timeout: 5000 });
        // verifica che il toast di successo sia visibile
        await expect(page.locator('.toast-success')).toBeVisible({ timeout: 5000 });
    });

    test('il commento richiede autenticazione', async ({ page }) => {
        await page.goto('http://localhost:4200/');
        await page.getByRole('tab', { name: 'Lista' }).click();
        await page.getByRole('button', { name: 'Dettagli' }).click();
        await page.getByPlaceholder('Scrivi un commento...').click();
        await page.getByPlaceholder('Scrivi un commento...').fill('Buongiorno');
        await page.getByRole('button', { name: 'Invia commento' }).click();
        // verifica la visualizzazione del toast di warning
        await expect(page.locator('.toast-warning')).toBeVisible({ timeout: 5000 });
    });

    test('verifica che la creazione richieda autenticazione', async ({ page }) => {
        await page.goto('http://localhost:4200/');
        await page.locator('#map').click();
        await page.getByRole('button', { name: 'Marker' }).nth(1).click();
        //verifico che compaia il toastr di warning
        await expect(page.locator('.toast-warning')).toBeVisible({ timeout: 5000 });
    });


    // verifica il funzionamento del pulsante "Visualizza sulla mappa
    // verifica la visualizzazione dei dettagli di un avvistamento
    // 1. Visualizza la homepage con la mappa e gli avvistamenti
    // 5. Verifica che la creazione di un avvistamento richieda autenticazione
});