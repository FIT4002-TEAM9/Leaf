#!/bin/bash
docker volume create leafdb
docker build -t leaf-etl-postgres ../Leaf-ETL/postgres
docker compose -f ./docker/docker-compose-postgres.yml up -d

sleep 5
echo "Waiting 5 seconds for Postgres to start up"

# Run sudo apt install postgresql-client-common if psql is not found, and then run sudo apt-get install postgresql-client
# Add VOCABULARY
PGPASSWORD=password psql -h localhost -p 5432 -U admin -d leaf-etl -c "\copy omop_vocabulary(vocabulary_id, vocabulary_name, vocabulary_reference, vocabulary_version, vocabulary_concept_id) FROM '../Leaf-ETL/postgres/vocabularies/VOCABULARY.csv' DELIMITER E'\t' CSV HEADER QUOTE E'\b';"

# Add RELATIONSHIP
PGPASSWORD=password psql -h localhost -p 5432 -U admin -d leaf-etl -c "\copy omop_relationship(relationship_id, relationship_name, is_hierarchical, defines_ancestry, reverse_relationship_id, relationship_concept_id) FROM '../Leaf-ETL/postgres/vocabularies/RELATIONSHIP.csv' DELIMITER E'\t' CSV HEADER QUOTE E'\b';"

# Add DOMAIN
PGPASSWORD=password psql -h localhost -p 5432 -U admin -d leaf-etl -c "\copy omop_domain(domain_id, domain_name, domain_concept_id) FROM '../Leaf-ETL/postgres/vocabularies/DOMAIN.csv' DELIMITER E'\t' CSV HEADER QUOTE E'\b';"

# Add CONCEPT_CLASS
PGPASSWORD=password psql -h localhost -p 5432 -U admin -d leaf-etl -c "\copy omop_concept_class(concept_class_id, concept_class_name, concept_class_concept_id) FROM '../Leaf-ETL/postgres/vocabularies/CONCEPT_CLASS.csv' DELIMITER E'\t' CSV HEADER QUOTE E'\b';"

# Add CONCEPT
PGPASSWORD=password psql -h localhost -p 5432 -U admin -d leaf-etl -c "\copy omop_concept(concept_id, concept_name, domain_id, vocabulary_id, concept_class_id, standard_concept, concept_code, valid_start_date, valid_end_date, invalid_reason) FROM '../Leaf-ETL/postgres/vocabularies/CONCEPT.csv' DELIMITER E'\t' CSV HEADER QUOTE E'\b';"
