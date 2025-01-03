# ESCHOOL

### Технології

```
- React (create-react-app)
- TypeScript
- @tanstack/react-query
- Axios
```

### Запуск проекту

```
- npm install
- npm start
```

## Коментарі до завдання

### 1. Не працює пагінація в роуті /Schoolboy

Сам роут працює, але пагінація ні. Наприклад запит `?page=1&limit=15` повертає всі елементи. В даному випадку зробив і протестував пагінацію з `mockStudents` та функцією `getMockStudents` яка ці дані отримує. Якщо виправити пагінацію на сервері то все запрацює :smile:

### 2. Функціонал виставлення/видалення відсутності учня при кліку на відповідні комірки

#### Під час аналізу задачі виявив наступні моменти:

- видалення відсутностей `POST/UnRate` нічого не повертає окрім `status 200`
- створення нових `POST/Rate` нічого не повертає окрім `status 200`
- можна отримати всі `GET/Rate` одного учня по `Id (?SchoolboyId={int})`, але не можна отримати всі записи декількох учнів одночасно

#### Виходячи з цього вибрав наступну стратегію:

- При першому завантаженні отримувати всі `GET/Rate`.
- Після видалення відсутності `/UnRate` робити оптимістичне оновлення і після цього запит `GET/Rate?SchoolboyId={int}`для перевірки остаточного видалення елементу і оновлювати кеш локально.
- При створенні нової відсутності `POST/Rate` також відбувається оптимістичне оновлення, в елемент якого підставляється тимчасовий `Id`. По аналогії з видаленням відсутності робиться запит `GET/Rate?SchoolboyId={int}` для перевірки створення та оновлення елементу в кеші.

### 3. Estimate

Враховуючи оцінку задачі, пошук інформації, ознайомлення з @tanstack/react-query, рефакторинг та написання коду і цього листа :smile: витратив сумарно до 20 годин :hourglass:.

### 4. Підсумок

Не дивлячись на незначні деталі в роботі роутів хочу подякувати за цікаве завдання :+1:. Особливо хочу виділити @tanstack/react-query, який надихнув мене переглянути свої стратегії виконання запитів в додатках :fire:.

Чекаю на Ваш фідбек.
З найкращими побажаннями Олег Запорожець 🤝.
