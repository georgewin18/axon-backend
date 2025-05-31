# How to use backend

1. prepare your database (local server / container)
2. create `.env` file that contains `DB_HOST`, `DB_PORT`, `DB_USER`, etc. in root directory of the app
3. run app with comand below
   
   ```bash
   node index.js
   ```

   or if you wanna use the docker-compose, use this command

   ```bash
   docker compose up --build -d
   ```
   
4. done, the backend is ready!
