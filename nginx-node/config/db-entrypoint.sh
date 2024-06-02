#!/bin/bash

# Inicia o entrypoint padrão do MySQL em segundo plano
/entrypoint.sh mysqld &

# Aguarda o MySQL iniciar completamente
until mysqladmin ping -h "127.0.0.1" --silent; do
  echo "Aguardando o MySQL iniciar..."
  sleep 2
done

echo "MySQL iniciado com sucesso."

# Aplica as migrações
for file in /root/migrations/*.sql; do
  echo "Aplicando $file"
  mysql -u "root" -p"root" "nodedb" < "$file"
done

echo "Migrações aplicadas com sucesso."

# Mantém o container rodando
wait