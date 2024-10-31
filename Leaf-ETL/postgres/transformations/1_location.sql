CREATE SEQUENCE location_id START 1;

INSERT INTO
    omop_location(location_id, address_1, address_2, city, state, zip, county, location_source_value, country_concept_id, country_source_value, latitude, longitude)
SELECT
    nextval('location_id'), h.hospital_name, null, null, null, null, null, h.id, 4329592, null, null, null
FROM
    hospital h;

DROP SEQUENCE location_id;