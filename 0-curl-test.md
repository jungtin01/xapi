Server info
-----------
* Remote server: http://ec2-3-0-55-46.ap-southeast-1.compute.amazonaws.com
* Local server: localhost



User Management
----------------
* Login
```
curl --request POST \
  --url https://connecteq.tk:1248/api/authorization \
  --form username=admin \
  --form password=123456789

curl --request POST \
  --url https://connecteq.tk:1248/api/authorization \
  --form username=receptionist \
  --form password=123456789

curl --request POST \
  --url https://connecteq.tk:1248/api/authorization \
  --form username=phuclong \
  --form password=nopass02

curl --request POST \
  --url https://connecteq.tk:1248/api/authorization \
  --form username=coffeehouse \
  --form password=nopass02

curl --request POST \
  --url https://connecteq.tk:1248/api/authorization \
  --form username=longnkh \
  --form password=nopass02



curl --request POST \
  --url https://connecteq.tk:1248/api/authorization \
  --header "Content-Type: application/json" \
  --data '{"username":"admin", "password":"123456789"}'

curl --request POST \
  --url https://connecteq.tk:1248/api/authorization \
  --header "Content-Type: application/json" \
  --data '{"username":"0909876543", "password":"kobiet"}'

curl --request POST \
  --url https://connecteq.tk:1248/api/authorization \
  --header "Content-Type: application/json" \
  --data '{"username":"0909765432", "password":"kaka"}'
```

* Logout
```
curl --request POST \
  --url https://connecteq.tk:1248/api/logout/ \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' 
```

* Get all user
```
curl --request GET \
  --url https://connecteq.tk:1248/api/users/ \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' 
```


* Get user profile (admin role)
```
curl --request GET \
  --url https://connecteq.tk:1248/api/user/3 \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' 
```

* Get my user profile (logged in user)
```
curl --request GET \
  --url https://connecteq.tk:1248/api/my-profile \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' 
```

* Create new user 'POST /api/user': 'UserController.create',
```
curl --request POST \
  --url https://connecteq.tk:1248/api/user \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username=0909090002 \
  --form password=nopass02 \
  --form name=emp1 \
  --form description="ca lam viec so 1" \
  --form status=active \
  --form role=0

curl --request POST \
  --url https://connecteq.tk:1248/api/user \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username=0909090003 \
  --form password=nopass03 \
  --form name=emp2 \
  --form description="ca lam viec 2" \
  --form status=active \
  --form role=0

curl --request POST \
  --url https://connecteq.tk:1248/api/user \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username=0909090004 \
  --form password=nopass04 \
  --form name=emp3 \
  --form description="ca lam viec so 3" \
  --form status=active \
  --form role=0

curl --request POST \
  --url https://connecteq.tk:1248/api/user \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username=0909090005 \
  --form password=nopass05 \
  --form name=emp4 \
  --form description="ca lam viec so 4" \
  --form status=active \
  --form role=0

curl --request POST \
  --url https://connecteq.tk:1248/api/user \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username=0909090006 \
  --form password=nopass06 \
  --form name=emp6 \
  --form description="ca lam viec so 5" \
  --form status=active \
  --form role=0
```

* Update user 'PUT /api/user/:id': 'UserController.update',
```
curl --request PUT \
  --url https://connecteq.tk:1248/api/user/2 \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form password=nopwdkaka-new \
  --form name=emp1-newname \
  --form description="ca lam viec so 1" \
  --form status=active



curl --request PUT \
  --url https://connecteq.tk:1248/api/user/5 \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form password=newnewnw \
  --form name=new5 \
  --form description="ca lam viec so 1" \
  --form status=active
```

* Change password 'POST /api/user/change_password': 'UserController.changePassword',
```
curl --request POST \
  --url https://connecteq.tk:1248/api/user/change_password \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form password=longn
```

* Delete user 'DELETE /api/user/:id': 'UserController.delete',
```
curl --request DELETE \
  --url https://connecteq.tk:1248/api/user/3 \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```





SHOP MANAGEMENT
---------------
* Create new SHOP
```
curl --request POST   \
  --url https://connecteq.tk:1248/api/shopinfo   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form suser=shop \
  --form spwd=coffee \
  --form shopName=longnguyen \
  --form address='truong chinh'     \
  --form   contactInfo='hello' \
  --form maxWaitingTime=6 \
  --form maxRequestPerEmployee=6 \
  --form maxRequestTimeout=7 \
  --form logLevel=info \
  --form openTime=28800 \
  --form closeTime=75602
```

* Get shopinfo
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/shopinfo   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Update shopinfo
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/shopinfo/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form shopName=longnguyen \
  --form address='truong chinh'     \
  --form   contactInfo='hello' \
  --form maxWaitingTime=6 \
  --form maxRequestPerEmployee=6 \
  --form maxRequestTimeout=7 \
  --form logLevel=info \
  --form openTime=28800 \
  --form closeTime=75603
