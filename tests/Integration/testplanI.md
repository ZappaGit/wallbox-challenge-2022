[1] POST - /signin operation
✔ 400 - bad request (47ms)
✔ 401 - Wrong email or password (wrong email)
✔ 401 - Wrong email or password (wrong password)
✔ 200 - OK - for User: user@wallbox.com
✔ 200 - OK - for Admin: user@wallbox.com

[2] GET -/chargers operation requests
✔ 401 - Invalid token /chargers
✔ 400 - Unexpected string /chargers
✔ 200 - OK for admin over chargers /chargers
✔ 200 - OK for user over chargers /chargers

[3] POST -/chargers operation requests
✔ 401 - Invalid token /chargers
✔ 400 - Unexpected string /chargers
✔ 200 - OK for admin over chargers
✔ 400 - wrong without serial number for admin over chargers
✔ 409 - Serial number already in use, for admin over chargers
✔ 401 - Insufficient permissions - for user over chargers

[4] PUT -/chargers/uidchager operation requests
✔ 401 - Invalid token /chargers/{{uidAdmin}}
✔ 400 - Unexpected string admin over admin /chargers/{{uidAdmin}}
✔ 200 - update /chargers/{uidcharger} -for admin over charger
✔ 409 - Serial number already in use update /chargers/{uidcharger} -for admin over charger
✔ 401 - Insufficient permissions, for user over chargers

[5] DELETE -/chargers/uidcharger operation requests
✔ 401 - bad request /chargers/{{uidcharger}}
✔ 400 - Unexpected string admin over admin /chargers/{{uidcharger}}
✔ 400 - Unexpected string admin over charger /chargers/{{uidcharger}}
✔ 401 - Insufficient permissions - for user over charger /chargers
✔ 204 - OK - for admin over charger /chargers/{{uidcharger}}
✔ 400 - Invalid value for charger, admin over charger /chargers/{{uidcharger}}

[6] GET -/chargers/uidcharger operation requests

    ✔ 401 -  Invalid token /chargers/{{uuidcharger}}
    ✔ 400 - Unexpected string admin over admin /chargers/{{uuidcharger}}
    ✔ 200 - OK for admin over charger /chargers/{{uuidcharger}}
    ✔ 200 - OK for admin over admin  /chargers/{{uuidcharger}}
    ✔ 403 - forbiden for user over admin /chargers/{{uuidcharger}}

[7] POST -/chargers/{uidcharger}/users/{uiduser} operation requests
✔ 401 - Invalid token /chargers/{uidcharger}/user/{uiduser}
✔ 400 - Unexpected string /chargers/{uidcharger}/user/{uiduser}
✔ 200 - Allowed user to access charger - for admin over /chargers/{uidcharger}/user/{uiduser}
✔ 401 - Insufficient permissions - for user over user /chargers/{uidcharger}/user/{uiduser}
✔ 403 - User already has access to charger for admin /chargers/{uidcharger}/users/{uiduser}

[8] DELETE -/chargers/{uidcharger/users/{uiduser} operation requests

    ✔ 401 - Invalid token -/chargers/{uidcharger}/users/{uiduser}
    ✔ 400 - Unexpected string -/chargers/{uidcharger}/users/{uiduser}
    ✔ 404 - Charger not found - admin over /chargers/{uidcharger}/users/{uiduser}
    ✔ 404 - User not found - admin over /chargers/{uidcharger}/users/{uiduser}
    ✔ 200 - Removed charger access from user - for admin over -/chargers/{uidcharger}/users/{uiduser}
    ✔ 401 - Insufficient permissions - for user over -/chargers/{uidcharger}/users/{uiduser}

[10] POST -/users operation requests
{
uid: '01G5172BG9R0RDSMDGEY9HTK16',
email: 'admin@wallbox.com',
jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwMUc1MTcyQkc5UjBSRFNNREdFWTlIVEsxNiIsImVtYWlsIjoiYWRtaW5Ad2FsbGJveC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTQ2NzcxMzYsImV4cCI6MTY1NDY4MDczNn0.eO1x_kyWJko9AFegMwwT322YwhWa9RtIdTttTY8eLCI'
}
✔ 401 -Invalid token /users
✔ 400 - Unexpected string /users
✔ 401 - Insufficient permissions - for user over /users
✔ 200 - OK for admin over /users
✔ 409 - Email already in use for admin over /users

[11] PUT -/users/uiduser operation requests

    ✔ 401 - Invalid token - /users/{{uiduser}}
    ✔ 400 - Unexpected string admin over /users/{{miUser}}
    ✔ 200 - User updated  -for admin over /users/{{uidUser}}
    ✔ 409 - update user mail - Email already in use (same mail) -for admin over /users/{{uidUser}}
    ✔ 400 - update user mail - Wrong email or password (same mail) -for admin over /users/{{uidUser}}
    ✔ 403 - Cannot access that resource - for user over another user  /users/{{uidUser}}

[12] DELETE -/xusers/uiduser operation requests

    ✔ 401 - bad request /users/{{uidAdmin}}
    ✔ 400 - Unexpected string admin over admin /users/{{uidAdmin}}
    ✔ 400 - Unexpected string user over user /users/{{uidUser}}
    ✔ 401 - Insufficient permissions - for user over user /users
    ✔ 204 - OK for admin over user /users/{{uidUser}}
    ✔ 404 - User not found for admin over user /users/{{uidUser}}

[13] GET -/xusers/uiduser operation requests

    ✔ 401 - Invalid token /users/{{uiduser}}
    ✔ 400 - Unexpected string admin over /users/{{uidAdmin}}
    ✔ 400 - Unexpected string user over  /users/{{uidUser}}
    ✔ 200 - OK for admin over user /users/{{uidUser}}
    ✔ 200 - OK for admin over admin  /users/{{uidAdmin}}
    ✔ 200 - OK for user over himself  /users/{{uidUser}}
    ✔ 403 - forbiden for user over admin /users/{{uidUser}}

[9] GET -/users operation requests
✔ 401 - bad request /users
✔ 400 - Unexpected string /users
✔ 200 - OK for admin over user /users
✔ 200 - OK for user over user /users
