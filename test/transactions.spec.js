"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const node_child_process_1 = require("node:child_process");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
(0, vitest_1.describe)('transactions routes', () => {
    // Preapara o app antes de todos os testes
    (0, vitest_1.beforeAll)(async () => {
        await app_1.app.ready();
    });
    // depois de todos os testes fecha a aplicação app
    (0, vitest_1.afterAll)(async () => {
        await app_1.app.close();
    });
    (0, vitest_1.beforeEach)(() => {
        (0, node_child_process_1.execSync)('npm run knex migrate:rollback --all');
        (0, node_child_process_1.execSync)('npm run knex migrate:latest');
    });
    (0, vitest_1.it)('User can create a new transaction', async () => {
        await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'new transaction',
            amount: 5000,
            type: 'credit',
        })
            .expect(201);
    });
    (0, vitest_1.it)('Usuario consegue listar todas as transaçoes', async () => {
        const createTransactionsResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        });
        const cookies = createTransactionsResponse.get('Set-Cookie');
        const listTransactionsResponse = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(listTransactionsResponse.body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        ]);
    });
    (0, vitest_1.it)('Usuario consegue buscar transação unica', async () => {
        const createTransactionsResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        });
        const cookies = createTransactionsResponse.get('Set-Cookie');
        const listTransactionsResponse = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);
        const transactionId = listTransactionsResponse.body.transactions[0].id;
        const getTransactions = await (0, supertest_1.default)(app_1.app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(getTransactions.body.transaction).toEqual(vitest_1.expect.objectContaining({
            title: 'New transaction',
            amount: 5000,
        }));
    });
    (0, vitest_1.it)('Usuario consegue fazer resumo de transaçoes', async () => {
        const createTransactionsResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        });
        const cookies = createTransactionsResponse.get('Set-Cookie');
        await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
            title: 'New transaction',
            amount: 2000,
            type: 'debit',
        });
        const sumaryResponse = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(sumaryResponse.body.summary).toEqual({
            amount: 3000,
        });
    });
});
