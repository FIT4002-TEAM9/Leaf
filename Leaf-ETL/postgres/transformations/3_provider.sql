CREATE SEQUENCE provider_id START 1;

INSERT INTO
    omop_provider(provider_id, provider_name, npi, dea, specialty_concept_id, care_site_id, year_of_birth, gender_concept_id, provider_source_value, specialty_source_value, specialty_source_concept_id, gender_source_value, gender_source_concept_id)
SELECT
    nextval('provider_id'), p.first_name || ' ' || p.last_name, null, null, null, null, null, null, p.id, null, null, null, null
FROM
    provider p;

DROP SEQUENCE provider_id;