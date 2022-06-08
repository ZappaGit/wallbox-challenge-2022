[1] linking one charger to 4 users

✔ step1: create a charger

✔ step2: check 4 users

✔ step3: - Allowed user to access charger

✔ Step4, admin check charger state

✔ Step5, user signin

✔ Step6, user check charger state

[2] xlinking 4 chargers to a user

✔ step1: check a user

✔ step2: check 4 chargers

✔ step3: - Allowed user to access charger

✔ Step4, check chargers state

✔ Step5, create user2

✔ Step6, user2 signin

✔ Step7, user2 check charger state and get Cannot access that resource

[3] unlinking a 4 chargers to a user

✔ step1: check a user

✔ step2: - Allowed user to access 4 chargers

✔ Step3, check chargers state - every charger has a user

✔ step4: - unlink user to access each charger

✔ Step5, check chargers state - no users for each charger

[4] delete charger after link, must be deleted (not found)

✔ step1: check a user

✔ step2: - Allowed user to access a charger

✔ Step3, check chargers state - every charger has a user

✔ step4: - delete charger

✔ Step5, check chargers state - no users for each charger

[5] update charger after link, must be updated

✔ step1: check a user

✔ step2: - Allowed user to access a charger

✔ Step3, check chargers state - every charger has a user

✔ step4: - update charger

✔ Step5, check chargers state - the charger must be updated

[5] update user after link, must be updated

✔ step1: check a user

✔ step2: - Allowed user to access a charger

✔ Step3, check chargers state - every charger has a user

✔ step4: - update user

✔ Step5, check chargers state - the charger must be updated
