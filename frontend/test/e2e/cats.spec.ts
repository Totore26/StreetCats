import { test, expect } from '@playwright/test';

test.describe('StreetCats E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // vado alla homepage
        await page.goto('http://localhost:4200/');
        // resetto il datsbase
        await page.evaluate(() => { return fetch('http://localhost:3000/reset', { method: 'GET' }); });
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

    test('2. Signup con credenziali corrette', async ({ page }) => {
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

    test('3. verifica il funzionamento del logout ', async ({ page })=> { 
        // mi registro
        await page.getByRole('link', { name: 'Signup' }).click();
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('12345');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('checkbox', { name: 'Accetto i Termini e Condizioni' }).check();
        await page.getByRole('button', { name: 'Registrati' }).click();
        // mi loggo
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('12345');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('button', { name: 'Accedi' }).click();
        // effettuo logout
        await page.getByRole('button', { name: 'Logout' }).click();
        // verifico il toastr di successo
        await expect(page.locator('.toast-success')).toBeVisible({ timeout: 5000 });
    });

    test('4. verifica che commentare richiede autenticazione', async ({ page }) => {
        // mi registro
        await page.getByRole('link', { name: 'Signup' }).click();
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('123454');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('123454');
        await page.getByRole('checkbox', { name: 'Accetto i Termini e Condizioni' }).check();
        await page.getByRole('button', { name: 'Registrati' }).click();
        // mi loggo
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('123454');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('123454');
        await page.getByRole('button', { name: 'Accedi' }).click();
        // creo un avvistamento
        await page.locator('#map').click();
        await page.getByRole('button', { name: 'Marker' }).click();
        await page.getByRole('textbox', { name: 'Titolo' }).click();
        await page.getByRole('textbox', { name: 'Titolo' }).fill('Test');
        await page.getByRole('textbox', { name: 'Descrizione' }).click();
        await page.getByRole('textbox', { name: 'Descrizione' }).fill('descrizione del test');
        await page.getByRole('button', { name: 'Salva avvistamento' }).click();
        // disconnetto l'utente
        await page.getByRole('button', { name: 'Logout' }).click();
        // provo a commentare senza essere loggato
        await page.getByRole('tab', { name: 'Lista' }).click();
        await page.getByRole('button', { name: 'Dettagli' }).click();
        await page.getByPlaceholder('Scrivi un commento...').click();
        await page.getByPlaceholder('Scrivi un commento...').fill('prova commento senza login');
        await page.getByRole('button', { name: 'Invia commento' }).click();
        // verifica la visualizzazione del toast di warning
        await expect(page.locator('.toast-warning')).toBeVisible({ timeout: 5000 });
    });

    test('5. verifica che la creazione di avvistamenti richieda autenticazione', async ({ page }) => {
        await page.locator('#map').click();
        await page.getByRole('button', { name: 'Marker' }).click();
        //verifico che compaia il toastr di warning
        await expect(page.locator('.toast-warning')).toBeVisible({ timeout: 5000 });
    });

    test('6. verifica il funzionamento del tasto "visualizza sulla mappa" ', async ({ page }) => {
        // mi registro
        await page.getByRole('link', { name: 'Signup' }).click();
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('12345');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('checkbox', { name: 'Accetto i Termini e Condizioni' }).check();
        await page.getByRole('button', { name: 'Registrati' }).click();
        // mi loggo
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('12345');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('button', { name: 'Accedi' }).click();
        // creo un avvistamento
        await page.locator('#map').click();
        await page.getByRole('button', { name: 'Marker' }).click();
        await page.getByRole('textbox', { name: 'Titolo' }).click();
        await page.getByRole('textbox', { name: 'Titolo' }).fill('Gatto di prova');
        await page.getByRole('textbox', { name: 'Descrizione' }).click();
        await page.getByRole('textbox', { name: 'Descrizione' }).fill('descrizione di prova');
        await page.getByRole('button', { name: 'Salva avvistamento' }).click();
        // vado sulla lista e verifico che dopo aver premuto il bottone sia visibile la mappa con il marker
        await page.getByRole('tab', { name: 'Lista' }).click();
        await page.getByRole('button', { name: 'Visualizza sulla mappa' }).click();
        await expect(page.getByText('Gatto di prova Segnalato da: 12345')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Marker' })).toBeVisible();
    });

    test('7. verifica il reindirizzamento alla vista di dettaglio di un avvistamento', async ({ page })=> { 
        // mi registro
        await page.getByRole('link', { name: 'Signup' }).click();
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('1234');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('123456');
        await page.getByRole('checkbox', { name: 'Accetto i Termini e Condizioni' }).check();
        await page.getByRole('button', { name: 'Registrati' }).click();
        // mi loggo
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('1234');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('123456');
        await page.getByRole('button', { name: 'Accedi' }).click();
        // creo un avvistamento
        await page.locator('#map').click();
        await page.getByRole('button', { name: 'Marker' }).click();
        await page.getByRole('textbox', { name: 'Titolo' }).click();
        await page.getByRole('textbox', { name: 'Titolo' }).fill('Gatto di prova');
        await page.getByRole('textbox', { name: 'Descrizione' }).click();
        await page.getByRole('textbox', { name: 'Descrizione' }).fill('descrizione di prova');
        await page.getByRole('button', { name: 'Salva avvistamento' }).click();
        // vado sulla lista e verifico che dopo aver premuto il bottone dettagli siano visibili data, immagine e commenti
        await page.getByRole('tab', { name: 'Lista' }).click();
        await page.getByRole('button', { name: 'Dettagli' }).click();
        await expect(page.getByText('Avvistato il:')).toBeVisible();
        await expect(page.getByRole("img")).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Commenti' })).toBeVisible();
    });

    test('8. verifica che il tasto "Visualizza sulla mappa" non sia visibile se non ci sono avvistamenti', async ({ page }) => {
        await page.getByRole('tab', { name: 'Lista' }).click();
        await expect(page.getByRole('button', { name: 'Visualizza sulla mappa' })).toBeHidden();
    });

});
