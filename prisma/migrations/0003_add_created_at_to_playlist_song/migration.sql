-- Track when a song was added to each playlist.
ALTER TABLE `PlaylistSong`
ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);