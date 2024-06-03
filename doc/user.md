## app prefix

```shell
    http://localhost:3000/api/v1
```

## user prefix

```shell
    /user
```

## 1.user registration

```
    POST /register
```

### parameter description

| parameter | des                                       | required |
| :-------: | :---------------------------------------- | :------- |
| username  | 用户账号，仅允许字母/数字，长度 6-22。    | true     |
|   email   | 用户邮箱，仅允许xxx@xxx.xxxx。            | true     |
| password  | 用户密码，长度 6-22，正则校验由前端实现。 | true     |
|   其他    | 参考模型文件@models/user。                | false    |

### response data

```json
{
  "data": {
    "email": "xxx@xxx.xxx",
    "username": "xxxx"
  },
  "message": "success",
  "errorCode": 0,
  "status": 200
}
```

## 2.user sign in

```
    POST /login
```

### parameter description

| parameter | des                                       | required                                        |
| :-------: | :---------------------------------------- | :---------------------------------------------- |
| username  | 用户账号，仅允许字母/数字，长度 6-22。    | 如果存在邮箱 email，此项非必填，否则为必填      |
|   email   | 用户邮箱，仅允许xxx@xxx.xxxx。            | 如果存在用户名 username，此项非必填，否则为必填 |
| password  | 用户密码，长度 6-22，正则校验由前端实现。 | true                                            |

### tips

- 允许用户状态（state）为正常（1）的用户登录；
- 禁止用户状态（state）为异常（0）的用户登录。

### response data

```json
{
  "data": {
    "id": "xxx",
    "username": "xxx",
    "email": "xxx@xxx.xxx"
    // ...
  },
  "message": "success",
  "errorCode": 0,
  "status": 200
}
```

## 3.user's details

```
    GET /info/:id
```

### parameter description

| parameter | des         | required |
| :-------: | :---------- | :------- |
|    id     | 用户唯一 id | true     |

### tips

- 要求用户登录并携带 token 访问此接口；
- 普通用户无权限;
- 管理员可请求，但不返回密码及时间信息；
- 超级管理员可返回用户所有信息。

### response data

```json
{
  "data": {
    "id": "xxx",
    "username": "xxx",
    "email": null,
    "phone_number": null,
    "first_name": null
    //...
  },
  "message": "success",
  "errorCode": 0,
  "status": 200
}
```

## 4.delete user

```
    DELETE /delete/:id
```

### parameter description

| parameter | des         | required |
| :-------: | :---------- | :------- |
|    id     | 用户唯一 id | true     |

### tips

- 此接口为软（soft）删除，即给用户设置 deleted_at 值，ORM 工具可识别。
- 要求用户登录并携带 token 访问此接口；
- 普通用户无权限;
- 管理员无权限；
- 超级管理员可删除用户。

### response data

```json
{
  "message": "user is deleted.",
  "errorCode": 0,
  "status": 200
}
```

## 5.user list

```
    GET /list
```

### parameter description

|     parameter      | des            | required |
| :----------------: | :------------- | :------- |
|      username      | 用户名精确查询 | false    |
| username_container | 用户名模糊查询 | false    |
|        page        | 分页查询       | false    |
|       limit        | 分页查询       | false    |

### tips

- 要求用户登录并携带 token 访问此接口；
- 普通用户无权限;
- 管理员及以上可请求，但不返回密码及时间信息；

### response data

```json
{
  "data": {
    "data": [
      {
        "id": "xxx",
        "username": "xxx",
        "email": null,
        "phone_number": null,
        "first_name": null
        //...
      }
      // ...
    ],
    "count": 000,
    "total": 000
  },
  "message": "success",
  "errorCode": 0,
  "status": 200
}
```

## 5.update user info

```
    PUT /update/:id
```

### parameter description

| parameter | des         | required |
| :-------: | :---------- | :------- |
|    id     | 用户唯一 id | true     |
| username  | 修改用户名  | false    |

### tips

- 要求用户登录并携带 token 访问此接口；
- 普通用户无权限;
- 管理员及以上可请求，但不返回密码及时间信息；

### response data

```json
{
  "data": {
    "id": "xxx",
    "username": "xxx",
    "email": null
    // ...
  },
  "message": "success",
  "errorCode": 0,
  "status": 200
}
```
