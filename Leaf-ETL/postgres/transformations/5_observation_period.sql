CREATE SEQUENCE observation_period_id START 1;

INSERT INTO
    omop_observation_period (observation_period_id, person_id, observation_period_start_date, observation_period_end_date, period_type_concept_id)
SELECT
    nextval('observation_period_id'), op.person_id, tc.arrival_date, p.time_last_allocated, 2615413
FROM
    omop_person op, triage_case tc, patient p
WHERE
    op.person_source_value = p.mrn AND op.person_source_value = tc.patient_id;

DROP SEQUENCE observation_period_id;