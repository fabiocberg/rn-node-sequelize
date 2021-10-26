# Postgres Docker

`docker run --name my-postgres -e "POSTGRES_PASSWORD=abcd1234" -p 5432:5432 -d postgres`

# Sequelize cli

## Criar a estrutura padrão e os arquivos de configuração iniciais

`yarn sequelize-cli init`

## Criar um modelo

`yarn sequelize-cli model:generate --name Produto --attributes nome:string,quantidade:integer`

## Criar o banco definido em config/config.json

`yarn sequelize-cli db:create`

## Rodar os migrations

`yarn sequelize-cli db:migrate`