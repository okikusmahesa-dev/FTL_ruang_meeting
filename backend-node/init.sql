CREATE DATABASE IF NOT EXISTS ftl;
USE ftl;

CREATE TABLE IF NOT EXISTS ruang_meeting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit VARCHAR(100),
    ruang VARCHAR(100),
    kapasitas INT,
    tanggal_rapat DATE,
    waktu TIME,
    jumlah_peserta INT,
    jenis_konsumsi VARCHAR(100)
);

GRANT ALL PRIVILEGES ON ftl.* TO 'appuser'@'%';
FLUSH PRIVILEGES;