```


* Update shop (sync) account password
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/shoppwd   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form suser=shopexample \
  --form oldSpwd='coffeee' \
  --form newSpwd='coffeee-is-the-correct-pwd-now'
```


* Update shop (sync) account
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/shopsacc   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form oldSuser=shopexample \
  --form newSuser=shop \
  --form oldSpwd='coffeee-is-the-correct-pwd-now' \
  --form newSpwd='coffeee'
```




xCALLER MANAGEMENT
--------------------
* Turn on/off adding xcaller feature
```
curl --request POST   \
  --url localhost:4004/api/add-xcaller   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form action='on'
```

* Create new xcaller
```
curl --request POST   \
  --url https://connecteq.tk:1248/api/xcaller   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerName='B1' \
  --form xcallerId='r8soi10923jgafi01HHSPSSx-1' 

curl --request POST   \
  --url https://connecteq.tk:1248/api/xcaller   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerName='B2' \
  --form xcallerId='r8soi10923jgafi01HHSPSSx-2' 

curl --request POST   \
  --url https://connecteq.tk:1248/api/xcaller   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerName='B3' \
  --form xcallerId='r8soi10923jgafi01HHSPSSx-3' 
```

* Get xcaller
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/xcallers   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

```
curl --request GET   \
  --url https://connecteq.tk:1248/api/xcaller/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Assign table to a user
```
curl --request POST   \
  --url https://connecteq.tk:1248/api/assign-table   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username='0909090002' \
  --form xcallerName=1

curl --request POST   \
  --url https://connecteq.tk:1248/api/assign-table   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form userId=3 \
  --form xcallerName=3

curl --request POST   \
  --url https://connecteq.tk:1248/api/assign-table   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form userId=3 \
  --form xcallerName=2

curl --request POST   \
  --url https://connecteq.tk:1248/api/assign-table   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form userId=3 \
  --form xcallerName=1
```

* Remove table from a user
```
curl --request POST   \
  --url https://connecteq.tk:1248/api/remove-table   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username='0909876543' \
  --form xcallerName='01'

curl --request POST   \
  --url https://connecteq.tk:1248/api/remove-table   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form userId=3 \
  --form xcallerName=3
```

* Update xcaller
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/xcaller/3   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerName='ban so 3' \
  --form xcallerId='r8soi10923jgafi01HHSPSS'
```
  
* Delete xcaller
```
curl --request DELETE   \
  --url https://connecteq.tk:1248/api/xcaller/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' 

curl --request DELETE   \
  --url https://connecteq.tk:1248/api/last-request/r8soi10923jgafi01HHSPSSx-2   \
  --header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU0OTUzMzI5LCJleHAiOjE1NTUwMTA5Mjl9.agH9ZNsktsGNKdAmHbMikh-24nQtKdxRGkILbii8nK0'
```  

* Close customer request with xcallerId
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/close-last-request/r8soi10923jgafi01HHSPSSx-1   \
  --header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU0OTUzMzI5LCJleHAiOjE1NTUwMTA5Mjl9.agH9ZNsktsGNKdAmHbMikh-24nQtKdxRGkILbii8nK0' 
```






CUSTOMER REQUEST MANAGEMENT
-----------------------------
* Create new request
```
curl --request POST   \
  --url https://connecteq.tk:1248/api/request   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerId='1' \
  --form requestType='M'

curl --request POST   \
  --url https://connecteq.tk:1248/api/request   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerId='3' \
  --form requestType='B'

curl --request POST   \
  --url https://connecteq.tk:1248/api/request   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerId='FA1' \
  --form requestType='B'

curl --request POST   \
  --url https://connecteq.tk:1248/api/request   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerId='2' \
  --form requestType='C'

curl --request POST   \
  --url https://connecteq.tk:1248/api/request   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerId='r8soi10923jgafi01HHSPSSx-1' \
  --form requestType='C'

curl --request POST   \
  --url https://connecteq.tk:1248/api/request   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerId='r8soi10923jgafi01HHSPSSx-2' \
  --form requestType='B'

curl --request POST   \
  --url https://connecteq.tk:1248/api/request   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form xcallerId='r8soi10923jgafi01HHSPSSx-3' \
  --form requestType='M'
```


* Get all requests (for client - each request per xcaller device)
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/all-requests   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Get all requests (paging)
```
curl --request GET   \
  --url 'https://connecteq.tk:1248/api/test-all-requests?size=5&page=2'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Get newer requests than specific one
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/test-newer-requests/8   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Get a request
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/request/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Delete a request
```
curl --request DELETE   \
  --url https://connecteq.tk:1248/api/request/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'

curl --request DELETE   \
  --url https://connecteq.tk:1248/api/last-request/r8soi10923jgafi01HHSPSSx-2   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Update request status
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/update-req-status/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form requestStatus='R'
```

* Update assignee
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/update-req-assignee/11   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username='longn'
```

