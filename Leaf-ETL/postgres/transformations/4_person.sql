CREATE SEQUENCE person_id START 1;

INSERT INTO
    omop_person(person_id, gender_concept_id, year_of_birth, month_of_birth, day_of_birth, birth_datetime, race_concept_id, ethnicity_concept_id, location_id, provider_id, care_site_id, person_source_value, gender_source_value, gender_source_concept_id, race_source_value, race_source_concept_id, ethnicity_source_value, ethnicity_source_concept_id)
SELECT
    nextval('person_id'), g_c.concept_id, EXTRACT(YEAR FROM p.date_of_birth), EXTRACT(MONTH FROM p.date_of_birth), EXTRACT(DAY FROM p.date_of_birth), p.date_of_birth::timestamp, 8552, 8552, l.location_id, o_p.provider_id, null, p.mrn, p.sex, null, null, null, null, null
FROM
    patient p, omop_concept g_c, omop_location l, omop_provider o_p
WHERE
    g_c.concept_class_id = 'Gender'AND
    g_c.concept_name = p.sex::VARCHAR AND
    l.location_source_value = p.hospital_id AND
    o_p.provider_source_value = p.provider_id;

DROP SEQUENCE person_id;