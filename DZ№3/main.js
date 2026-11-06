// ==========================================
// Исходная функция delay
// ==========================================

function delay(value, ms, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`Ошибка при обработке: ${value}`));
            } else {
                resolve(value);
            }
        }, ms);
    });
}


// ==========================================
// 1. Цепочка промисов (.then / .catch / .finally)
// ==========================================

function runTask1() {
    console.log("\n========== ЗАДАЧА 1 ==========");
    console.log("Старт цепочки промисов");

    return delay(1, 500)
        .then(res1 => {
            console.log(`Шаг 1 успешен: ${res1}`);

            // Второй delay специально завершается ошибкой
            return delay(res1 + 1, 500, true);
        })
        .then(res2 => {
            // Этот блок не выполнится
            console.log(`Шаг 2 успешен: ${res2}`);

            return delay(res2 + 1, 500);
        })
        .then(res3 => {
            console.log(`Шаг 3 успешен: ${res3}`);
            return res3;
        })
        .catch(error => {
            console.error(`Перехвачена ошибка: ${error.message}`);

            // Ошибка обработана, цепочка продолжится
        })
        .finally(() => {
            console.log("Блок finally сработал.");
            console.log("Задача 1 завершена.");
        });
}


// ==========================================
// 2. async / await
// ==========================================

async function runTask2() {
    console.log("\n========== ЗАДАЧА 2 ==========");

    // --------------------------------------
    // Часть А. Последовательные delay
    // --------------------------------------

    console.log("\n--- Часть А: async/await ---");

    try {
        const res1 = await delay(1, 500);
        console.log(`Шаг 1 успешен: ${res1}`);

        const res2 = await delay(res1 + 1, 500, true);
        console.log(`Шаг 2 успешен: ${res2}`);

        const res3 = await delay(res2 + 1, 500);
        console.log(`Шаг 3 успешен: ${res3}`);

    } catch (error) {
        console.error(`Перехвачена ошибка: ${error.message}`);

    } finally {
        console.log("Async finally сработал.");
    }


    // --------------------------------------
    // Часть Б. Обработка массива
    // --------------------------------------

    console.log("\n--- Часть Б: Последовательная обработка массива ---");

    const inputValues = [10, 20, 30, 40];
    const results = [];

    for (const val of inputValues) {
        // Вероятность ошибки 30%
        const shouldFail = Math.random() > 0.7;

        try {
            console.log(`Обрабатываем значение: ${val}`);

            const result = await delay(val, 500, shouldFail);

            console.log(`Успешно обработано: ${result}`);

            results.push({
                value: result,
                error: null
            });

        } catch (error) {
            console.error(`Ошибка элемента ${val}: ${error.message}`);

            results.push({
                value: val,
                error: error.message
            });
        }
    }

    console.log("\nИтоговый массив результатов:");
    console.table(results);

    console.log("Задача 2 завершена.");
}


// ==========================================
// 3. Параллельное выполнение Promise
// ==========================================

async function runTask3() {
    console.log("\n========== ЗАДАЧА 3 ==========");


    // --------------------------------------
    // Часть А. Promise.all
    // --------------------------------------

    console.log("\n--- Часть А: Promise.all ---");

    const promisesForAll = [
        delay("Промис 1", 200),
        delay("Промис 2", 400),
        delay("Промис 3", 300, true),
        delay("Промис 4", 600)
    ];

    try {
        const results = await Promise.all(promisesForAll);

        console.log("Все промисы успешны:", results);

    } catch (error) {
        console.error(`Promise.all завершился ошибкой: ${error.message}`);
        console.log("Остальные промисы продолжают выполняться.");
    }


    // --------------------------------------
    // Часть Б. Promise.allSettled
    // --------------------------------------

    console.log("\n--- Часть Б: Promise.allSettled ---");

    const promisesForSettled = [
        delay("Данные A", 200),
        delay("Данные B", 400),
        delay("Данные C", 300, true),
        delay("Данные D", 600)
    ];

    const settledResults = await Promise.allSettled(promisesForSettled);

    const succeeded = [];
    const failed = [];

    settledResults.forEach(result => {
        if (result.status === "fulfilled") {
            succeeded.push(result.value);
        } else {
            failed.push(result.reason.message);
        }
    });

    console.log("Успешные результаты:", succeeded);
    console.log("Неудачные результаты:", failed);


    // --------------------------------------
    // Часть В. Promise.race
    // --------------------------------------

    console.log("\n--- Часть В: Promise.race ---");

    try {
        const result = await Promise.race([
            delay("Полезные данные", 2000),
            delay("Таймаут соединения", 500, true)
        ]);

        console.log("Победитель гонки:", result);

    } catch (error) {
        console.error(`Гонка завершилась ошибкой: ${error.message}`);
    }

    console.log("\n========== ВСЕ ЗАДАЧИ ЗАВЕРШЕНЫ ==========");
}


// ==========================================
// Последовательный запуск всех заданий
// ==========================================

async function main() {
    await runTask1();
    await runTask2();
    await runTask3();
}

main().catch(error => {
    console.error("Непредвиденная ошибка программы:", error);
});
