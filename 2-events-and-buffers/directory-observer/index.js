// ### Просте завдання:
/**
 * Напишіть модуль, що слідкує за вмісто каталога, котрий передається
 * у вигляді параметра підчас виконання скрипта, і генерує наступні івенти
 * використовуючи Event Emiter - файл був доданий, файл був видалений чи файл був змінений
 */
// -

import { DirectoryObserver } from "./directory-observer.js";

if (process.argv.length < 3) {
  throw new Error("Not passed dir name");
}

const path = process.argv[2];

const dirObserver = new DirectoryObserver(path);

dirObserver.addListener("change", (ev) => {
  console.log("CHANGE ev:", ev);
});

dirObserver.addListener("deleted", (ev) => {
  console.log("DELETED ev:", ev);
});

dirObserver.addListener("added", (ev) => {
  console.log("ADDED ev:", ev);
});
