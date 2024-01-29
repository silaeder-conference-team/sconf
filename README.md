

<div align="center">
  <img id="logo" src="https://github.com/stepinhig/sconf/assets/119779337/374c24f6-3a3d-43fd-ab70-14a2fe0f1b8e" width="150" style="border-radius: 50%;">
  <br><br>
  (Все права пренадлежат Lenec Devs Team)
  <h1>🖥️ Silaeder Conferece ✨</h1></div>

<br>
<img src="https://github.com/stepinhig/sconf/assets/119779337/a82df02c-3495-4389-af65-fd921f34f94d" align="right" width="40%"/>

<strong>Silaeder Conference</strong> - Это платформа для организации больших конференций с продвинутым просмотрщиком презентаций, организатором расписаний и менеджером проектов. Используется в школе "Силаэдр"

Некоторые характеристики: 
 - **Язык программирования**: [JS (Node.JS)](https://nodejs.org)
 - **Full Stack Фреймворк**: [Next.JS](https://nextjs.org)
 - **База Данных**: [PostgreSQL](https://postgresql.org)
 - **ORM Для Базы**: [Prisma db](https://prisma.io)
 - **Captcha**: [ReCaptcha](https://www.google.com/recaptcha/about/)
 - **Просмотрщик Презентаций**: [OnlyOffice](https://www.onlyoffice.com/ru/)
 

<h1 algin="center">Как задеплоить</h1>
клонируем на сервер, открываем docker-compose.yml и меняем пароль от базы.
 
Создаем файл .env

В него нужно написать:

```bash
DATABASE_URL=postgresql://postgres:<пароль_от_базы>@sconf-postgres-1:5432/postgres?schema=public 
NEXT_PUBLIC_PUBLIC_KEY=hbosMHJVjTXZDIW8f 
NEXT_PUBLIC_SERVICE_ID=service_eb38uhw 
NEXT_PUBLIC_TEMPLATE_ID=template_gm6y03o 
NEXT_PUBLIC_ONLYOFFICE_CONNECTION_URL=http://server.silaeder.ru:12010 
NEXT_PUBLIC_FILEUPLOADER_URL=http://server.silaeder.ru:12002 
NEXT_PUBLIC_RECAPTCHA_TOKEN=<ключ_рекапча_сайта> 
RECAPTCHA_SERVER_TOKEN=<ключ_рекапча_сервера>
```
