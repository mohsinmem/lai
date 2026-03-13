-- LAI Core Alignment Upgrade (v1.5.0)
-- 1:1 Rename of the 5 Pillars to match Core Architecture Evaluation Layer

-- Rename 'cognitive_framing_score' to 'signal_interpretation_score' using a temporary name to avoid collision
ALTER TABLE diagnostic_results RENAME COLUMN cognitive_framing_score TO temp_signal_interpretation_score;

-- Rename 'strategic_calibration_score' to the new 'cognitive_framing_score'
ALTER TABLE diagnostic_results RENAME COLUMN strategic_calibration_score TO cognitive_framing_score;

-- Finalize the first rename
ALTER TABLE diagnostic_results RENAME COLUMN temp_signal_interpretation_score TO signal_interpretation_score;

-- Rename the remaining 3 pillars straightforwardly
ALTER TABLE diagnostic_results RENAME COLUMN challenge_networks_score TO resource_reallocation_score;
ALTER TABLE diagnostic_results RENAME COLUMN learning_agility_score TO decision_alignment_score;
ALTER TABLE diagnostic_results RENAME COLUMN psychological_stamina_score TO execution_responsiveness_score;

-- Log the upgrade
INSERT INTO scraper_logs (status, summary) 
VALUES ('info', 'System Upgrade to v1.5.0-CORE-ALIGNMENT: Renamed 5 Pillars to match Evaluation Layer logic.');
