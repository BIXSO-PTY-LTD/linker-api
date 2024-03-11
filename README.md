# Hướng dẫn

## Yêu cầu

-   nvm (node version manager):
    -   MacOS: <https://github.com/nvm-sh/nvm>
    -   Windows: <https://github.com/coreybutler/nvm-windows>
-   MongoDB: over 7.0 <https://www.mongodb.com/docs/manual/administration/install-community/>
-   Node: 20.11.1 (nvm sẽ tự động cài đặt phiên bản này nếu chưa có)
    -   MacOS: <https://nodejs.org/dist/v20.11.1/node-v20.11.1.pkg>
    -   Windows: <https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi>
-   Dùng npm, không dùng các công cụ khác để tránh xung đột

## Cài đặt

```bash
rm -rf node_modules && rm -f package-lock.json && npm --color=always i
```

## Chạy ở môi trường development

```bash
npm run dev
```

Khi thành công sẽ thấy terminal/console hiển thị thông báo:

```bash
MongoDb is now running on mongodb://0.0.0.0:27017/bixso-linker
Running RestAPI on http://localhost:8000/rest
Running GRAPHQL on http://localhost:8000/graphql
```

## Kiểm tra lỗi (chạy thủ công)

```bash
npm run lint:check
```

## Sửa lỗi (chạy thủ công)

```bash
npm run lint:fix
```

## Một số quy ước

### Quy ước đặt tên

-   Tên biến: `camelCase`
-   Tên hàm: `camelCase`
-   Tên biến parameter: `camelCase`
-   Tên biến argument: `camelCase`

-   Tên biến private: `_camelCase`
-   Tên biến protected: `camelCase_`
-   Tên biến static: `camelCase_`
-   Tên class: `PascalCase`
-   Tên hằng số: `UPPER_CASE`
-   Tên file: `kebab-case`
-   Tên thư mục: `kebab-case`

### Quy ước đặt tên type typescript

-   Dùng tiền tố `I_` cho interface (ví dụ: `I_User`)
-   Dùng tiền tố `T_` cho type (ví dụ: `T_User`)
-   Dùng tiền tố `E_` cho enum (ví dụ: `E_User`)

### Quy ước đặt tên biến môi trường

-   Dùng tiền tố `REACT_APP_` cho biến môi trường của react
-   Dùng tiền tố `NEXT_PUBLIC_` cho biến môi trường của nextjs
-   Dùng tiền tố `VITE_` cho biến môi trường của vite
-   Dùng tiền tố `NODE_` cho biến môi trường của node

### Quy ước viết code

-   Không dùng `var`
-   Không dùng `==`
-   Xóa `console.log` trước khi commit
-   Xóa `debugger` trước khi commit
-   Không dùng `any`, `unknown`, `never` nếu không cần thiết
-   Không dùng `@ts-ignore`
-   Không dùng `@ts-nocheck`

### Quy ước commit

-   Commit message có dạng: `type(scope): message` (ví dụ: `feat(user): add user feature`)

### Quy ước pull request

-   Pull request có dạng: `type(scope): message` (ví dụ: `feat(user): add user feature`)

## Cấu trúc thư mục và ý nghĩa

```text
.
├── src
│   ├── api
│   │   ├── graphql => Các api graphql
│   │   │   ├── resolvers => Các resolvers của graphql, hệ thống sẽ tự động nhận biết khi có file mới
│   │   │   │   └── test.ts => gọi đến controller tương ứng để xử lý logic
│   │   │   ├── types => Các types của graphql, hệ thống sẽ tự động nhận biết khi có file mới
│   │   │   │   ├── _paginate.graphql
│   │   │   │   ├── _scalars.graphql
│   │   │   │   └── test.graphql => định nghĩa các type, query, mutation, subscription
│   │   │   ├── pubsub.ts
│   │   │   └── schema.ts
│   │   └── rest => Các api restful
│   │       └── index.ts => import tất cả các route con vào index, mỗi route dẫn đến một controller tương ứng
│   ├── controllers => Các controller của api restful (được gọi từ route) và graphql (được gọi từ resolver)
│   │   ├── index.ts => import tất cả các controller con vào index
│   │   └── test.ts => xử lý logic của api, gọi đến model để lấy dữ liệu
│   ├── models => Các model
│   │   ├── index.ts => import tất cả các model con vào index
│   │   └── test.ts => định nghĩa các schema từ database
│   ├── secret => Các secret key, token, ...
│   ├── shared => Các file dùng chung
│   │   ├── mongoose.ts => kết nối đến database
│   │   └── validate.ts => định nghĩa các hàm validate
│   ├── typescript => Các kiểu typescript
│   │   ├── index.ts => import tất cả các type con vào index
│   │   └── test.ts => định nghĩa các type
│   ├── config.ts => định nghĩa các biến môi trường
│   └── server.ts => khởi tạo server và import các file cần thiết vào server
├── .commitlintrc => quy ước commit
├── .editorconfig => quy ước format code
├── .env => biến môi trường
├── .env.example => mẫu biến môi trường
├── .eslintrc => cấu hình eslint
├── .gitignore => cấu hình git
├── .lintstagedrc => cấu hình lint-staged
├── .ncurc.js => cấu hình commitizen
├── .nvmrc => phiên bản node
├── .prettierrc => quy ước format code
├── index.d.ts => định nghĩa các type global
├── package-lock.json => cấu hình npm
├── package.json => cấu hình npm
├── README.md => hướng dẫn
└── tsconfig.json => cấu hình typescript
```
