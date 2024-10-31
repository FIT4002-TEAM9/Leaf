CREATE SEQUENCE care_site_id START 1;

INSERT INTO
    omop_care_site(care_site_id, care_site_name, place_of_service_concept_id, location_id, care_site_source_value, place_of_service_source_value)
SELECT
    nextval('care_site_id'), m.unit_name, null, l.location_id, m.id, null
FROM
    medical_unit m, omop_location l
WHERE
    l.location_source_value = m.hospital_id;

DROP SEQUENCE care_site_id;