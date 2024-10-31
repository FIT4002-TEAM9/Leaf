CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_drug_exposure(drug_exposure_id, person_id, drug_concept_id, drug_exposure_start_date, drug_exposure_start_datetime, drug_exposure_end_date, drug_exposure_end_datetime, verbatim_end_date, drug_type_concept_id, stop_reason, refills, quantity, days_supply, sig, route_concept_id, lot_number, provider_id, visit_occurrence_id, visit_detail_id, drug_source_value, drug_source_concept_id, route_source_value, dose_unit_source_value)
SELECT
    nextval('event_id'), o_p.person_id, 4129922, e.created_at, e.created_at::timestamp, e.last_completed, e.last_completed::timestamp, null, 4025188, null, null, null, null, null, null, null, null, null, null, null, null, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'DRUG_EXPOSURE' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;

CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_device_exposure(device_exposure_id, person_id, device_concept_id, device_exposure_start_date, device_exposure_start_datetime, device_exposure_end_date, device_exposure_end_datetime, device_type_concept_id, unique_device_id, production_id, quantity, provider_id, visit_occurrence_id, visit_detail_id, device_source_value, device_source_concept_id, unit_concept_id, unit_source_value, unit_source_concept_id)
SELECT
    nextval('event_id'), o_p.person_id, 4129922, e.created_at, e.created_at::timestamp, e.last_completed, e.last_completed::timestamp, 4129922, null, null, null, null, null, null, null, null, null, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'DEVICE_EXPOSURE' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;

CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_visit_occurrence(visit_occurrence_id, person_id, visit_concept_id, visit_start_date, visit_start_datetime, visit_end_date, visit_end_datetime, visit_type_concept_id, provider_id, care_site_id, visit_source_value, visit_source_concept_id, admitted_from_concept_id, admitted_from_source_value, discharged_to_concept_id, discharged_to_source_value, preceding_visit_occurrence_id)
SELECT
    nextval('event_id'), o_p.person_id, 4129922, e.created_at, e.created_at::timestamp, e.last_completed, e.last_completed::timestamp, 4129922, null, null, null, null, null, null, null, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'VISIT_OCCURRENCE' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;

CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_condition_occurrence(condition_occurrence_id, person_id, condition_concept_id, condition_start_date, condition_start_datetime, condition_end_date, condition_end_datetime, condition_type_concept_id, condition_status_concept_id, stop_reason, provider_id, visit_occurrence_id, visit_detail_id, condition_source_value, condition_source_concept_id, condition_status_source_value)
SELECT
    nextval('event_id'), o_p.person_id, 4129922, e.created_at, e.created_at::timestamp, e.last_completed, e.last_completed::timestamp, 4129922, null, null, null, null, null, null, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'CONDITION_OCCURRENCE' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;

CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_procedure_occurrence(procedure_occurrence_id, person_id, procedure_concept_id, procedure_date, procedure_datetime, procedure_end_date, procedure_end_datetime, procedure_type_concept_id, modifier_concept_id, quantity, provider_id, visit_occurrence_id, visit_detail_id, procedure_source_value, procedure_source_concept_id, modifier_source_value)
SELECT
    nextval('event_id'), o_p.person_id, 4129922, e.created_at, e.created_at::timestamp, e.last_completed, e.last_completed::timestamp, 4129922, null, null, null, null, null, null, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'PROCEDURE_OCCURRENCE' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;

CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_measurement(measurement_id, person_id, measurement_concept_id, measurement_date, measurement_datetime, measurement_time, measurement_type_concept_id, operator_concept_id, value_as_number, value_as_concept_id, unit_concept_id, range_low, range_high, provider_id, visit_occurrence_id, visit_detail_id, measurement_source_value, measurement_source_concept_id, unit_source_value, unit_source_concept_id, value_source_value, measurement_event_id, meas_event_field_concept_id)
SELECT
    nextval('event_id'), o_p.person_id, 4129922, e.created_at, e.created_at::timestamp, null, 4129922, 4129922, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'MEASUREMENT' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;

CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_observation(observation_id, person_id, observation_concept_id, observation_date, observation_datetime, observation_type_concept_id, value_as_number, value_as_string, value_as_concept_id, qualifier_concept_id, unit_concept_id, provider_id, visit_occurrence_id, visit_detail_id, observation_source_value, observation_source_concept_id, unit_source_value, qualifier_source_value, value_source_value, observation_event_id, obs_event_field_concept_id)
SELECT
    nextval('event_id'), o_p.person_id, 4129922, e.created_at, e.created_at::timestamp, 4129922, null, 4129922, null, null, null, null, null, null, null, null, null, null, null, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'OBSERVATION' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;

CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_episode(episode_id, person_id, episode_concept_id, episode_start_date, episode_start_datetime, episode_end_date, episode_end_datetime, episode_parent_id, episode_number, episode_object_concept_id, episode_type_concept_id, episode_source_value, episode_source_concept_id)
SELECT
    nextval('event_id'), o_p.person_id, 4129922, e.created_at, e.created_at::timestamp, e.last_completed, e.last_completed::timestamp, null, null, 4129922, 4129922, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'EPISODE' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;

CREATE SEQUENCE event_id START 1;

INSERT INTO
    omop_note(note_id, person_id, note_date, note_datetime, note_type_concept_id, note_class_concept_id, note_title, note_text, encoding_concept_id, language_concept_id, provider_id, visit_occurrence_id, visit_detail_id, note_source_value, note_event_id, note_event_field_concept_id)
SELECT
    nextval('event_id'), o_p.person_id, e.created_at, e.created_at::timestamp, 4129922, 4129922, e.title, e.description, 4129922, 4129922, null, null, null, null, null, null
FROM
    events e, omop_person o_p
WHERE
    e.category = 'NOTE' AND
    e.patient_id = o_p.person_source_value;

DROP SEQUENCE event_id;