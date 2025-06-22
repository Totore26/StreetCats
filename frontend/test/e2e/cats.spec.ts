/*
    1. Visualizza mappa
    2. ⁠Cambia tra le tab mappa e lista
    3. ⁠Navigazione alla home
    4. ⁠Navigazione login e visualizzazione form
    5. ⁠Navigazione registrazione e visualizzazione form
    6. ⁠Verifica footer della pagina
    7. ⁠Verifica navbar
    8. ⁠Verificare che i link di navigazione funzionino
    9. ⁠Verifica validazione form login
    10. ⁠Verifica validazione form signup
*/


import { test, expect } from '@playwright/test';

test.describe('StreetCats App Testing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/');
        await page.waitForLoadState('networkidle');
    });

    test('1. Visualizza mappa', async ({ page }) => {
        // Verifica che la mappa sia visibile
        await expect(page.locator('#map')).toBeVisible();
        
        // Verifica che il contenitore della mappa sia visibile
        await expect(page.locator('.map-wrapper')).toBeVisible();

        // Verifica che la navbar sia visibile
        await expect(page.locator('nav')).toBeVisible();

        // Verifica che il footer sia visibile
        await expect(page.locator('footer.footer')).toBeVisible();
    });

    test('2. Cambia tra le tab mappa e lista', async ({ page }) => {
        // Verifica che ci sia un elemento mat-tab-group
        await expect(page.locator('mat-tab-group')).toBeVisible();
        
        // Clicca sulla tab Lista
        await page.getByRole('tab', { name: 'Lista' }).click();
        
        // Verifica che ci sia il titolo degli avvistamenti
        await expect(page.getByText('Avvistamenti recenti')).toBeVisible();
        
        // Torno alla tab Mappa
        await page.getByRole('tab', { name: 'Mappa' }).click();
        
        // Verifica che la mappa sia ancora visibile
        await expect(page.locator('#map')).toBeVisible();
    });

    test('3. Navigazione alla home', async ({ page }) => {
        // Clicca sul logo per Tornare alla home
        await page.locator('a[routerLink="/"]').first().click();
        
        // Verifica che siamo nella home page
        await expect(page.url()).toContain('http://localhost:4200/');

        // Verifica che la mappa sia visibile 
        await expect(page.locator('#map')).toBeVisible();

        // Clicca sul link Home nella navbar
        await page.locator('a[routerLink="/"]').first().click();

        // Verifica che siamo ancora nella home page
        await expect(page.url()).toContain('http://localhost:4200/');
        
        // Verifica che la mappa sia visibile 
        await expect(page.locator('#map')).toBeVisible();
    });

    test('4. Navigazione login e visualizzazione form', async ({ page }) => {
        // Clicca sul link Login
        await page.locator('a[routerLink="/login"]').click();
        
        // Verifica che siamo nella pagina di login
        await expect(page.getByRole('heading', { name: 'Accedi al tuo account' })).toBeVisible();
        
        // Verifica che ci siano i campi del form
        await expect(page.locator('#user')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        
        // Verifica che ci sia il pulsante di login
        await expect(page.getByRole('button', { name: 'Accedi' })).toBeVisible();
    });

    test('5. Navigazione registrazione e visualizzazione form', async ({ page }) => {
        // Clicca sul link Signup
        await page.locator('a[routerLink="/signup"]').first().click();
        
        // Verifica che siamo nella pagina di registrazione
        await expect(page.getByRole('heading', { name: 'Crea un nuovo account' })).toBeVisible();
        
        // Verifica che ci siano i campi del form
        await expect(page.locator('#user')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        
        // Verifica che ci sia la checkbox per i termini e le condizioni
        await expect(page.locator('#terms')).toBeVisible();
        
        // Verifica che ci sia il pulsante di registrazione
        await expect(page.getByRole('button', { name: 'Registrati' })).toBeVisible();
    });

    test('6. Verifica footer della pagina', async ({ page }) => {
        // Verifica che il footer sia presente
        await expect(page.locator('footer.footer')).toBeVisible();
        
        // Verifica il testo del copyright
        await expect(page.locator('footer')).toContainText('tutti i diritti riservati');
        
        // Verifica che ci siano i link ai social
        await expect(page.locator('footer a[href="https://twitter.com"]')).toBeVisible();
        await expect(page.locator('footer a[href="https://facebook.com"]')).toBeVisible();
        await expect(page.locator('footer a[href="https://instagram.com"]')).toBeVisible();
    });

    test('7. Verifica navbar', async ({ page }) => {
        // Verifica che la navbar sia presente
        await expect(page.locator('nav')).toBeVisible();
        
        // Verifica che ci sia il logo
        await expect(page.locator('nav span:has-text("Street")')).toBeVisible();
        
        // Verifica che ci sia il link Home
        const homeLinks = page.locator('a[routerLink="/"]');
        await expect(homeLinks.first()).toBeVisible();

        // se non sono loggato devono esserci i link per login e registrazione
        const loginLink = page.locator('a[routerLink="/login"]');
        const signupLink = page.locator('a[routerLink="/signup"]');
        await expect(loginLink).toBeVisible();
        await expect(signupLink).toBeVisible();
    });

    test('8. Verificare che i link di navigazione funzionino', async ({ page }) => {
        // Clicca sul link Login
        await page.locator('a[routerLink="/login"]').click();
        await expect(page.url()).toContain('/login');
        
        // Clicca sul link Signup dalla pagina di login
        await page.locator('a[routerLink="/signup"]:has-text("Signup")').click();
        await expect(page.url()).toContain('/signup');
        
        // Torno alla home
        await page.locator('a[routerLink="/"]').first().click();
        await expect(page.url()).toBe('http://localhost:4200/');
    });

    test('9. Verifica validazione form login', async ({ page }) => {
        // Vado alla pagina di login
        await page.locator('a[routerLink="/login"]').click();
        
        // Verifica che appaiano i messaggi di errore per campi obbligatori
        await page.locator('#user').click();
        await page.locator('#password').click();
        await page.locator('form').click(); // click fuori dai campi per attivare la validazione
        
        // Clicco su Accedi senza compilare i campi
        await page.getByRole('button', { name: 'Accedi' }).click();
        
        // A questo punto dovrebbero essere visibili i messaggi di errore, se la validazione è attiva
        const errorElements = page.locator('.text-red-600');
        const count = await errorElements.count();

    });

    test('10. Verifica validazione form signup', async ({ page }) => {
        // Vado alla pagina di registrazione
        await page.locator('a[routerLink="/signup"]').first().click();
        
        // Verifica che appaiano i messaggi di errore per campi obbligatori

        await page.locator('#user').click();
        await page.locator('#password').click();
        await page.locator('form').click(); // click fuori dai campi per attivare la validazione
        
        // Clicca su Registrati senza compilare i campi
        await page.getByRole('button', { name: 'Registrati' }).click();
        
        // A questo punto dovrebbero essere visibili i messaggi di errore, se la validazione è attiva
        const errorElements = page.locator('.text-red-600');
        const count = await errorElements.count();

    });
});