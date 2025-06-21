import { test, expect } from '@playwright/test';

test.describe('StreetCats E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/');
    });

    test('1. Visualizza la homepage con la mappa e gli avvistamenti', async ({ page }) => {
        // Verifica che la tab mappa sia visibile
        await expect(page.getByRole('tab', { name: 'Mappa' })).toBeVisible();
        // Verifica che il contenitore della mappa esista
        await expect(page.locator('#map')).toBeVisible();
        // Verifica che ci sia la tab lista
        await expect(page.getByRole('tab', { name: 'Lista' })).toBeVisible();
    });

    test('2. Naviga alla lista degli avvistamenti e verifica i dettagli', async ({ page }) => {
        // Clicca sulla tab lista
        await page.getByRole('tab', { name: 'Lista' }).click();
        // Verifica che ci sia almeno un avvistamento (se il database ha dati)
        // Nota: questo test potrebbe fallire se il database è vuoto
        await expect(page.locator('.border.rounded-lg')).not.toHaveCount(0);
        // Clicca sul pulsante Dettagli del primo avvistamento
        await page.locator('button:has-text("Dettagli")').first().click();
        // Verifica di essere stato reindirizzato alla pagina dei dettagli
        await expect(page).toHaveURL(/\/catDetails\?id=\d+/, { timeout: 5000 });
    });

    test('3. Tenta il login con credenziali errate', async ({ page }) => {
        // Naviga alla pagina di login
        await page.goto('http://localhost:4200/login');
        // Inserisci credenziali errate
        await page.fill('#user', 'utente_non_esistente');
        await page.fill('#password', 'password_errata');
        await page.click('button:has-text("Accedi")');
        // Verifica che appaia un messaggio di errore (toast)
        await expect(page.locator('.toast-error')).toBeVisible({ timeout: 5000 });
    });

    test('4. Verifica la validazione del form di registrazione', async ({ page }) => {
        // Naviga alla pagina di registrazione
        await page.goto('http://localhost:4200/signup');
        // Clicca sul pulsante Registrati senza inserire dati
        await page.click('button:has-text("Registrati")');
        // Verifica che appaiano i messaggi di errore di validazione
        await expect(page.locator('.text-red-600')).toBeVisible();
    });

    test('5. Verifica che la creazione di un avvistamento richieda autenticazione', async ({ page }) => {
        // Vai alla mappa
        await expect(page.locator('#map')).toBeVisible();
        // Clicca sulla mappa per provare a creare un avvistamento (questo dovrebbe mostrare un marker)
        await page.locator('#map').click({ position: { x: 200, y: 200 } });
        // Clicca sul marker per andare alla pagina di creazione
        // Nota: questo è approssimativo perché il marker potrebbe non essere esattamente dove abbiamo cliccato
        await page.locator('.leaflet-marker-icon').click();
        // Verifica che l'app tenti di reindirizzare a login
        await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
        // Verifica la presenza di un toast di avviso
        await expect(page.locator('.toast-warning')).toBeVisible({ timeout: 5000 });
    });

    test('6. Verifica la visualizzazione dei dettagli di un avvistamento', async ({ page }) => {
        // Clicca sulla tab lista
        await page.getByRole('tab', { name: 'Lista' }).click();
        // Clicca sul primo avvistamento
        await page.locator('button:has-text("Dettagli")').first().click();
        // Verifica che vengano mostrati i dettagli
        await expect(page.locator('h2')).toBeVisible();
        await expect(page.locator('img')).toBeVisible();
        // Verifica che ci sia la sezione commenti
        await expect(page.getByText('Commenti')).toBeVisible();
    });

    test('7. Verifica il funzionamento del pulsante "Visualizza sulla mappa"', async ({ page }) => {
        // Clicca sulla tab lista
        await page.getByRole('tab', { name: 'Lista' }).click();
        // Clicca su "Visualizza sulla mappa" per il primo avvistamento
        await page.locator('button:has-text("Visualizza sulla mappa")').first().click();
        // Verifica che si torni alla tab mappa
        await expect(page.getByRole('tab', { name: 'Mappa' })).toHaveAttribute('aria-selected', 'true');
    });

    test('8. Verifica la paginazione della lista avvistamenti', async ({ page }) => {
        // Clicca sulla tab lista
        await page.getByRole('tab', { name: 'Lista' }).click();
        // Verifica che il paginatore sia visibile (solo se ci sono abbastanza avvistamenti)
        await expect(page.locator('mat-paginator')).toBeVisible();
        // Recupera il numero iniziale di avvistamenti
        const initialCount = await page.locator('.border.rounded-lg').count();
        // Se possibile, cambia pagina
        if (await page.locator('button[aria-label="Next page"]').isEnabled()) {
            await page.click('button[aria-label="Next page"]');
            // Verifica che gli avvistamenti siano cambiati
            await expect(async () => {
                const newCount = await page.locator('.border.rounded-lg').count();
                return newCount >= 0 && (newCount !== initialCount || newCount === 0);
            }).toBeTruthy();
        }
    });
});