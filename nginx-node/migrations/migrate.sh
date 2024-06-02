#!/bin/bash

# Aguarda o MySQL iniciar completamente
until mysqladmin ping -h "127.0.0.1" --silent; do
  echo "Aguardando o MySQL iniciar..."
  sleep 2
done

echo "MySQL iniciado com sucesso."

# Cria a tabela migrations caso ela não exista
mysql -u "root" -p"root" "nodedb" <<-EOSQL
  CREATE TABLE IF NOT EXISTS migrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
EOSQL

echo "Tabela 'migrations' verificada/criada com sucesso."

# Aplica as migrações que ainda não foram aplicadas
for file in /root/migrations/*.sql; do
  filename=$(basename "$file")
  if ! mysql -u "root" -p"root" "nodedb" -e "SELECT 1 FROM migrations WHERE filename='$filename'" | grep -q 1; then
    echo "Aplicando $file"
    if mysql -u "root" -p"root" "nodedb" < "$file"; then
      mysql -u "root" -p"root" "nodedb" -e "INSERT INTO migrations (filename) VALUES ('$filename')"
      echo "$file aplicado e registrado com sucesso."
    else
      echo "Erro ao aplicar $file"
    fi
  else
    echo "$file já foi aplicado, pulando."
  fi
done

echo "Migrações aplicadas com sucesso."