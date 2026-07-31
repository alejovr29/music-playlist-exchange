-- Add platform column to Song with default YOUTUBE
ALTER TABLE `Song`
ADD COLUMN `platform` ENUM('YOUTUBE', 'SPOTIFY') NOT NULL DEFAULT 'YOUTUBE';

-- Add platform column to Playlist with default YOUTUBE
ALTER TABLE `Playlist`
ADD COLUMN `platform` ENUM('YOUTUBE', 'SPOTIFY') NOT NULL DEFAULT 'YOUTUBE';