-------------------------------
ACTIVITIES LOGGING
-------------------------------
* Get /api/activities
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/activities   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'


curl --request GET   \
  --url 'https://connecteq.tk:1248/api/activities?size=5&page=1'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'


curl --request GET   \
  --url 'https://connecteq.tk:1248/api/activities?size=5&page=1&from=2019-01-02&to=2019-01-07'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```


-------------------------------
STATISTICS
-------------------------------
* Get /api/statistics
```
curl --request GET   \
  --url 'https://connecteq.tk:1248/api/statistics?from=2018-12-27&to=2019-01-03'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```


* Get /api/hourly-statistics
```
curl --request GET   \
  --url 'https://connecteq.tk:1248/api/hourly-statistics?from=2018-12-27&to=2019-01-03'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```


-------------------------------
TIMESHEETS
-------------------------------
* Get /api/timesheets
```
curl --request GET   \
  --url 'https://connecteq.tk:1248/api/timesheets/1'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'

curl --request GET   \
  --url 'https://connecteq.tk:1248/api/timesheets?username=admin'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'

curl --request GET   \
  --url 'https://connecteq.tk:1248/api/timesheets?username=admin&from=2018-12-27&to=2019-07-10'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'

curl --request GET   \
  --url 'https://connecteq.tk:1248/api/timesheets?username=admin&from=2018-12-27&to=2019-07-10&size=5&page=1'   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```



BATTERY INFO
---------------
* Get battery info
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/batterySetting  \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Set battery alert threshold
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/updateBatterySetting   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form upperLimit='3.3' \
  --form lowerLimit='2.9' \
  --form alertThreshold='3.0'
```

* Get battery status for a devicce xcaller
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/batteryStatus/1  \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```


* Update battery status for a devicce xcaller
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/batteryStatus/2  \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form remainingBatteryValue=2.2 \
  --form remainingBatteryTimeInHour=156

curl --request PUT   \
  --url https://connecteq.tk:1248/api/batteryStatus/1  \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --header "Content-Type: application/json" \
  --data '{"remainingBatteryValue":"2.6", "remainingBatteryTimeInHour":"123"}'
```




WORK SESSIONS
--------------
* Create new work session
```
curl --request POST   \
  --url https://connecteq.tk:1248/api/session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form sessionName='Sang' \
  --form timeFrom=25200 \
  --form timeTo=46800

curl --request POST   \
  --url https://connecteq.tk:1248/api/session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form sessionName='Trua' \
  --form timeFrom=46800 \
  --form timeTo=64800

curl --request POST   \
  --url https://connecteq.tk:1248/api/session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form sessionName='Toi' \
  --form timeFrom=64800 \
  --form timeTo=82800
```

* Get work sessions / session
```
curl --request GET   \
  --url https://connecteq.tk:1248/api/sessions   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'


curl --request GET   \
  --url https://connecteq.tk:1248/api/session/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI'
```

* Update work session
```
curl --request PUT   \
  --url https://connecteq.tk:1248/api/session/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form sessionName='Sang' \
  --form timeFrom=25500 \
  --form timeTo=43200 
```
  
* Delete work session
```
curl --request DELETE   \
  --url https://connecteq.tk:1248/api/session/1   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' 
```

* Assign work session to a user
```
curl --request POST   \
  --url https://connecteq.tk:1248/api/assign-work-session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username='0909876543' \
  --form sessionId=1

curl --request POST   \
  --url https://connecteq.tk:1248/api/assign-work-session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form userId=3 \
  --form sessionId='3'

curl --request POST   \
  --url https://connecteq.tk:1248/api/assign-work-session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form userId='1' \
  --form sessionId='2'

curl --request POST   \
  --url https://connecteq.tk:1248/api/assign-work-session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form username='0909765432' \
  --form sessionId='3'
```

* Remove work session to a user
```
curl --request POST   \
  --url https://connecteq.tk:1248/api/remove-work-session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form userId=3 \
  --form sessionId=1

curl --request POST   \
  --url https://connecteq.tk:1248/api/remove-work-session   \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExMjE3NjcxMzQyNjliZDMzZmE0MiIsImlhdCI6MTU4NzI5MTc2MSwiZXhwIjoxNTg3MzQ5MzYxfQ.Dc8xEunDZRHr5LuJ9QhWPn9DZv9i-3Qe_Tw24h7dRBV6IbShSE82-I_umObcs0RhhK-Moxu08NRbcXd91o81R6g2w20n6Jio5TgY_H2GsqdJtXeGvJG4-jji1WWDilfK6iO5xHkd57rqhmIkNpMQKnqW7R6ERtn41AW03phC5yI' \
  --form userId=2 \
  --form sessionId=1
```


